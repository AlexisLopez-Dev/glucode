<?php

namespace App\Http\Controllers;

use App\Models\Simulation;
use App\Models\MedicalSetting;
use Illuminate\Http\Request;
use App\Models\GlucosePoint;

class SimulationController extends Controller {

    public function index(Request $request)
    {
        $simulations = Simulation::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($simulations);
    }


    public function show(Request $request, $id)
    {
        // Devuelve la simulación junto con su array de puntos
        $simulation = Simulation::with('glucosePoints')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($simulation);
    }


    public function store(Request $request)
    {
        $validado = $request->validate([
            'carbs_ingested' => 'required|integer|min:0',
            'initial_glucose' => 'required|integer|min:20',
            'insulin_administered' => 'required|numeric|min:0',
        ]);

        // Buscamos la configuración médica actual del usuario
        $settings = MedicalSetting::where('user_id', $request->user()->id)->first();

        if (!$settings) {
            return response()->json([
                'message' => 'Debes configurar tu perfil médico antes de hacer una simulación.'
            ], 400);
        }

        $simulation = Simulation::create([
            'user_id' => $request->user()->id,
            'carbs_ingested' => $validado['carbs_ingested'],
            'initial_glucose' => $validado['initial_glucose'],
            'insulin_administered' => $validado['insulin_administered'],

            'ratio_snapshot' => $settings->carb_ratio,
            'factor_snapshot' => $settings->sensitivity_factor,
        ]);

        // --- INICIO GENERACIÓN DE PUNTOS ---

        $points = [];
        $currentTime = now(); // Para el bulk insert

        $totalCarbRise = $validado['carbs_ingested'] * ($settings->sensitivity_factor / $settings->carb_ratio);
        $totalInsulinDrop = $validado['insulin_administered'] * $settings->sensitivity_factor;

        $currentGlucose = $validado['initial_glucose'];

        // Bucle de 4 horas (240 minutos), creando un punto cada 5 minutos
        for ($minute = 0; $minute <= 240; $minute += 5) {

            // En la primera mitad (0-120 min), los hidratos se absorben rápido.
            // En la segunda mitad (120-240 min), la insulina termina de actuar.

            if ($minute > 0 && $minute <= 120) {
                // Sube por la comida (repartido en 24 tramos de 5 min)
                $currentGlucose += ($totalCarbRise / 24);
                // Baja un poco por la insulina temprana
                $currentGlucose -= ($totalInsulinDrop * 0.4 / 24);

            } elseif ($minute > 120) {
                // Sigue bajando por la insulina tardía
                $currentGlucose -= ($totalInsulinDrop * 0.6 / 24);
            }

            // Evitar que la glucosa sea negativa (hipoglucemia severa irreal)
            if ($currentGlucose < 20) {
                $currentGlucose = 20;
            }

            $points[] = [
                'simulation_id' => $simulation->id,
                'minute' => $minute,
                'glucose_value' => round($currentGlucose),
                'created_at' => $currentTime,
                'updated_at' => $currentTime,
            ];
        }

        // Bulk insert: Guardamos todos los puntos de golpe en 1 sola consulta
        GlucosePoint::insert($points);

        // --- FIN GENERACIÓN DE PUNTOS ---

        return response()->json([
            'message' => 'Simulación guardada correctamente',
            'data' => $simulation
        ], 201);
    }

}
