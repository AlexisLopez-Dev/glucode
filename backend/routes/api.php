<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedicalSettingController;
use App\Http\Controllers\SimulationController;


Route::get('/ping', function () {
    return response()->json([
        'status' => 'ok',
        'message' => '¡Hola desde el Backend de Glucode! (Ahora, con auto-deploy funcionando)'
    ]);
});


// Rutas públicas
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Rutas privadas
Route::middleware('auth:sanctum')->group(function () {

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
    Route::post('/simulations', [SimulationController::class, 'store']);

});
