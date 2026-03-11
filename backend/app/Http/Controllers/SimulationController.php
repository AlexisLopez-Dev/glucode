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
            ->with('glucosePoints')
            ->paginate(10);

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

        // La configuración médica actual del usuario
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
        $currentTime = now();

        $totalCarbRise = $validado['carbs_ingested'] * ($settings->sensitivity_factor / $settings->carb_ratio);
        $totalInsulinDrop = $validado['insulin_administered'] * $settings->sensitivity_factor;

        $currentGlucose = $validado['initial_glucose'];

        // Punto Inicial (Minuto 0)
        $points[] = [
            'simulation_id' => $simulation->id,
            'minute' => 0,
            'glucose_value' => round($currentGlucose),
            'created_at' => $currentTime,
            'updated_at' => $currentTime,
        ];

        // Bucle de 4 horas, calculando cada 5 minutos
        for ($minute = 5; $minute <= 240; $minute += 5) {

            $carbImpact = 0;
            $insulinImpact = 0;

            // DISTRIBUCIÓN DE CARBOHIDRATOS (Digestión)
            if ($minute <= 30) {
                // Min 0 a 30: Absorbe el 10%
                $carbImpact = $totalCarbRise * (0.10 / 6);
            } elseif ($minute <= 90) {
                // Min 30 a 90: Absorbe el 60% (Pico de digestión)
                $carbImpact = $totalCarbRise * (0.60 / 12);
            } elseif ($minute <= 180) {
                // Min 90 a 180: Absorbe el 25% (Fase tardía)
                $carbImpact = $totalCarbRise * (0.25 / 18);
            } else {
                // Min 180 a 240: Absorbe el 5% (Cola de digestión)
                $carbImpact = $totalCarbRise * (0.05 / 12);
            }

            // DISTRIBUCIÓN DE INSULINA RÁPIDA
            if ($minute <= 30) {
                // Min 0 a 30: Actúa el 5% (Onset lento)
                $insulinImpact = $totalInsulinDrop * (0.05 / 6);
            } elseif ($minute <= 90) {
                // Min 30 a 90: Actúa el 40% (Aceleración)
                $insulinImpact = $totalInsulinDrop * (0.40 / 12);
            } elseif ($minute <= 180) {
                // Min 90 a 180: Actúa el 45% (Pico máximo sostenido)
                $insulinImpact = $totalInsulinDrop * (0.45 / 18);
            } else {
                // Min 180 a 240: Actúa el 10% (Desvanecimiento)
                $insulinImpact = $totalInsulinDrop * (0.10 / 12);
            }

            // Aplicamos los impactos al nivel de glucosa actual
            $currentGlucose += $carbImpact;
            $currentGlucose -= $insulinImpact;

            // Condicional para evitar glucosas negativas por seguridad (Hipoglucemia severa)
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

        GlucosePoint::insert($points);

        // --- FIN GENERACIÓN DE PUNTOS ---

        return response()->json([
            'message' => 'Simulación guardada correctamente',
            'data' => $simulation,
            'points' => $points
        ], 201);
    }

}
