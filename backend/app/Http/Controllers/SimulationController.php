<?php

namespace App\Http\Controllers;

use App\Models\Simulation;
use App\Models\MedicalSetting;
use Illuminate\Http\Request;

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

        return response()->json([
            'message' => 'Simulación guardada correctamente',
            'data' => $simulation
        ], 201);
    }

}
