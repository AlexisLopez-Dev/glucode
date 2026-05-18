<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback(): RedirectResponse
    {
        $frontendUrl = config('app.frontend_url');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            return redirect($frontendUrl.'/login?error=google_auth_failed');
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            $updates = [];

            if (! $user->google_id) {
                $updates['google_id'] = $googleUser->getId();
            }

            if (! $user->hasVerifiedEmail()) {
                $updates['email_verified_at'] = now();
            }

            if (! empty($updates)) {
                $user->forceFill($updates)->save();
            }
        } else {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'email_verified_at' => now(),
                'password' => null,
            ]);
        }

        $token = $user->createToken('google_auth_token')->plainTextToken;

        return redirect($frontendUrl.'/auth/google/callback?token='.$token);
    }
}
