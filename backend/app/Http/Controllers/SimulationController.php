<?php

namespace App\Http\Controllers;

use App\Models\GlucosePoint;
use App\Models\MedicalSetting;
use App\Models\Simulation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SimulationController extends Controller
{
    // Ventana de simulación
    private const SIMULATION_DURATION_MINUTES = 240;

    private const SIMULATION_STEP_MINUTES = 5;

    // Glucosa interna (modelo): sin concentraciones negativas en el cálculo acumulado
    private const GLUCOSE_MODEL_MIN = 0;

    // Valor mostrado (CGM): suelo típico de sensor; no se escribe en la glucosa interna
    private const GLUCOSE_SAFETY_FLOOR = 30;

    private const CGM_NOISE_RANGE = 3;

    // Límites compartidos de fase (minutos)
    private const PHASE_1_END = 30;

    private const PHASE_2_END = 90;

    private const PHASE_3_END = 150;

    // Pasos por fase: cuántas veces avanza el bucle (de 5 en 5 min) dentro de cada tramo.
    // Ej.: 0–30 min → 6 pasos; en cada paso se aplica (fracción de la fase) / (pasos de la fase).
    private const PHASE_1_STEPS = 6;     // 0–30 min

    private const PHASE_2_STEPS = 12;    // 30–90 min

    private const PHASE_3_STEPS = 12;    // 90–150 min

    private const PHASE_4_STEPS = 18;    // 150–240 min

    // Carbos (digestión mixta): qué parte de la subida total por carbohidratos cae en cada fase.
    // Las cuatro fracciones suman 1; el aporte en un intervalo de 5 min es (fracción de la fase) / (pasos de la fase).
    private const CARB_FRACTION_PHASE_1 = 0.15;

    private const CARB_FRACTION_PHASE_2 = 0.55;

    private const CARB_FRACTION_PHASE_3 = 0.20;

    private const CARB_FRACTION_PHASE_4 = 0.10;

    // Insulina rápida: qué parte del descenso total por insulina se reparte en cada fase.
    // Las cuatro fracciones suman 1; la bajada en un intervalo de 5 min es (fracción de la fase) / (pasos de la fase).
    private const INSULIN_FRACTION_PHASE_1 = 0.10;

    private const INSULIN_FRACTION_PHASE_2 = 0.50;

    private const INSULIN_FRACTION_PHASE_3 = 0.25;

    private const INSULIN_FRACTION_PHASE_4 = 0.15;

    public function index(Request $request): JsonResponse
    {
        $simulations = Simulation::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->with('glucosePoints')
            ->paginate(10);

        return response()->json($simulations);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $simulation = Simulation::with('glucosePoints')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($simulation);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $simulation = Simulation::where('user_id', $request->user()->id)->find($id);

        if (! $simulation) {
            return response()->json(['message' => 'Simulación no encontrada'], 404);
        }

        $simulation->delete();

        return response()->json(['message' => 'Simulación eliminada correctamente']);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'carbs_ingested' => 'required|integer|min:0',
            'initial_glucose' => 'required|integer|min:20',
            'insulin_administered' => 'required|numeric|min:0',
        ]);

        $settings = MedicalSetting::where('user_id', $request->user()->id)->first();

        if (! $settings) {
            return response()->json([
                'message' => 'Debes configurar tu perfil médico antes de hacer una simulación.',
            ], 400);
        }

        $simulation = Simulation::create([
            'user_id' => $request->user()->id,
            'carbs_ingested' => $validated['carbs_ingested'],
            'initial_glucose' => $validated['initial_glucose'],
            'insulin_administered' => $validated['insulin_administered'],
            'ratio_snapshot' => $settings->carb_ratio,
            'factor_snapshot' => $settings->sensitivity_factor,
        ]);

        $totalCarbRise = $validated['carbs_ingested'] * ($settings->sensitivity_factor / $settings->carb_ratio);
        $totalInsulinDrop = $validated['insulin_administered'] * $settings->sensitivity_factor;

        $points = $this->generateGlucosePoints(
            $simulation,
            $validated['initial_glucose'],
            $totalCarbRise,
            $totalInsulinDrop
        );

        GlucosePoint::insert($points);

        return response()->json([
            'message' => 'Simulación guardada correctamente',
            'data' => $simulation,
            'points' => $points,
        ], 201);
    }

    /**
     * Genera todos los puntos de glucosa de la ventana de simulación completa,
     * aplicando absorción de carbohidratos, acción de la insulina, suelo interno (sin negativos),
     * suelo típico de CGM en el valor guardado y ruido del sensor.
     *
     * @return array<int, array<string, mixed>>
     */
    private function generateGlucosePoints(
        Simulation $simulation,
        float $initialGlucose,
        float $totalCarbRise,
        float $totalInsulinDrop
    ): array {
        $points = [];
        $currentTime = now();
        $currentGlucose = $initialGlucose;

        $points[] = $this->buildPoint($simulation->id, 0, round($currentGlucose), $currentTime);

        for (
            $minute = self::SIMULATION_STEP_MINUTES;
            $minute <= self::SIMULATION_DURATION_MINUTES;
            $minute += self::SIMULATION_STEP_MINUTES
        ) {
            $currentGlucose += $this->calculateCarbImpact($minute, $totalCarbRise);
            $currentGlucose -= $this->calculateInsulinImpact($minute, $totalInsulinDrop);

            // Suelo del modelo: la glucosa interna no baja de 0 (sin concentraciones negativas).
            $currentGlucose = max($currentGlucose, self::GLUCOSE_MODEL_MIN);

            // Suelo del valor persistido (CGM): recorte típico por debajo de 30; no se sobrescribe la glucosa interna.
            $displayGlucose = max(
                round($currentGlucose) + rand(-self::CGM_NOISE_RANGE, self::CGM_NOISE_RANGE),
                self::GLUCOSE_SAFETY_FLOOR
            );

            $points[] = $this->buildPoint($simulation->id, $minute, $displayGlucose, $currentTime);
        }

        return $points;
    }

    /**
     * Devuelve el incremento de glucosa en cada paso (cada 5 min) por absorción de carbohidratos,
     * según un modelo de digestión mixta en cuatro fases.
     */
    private function calculateCarbImpact(int $minute, float $totalCarbRise): float
    {
        if ($minute <= self::PHASE_1_END) {
            return $totalCarbRise * (self::CARB_FRACTION_PHASE_1 / self::PHASE_1_STEPS);
        }

        if ($minute <= self::PHASE_2_END) {
            return $totalCarbRise * (self::CARB_FRACTION_PHASE_2 / self::PHASE_2_STEPS);
        }

        if ($minute <= self::PHASE_3_END) {
            return $totalCarbRise * (self::CARB_FRACTION_PHASE_3 / self::PHASE_3_STEPS);
        }

        return $totalCarbRise * (self::CARB_FRACTION_PHASE_4 / self::PHASE_4_STEPS);
    }

    /**
     * Devuelve la reducción de glucosa en cada paso por la acción de la insulina rápida,
     * repartida en cuatro fases farmacocinéticas.
     */
    private function calculateInsulinImpact(int $minute, float $totalInsulinDrop): float
    {
        if ($minute <= self::PHASE_1_END) {
            return $totalInsulinDrop * (self::INSULIN_FRACTION_PHASE_1 / self::PHASE_1_STEPS);
        }

        if ($minute <= self::PHASE_2_END) {
            return $totalInsulinDrop * (self::INSULIN_FRACTION_PHASE_2 / self::PHASE_2_STEPS);
        }

        if ($minute <= self::PHASE_3_END) {
            return $totalInsulinDrop * (self::INSULIN_FRACTION_PHASE_3 / self::PHASE_3_STEPS);
        }

        return $totalInsulinDrop * (self::INSULIN_FRACTION_PHASE_4 / self::PHASE_4_STEPS);
    }

    /**
     * Construye un único registro de punto de glucosa para la inserción masiva.
     *
     * @return array<string, mixed>
     */
    private function buildPoint(int $simulationId, int $minute, float $glucoseValue, Carbon $timestamp): array
    {
        return [
            'simulation_id' => $simulationId,
            'minute' => $minute,
            'glucose_value' => $glucoseValue,
            'created_at' => $timestamp,
            'updated_at' => $timestamp,
        ];
    }
}
