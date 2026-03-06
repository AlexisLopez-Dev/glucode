<?php

namespace App\Http\Controllers;

use App\Models\MedicalSetting;
use Illuminate\Http\Request;

class MedicalSettingController extends Controller {

    public function show(Request $request)
    {
        $settings = MedicalSetting::where('user_id', $request->user()->id)->first();

        if (!$settings) {
            return response()->json(['message' => 'Configuración no encontrada'], 404);
        }

        return response()->json($settings);
    }


    public function store(Request $request)
    {
        $validado = $request->validate([
            'carb_ratio' => 'required|numeric|min:0.1',
            'correction_start' => 'required|integer|min:50',
            'correction_step' => 'required|integer|min:1',
            'correction_units' => 'required|numeric|min:0.1',
        ]);

        // Cálculo de el factor de sensibilidad
        $factor = $validado['correction_step'] / $validado['correction_units'];

        $validado['sensitivity_factor'] = round($factor, 2);

        $settings = MedicalSetting::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validado
        );

        return response()->json([
            'message' => 'Configuración médica guardada correctamente',
            'data' => $settings
        ]);
    }

}
