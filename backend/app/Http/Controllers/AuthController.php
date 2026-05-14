<?php

namespace App\Http\Controllers;

use App\Mail\VerificationCodeMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $reglas = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'terms' => 'accepted',
        ];

        $mensajes = [
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo no es válido.',
            'password.min' => 'La contraseña debe tener al menos 6 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
            'name.required' => 'El nombre es obligatorio.',
            'terms.accepted' => 'El aviso médico debe ser aceptado obligatoriamente para usar el servicio.',
        ];

        $validado = $request->validate($reglas, $mensajes);

        $user = User::create($validado);

        $this->sendVerificationCode($user);

        return response()->json([
            'message' => 'Cuenta creada. Te hemos enviado un código de verificación a tu correo.',
            'email' => $user->email,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $reglas = [
            'email' => 'required|email',
            'password' => 'required',
        ];

        $mensajes = [
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo no es válido.',
            'password.required' => 'La contraseña es obligatoria.',
        ];

        $request->validate($reglas, $mensajes);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Las credenciales son incorrectas.',
            ], 401);
        }

        if (! $user->hasVerifiedEmail()) {
            $this->sendVerificationCode($user);

            return response()->json([
                'message' => 'Tu cuenta aún no está verificada. Te hemos reenviado el código a tu correo.',
                'requires_verification' => true,
                'email' => $user->email,
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
        ], [
            'email.exists' => 'No existe ninguna cuenta con ese correo.',
            'code.size' => 'El código debe tener 6 dígitos.',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Esta cuenta ya está verificada.'], 422);
        }

        if ($user->verification_code !== $request->code) {
            return response()->json(['message' => 'El código de verificación es incorrecto.'], 422);
        }

        if ($user->verification_code_expires_at->isPast()) {
            return response()->json(['message' => 'El código ha expirado. Solicita uno nuevo.'], 422);
        }

        $user->forceFill([
            'email_verified_at' => now(),
            'verification_code' => null,
            'verification_code_expires_at' => null,
        ])->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->fresh(),
        ]);
    }

    public function resendVerificationCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'No existe ninguna cuenta con ese correo.',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Esta cuenta ya está verificada.'], 422);
        }

        $this->sendVerificationCode($user);

        return response()->json([
            'message' => 'Hemos enviado un nuevo código de verificación a tu correo.',
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente',
        ]);
    }

    private function sendVerificationCode(User $user): void
    {
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->forceFill([
            'verification_code' => $code,
            'verification_code_expires_at' => now()->addMinutes(15),
        ])->save();

        Mail::to($user->email)->send(new VerificationCodeMail($code, $user->name));
    }
}
