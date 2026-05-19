import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { IconWarning, IconSpinner, IconSimulator } from '../icons/Icons';

const getGlucoseValueClass = (glucoseValue) => {
    if (glucoseValue <= 40 || glucoseValue >= 250) return 'text-glucose-low';
    if ((glucoseValue > 40 && glucoseValue < 70) || (glucoseValue > 180 && glucoseValue < 250)) return 'text-glucose-high';
    if (glucoseValue >= 70 && glucoseValue <= 180) return 'text-glucose-normal';
    return 'text-primary';
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const glucoseValue = payload[0].value;
        const valueClass = getGlucoseValueClass(glucoseValue);

        return (
            <div className="p-3 md:p-4 rounded-2xl z-50 bg-surface border border-border-subtle shadow-xl pointer-events-none">
                <p className="text-sm font-bold mb-1 text-text-muted">
                    Minuto {label}
                </p>
                <p className={`text-2xl font-black transition-colors duration-200 ${valueClass}`}>
                    {glucoseValue}{' '}
                    <span className="text-sm font-bold text-text-subtle">mg/dL</span>
                </p>
            </div>
        );
    }
    return null;
};

/**
 * GlucoseChart — Gráfica de proyección glucémica (Recharts)
 *
 * Props:
 *  - chartData     — puntos { minute, glucose_value } devueltos por la API
 *  - isSimulating  — muestra estado de carga mientras se calcula la simulación
 *  - serverError   — mensaje de error del servidor, si lo hay
 *  - compact       — variante reducida para usar dentro de SimulationCard
 *
 * Colorea valores y zonas según rangos clínicos (mg/dL).
 */
export const GlucoseChart = ({ chartData, isSimulating, serverError, compact = false }) => {
  return (
    <div className="glucose-chart relative overflow-hidden w-full h-full flex flex-col">
        {!compact && (
          <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                  <h3 className="text-lg md:text-2xl font-bold text-text">
                      Proyección Glucémica
                  </h3>
                  <p className="font-medium text-xs md:text-sm text-text-subtle">
                      Evolución estimada en 4 horas
                  </p>
              </div>
              {chartData.length > 0 && (
                  <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm font-bold px-3 py-1.5 rounded-lg border text-zone-safe-accent bg-zone-safe-subtle border-zone-safe-border">
                      <span className="w-2 h-2 md:w-3 md:h-3 rounded-full animate-pulse bg-zone-safe-dot" />
                      Zona Segura
                  </div>
              )}
          </div>
        )}

        {serverError && (
            <div className="mb-4 p-4 rounded-xl border font-medium text-sm flex items-center gap-2 bg-danger-subtle border-danger-border-soft text-danger-strong">
                <IconWarning className="w-4 h-4 shrink-0" /> {serverError}
            </div>
        )}

        <div className={`flex-1 w-full relative ${compact ? 'min-h-[200px]' : 'min-h-[240px] md:min-h-[300px] mt-4'}`}>

            {chartData.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3">
                    <span className="text-text-subtle">
                        {isSimulating
                            ? <IconSpinner className="w-10 h-10" />
                            : <IconSimulator className="w-8 h-8" />
                        }
                    </span>
                    <p className="font-medium text-base md:text-lg text-text-subtle">
                        {isSimulating
                            ? 'Calculando metabolismo...'
                            : 'Ajusta los valores y pulsa Simular'
                        }
                    </p>
                </div>
            ) : (
                <div className="absolute inset-0">
                    <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 400, height: 300 }}>
                        <LineChart
                            data={chartData}
                            accessibilityLayer={false}
                            margin={compact
                                ? { top: 10, right: 0, left: -25, bottom: 0 }
                                : { top: 20, right: 10, left: -25, bottom: 0 }
                            }
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                            <XAxis
                                dataKey="minute"
                                tick={{ fill: 'var(--color-chart-tick)', fontSize: 12, fontWeight: 600 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val} min`}
                                minTickGap={30}
                            />
                            <YAxis
                                domain={[0, dataMax => Math.max(dataMax + 40, 200)]}
                                tick={{ fill: 'var(--color-chart-tick)', fontSize: 12, fontWeight: 600 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={false} />
                            <ReferenceArea
                                y1={70}
                                y2={180}
                                fill="var(--color-glucose-safe-fill)"
                                fillOpacity={0.06}
                            />
                            <Line
                                type="monotone"
                                dataKey="glucose_value"
                                stroke="var(--color-glucose-chart-line)"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    strokeWidth: 3,
                                    stroke: 'white',
                                    fill: 'var(--color-glucose-chart-line)',
                                    style: { pointerEvents: 'none' },
                                }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>

    </div>
  );
};
