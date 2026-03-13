import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

// Componente complementario: Letrero informativo que se muestra al pasar el ratón por la gráfica
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const glucoseValue = payload[0].value;
        let valueColor = 'text-blue-600'; 
        
        if (glucoseValue <= 40 || glucoseValue >= 250) {
            valueColor = 'text-red-600'; 
        } else if ((glucoseValue > 40 && glucoseValue < 70) || (glucoseValue > 180 && glucoseValue < 250)) {
            valueColor = 'text-orange-500'; 
        }

        return (
        <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-2xl z-50">
            <p className="text-sm text-gray-500 font-bold mb-1">Minuto {label}</p>
            <p className={`text-2xl font-black ${valueColor} transition-colors duration-200`}>
            {glucoseValue} <span className="text-sm font-bold text-gray-400">mg/dL</span>
            </p>
        </div>
        );
    }
    return null;
};

// Componente principal
export const GlucoseChart = ({ chartData, isSimulating, serverError, compact = false }) => {
  return (
    <div className={`relative overflow-hidden w-full h-full flex flex-col
      ${compact ? '' : 'flex-1 bg-white md:rounded-3xl border-y md:border border-gray-200 shadow-sm min-h-[350px] md:min-h-[400px] p-4 md:p-8'}
    `}>

        {!compact && (
          <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800">Proyección Glucémica</h3>
                  <p className="text-gray-400 font-medium text-xs md:text-sm">Evolución estimada en 4 horas</p>
              </div>
              {chartData.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                  <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-400 animate-pulse"></span> 
                  Zona Segura
              </div>
              )}
          </div>
        )}

        {serverError && (
            <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium text-sm">
                ⚠️ {serverError}
            </div>
        )}

        <div className={`flex-1 w-full relative ${compact ? 'min-h-[200px]' : 'min-h-[300px] mt-4'}`}>
            
            {chartData.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-5xl md:text-6xl mb-4 block animate-bounce">
                    {isSimulating ? '🔬' : '📈'}
                </span>
                <p className="text-gray-400 font-medium text-lg md:text-xl">
                    {isSimulating ? 'Calculando metabolismo...' : 'Introduce tus parámetros'}
                </p>
            </div>
            ) : (
            <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 400, height: 300 }}>
                <LineChart data={chartData} margin={compact ? { top: 10, right: 0, left: -25, bottom: 0 } : { top: 20, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="minute" tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} tickFormatter={(val) => `${val} min`} minTickGap={30} />
                    <YAxis domain={[0, dataMax => Math.max(dataMax + 40, 200)]} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 2, strokeDasharray: '5 5' }} />
                    <ReferenceArea y1={70} y2={180} fill="#10B981" fillOpacity={0.06} />
                    <Line type="monotone" dataKey="glucose_value" stroke="#2563EB" strokeWidth={4} dot={false} activeDot={{ r: 6, strokeWidth: 3, stroke: 'white', fill: '#2563EB' }} animationDuration={1500} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            )}
        </div>
        
    </div>
  );
};