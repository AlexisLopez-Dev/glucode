<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedicalSettingController;
use App\Http\Controllers\SimulationController;
use App\Http\Controllers\SocialAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'status' => 'ok',
        'message' => '¡Hola desde el Backend de Glucode! (Ahora, con auto-deploy funcionando)',
    ]);
});

// Google OAuth — stateless, sin sesiones web
Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);

// Rutas públicas de autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/email/verify', [AuthController::class, 'verifyEmail']);
Route::post('/email/resend', [AuthController::class, 'resendVerificationCode']);

// Rutas privadas (requieren token + cuenta verificada)
Route::middleware(['auth:sanctum', 'verified'])->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Configuraciones médicas del usuario
    Route::get('/medical-settings', [MedicalSettingController::class, 'show']);
    Route::post('/medical-settings', [MedicalSettingController::class, 'store']);

    // Historial de simulaciones
    Route::get('/simulations', [SimulationController::class, 'index']);
    Route::get('/simulations/{id}', [SimulationController::class, 'show']);
    Route::delete('/simulations/{id}', [SimulationController::class, 'destroy']);
    Route::post('/simulations', [SimulationController::class, 'store']);

});
