import { useState } from 'react';
import { GlucoseChart } from './GlucoseChart';

export const SimulationCard = ({ simulation, onDelete }) => {

    const [isOpen, setIsOpen] = useState(false);

    const finalGlucose = simulation.glucose_points?.length > 0 
        ? simulation.glucose_points[simulation.glucose_points.length - 1].glucose_value 
        : '--';

    const formattedDate = new Date(simulation.created_at).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const chartData = simulation.glucose_points || [];

    const getGlucoseColor = (value) => {
        if (value === null || value === undefined || value === '--' || isNaN(value)) {
            return 'text-text-muted'; 
        }
        
        const numValue = Number(value);
        if (numValue <= 40 || numValue >= 250) return 'text-danger-strong'; 
        if ((numValue > 40 && numValue < 70) || (numValue > 180 && numValue < 250)) return 'text-glucose-high'; 
        
        return 'text-glucose-normal'; 
    };

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      
        {/* Cabecera informativa (siempre visible) */}
        <div 
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }
            }}
            className="w-full px-5 py-4 flex flex-col xl:flex-row items-center justify-between gap-4 hover:bg-surface-alt transition-colors focus:outline-none cursor-pointer"
        >
            {/* Fecha */}
            <div className="flex items-center gap-4 w-full xl:w-auto">
                <div className="bg-primary-subtle-strong text-primary p-3 rounded-xl shrink-0">
                    <span className="text-xl">🕒</span>
                </div>
                <div className="text-left">
                    <p className="font-bold text-text capitalize">{formattedDate}</p>
                    <p className="text-xs text-text-muted font-medium">Simulación guardada</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between w-full xl:w-auto gap-4 sm:gap-6">
            
                {/* Evolución de la Glucosa */}
                <div className="flex items-center gap-2 bg-surface-alt px-4 py-2 rounded-xl border border-border-subtle">
                    <span 
                    title="Glucosa inicial" 
                    className={`font-bold ${getGlucoseColor(simulation.initial_glucose)}`}
                    >
                        {simulation.initial_glucose}
                    </span>
                    <span className="text-text-subtle text-sm">➔</span>
                    <span 
                    title="Glucosa final (4h)" 
                    className={`font-black ${getGlucoseColor(finalGlucose)}`}
                    >
                        {finalGlucose} <span className="text-xs font-normal text-text-muted">mg/dL</span>
                    </span>
                </div>

                {/* Raciones e Insulina */}
                <div className="flex items-center gap-3 bg-primary-subtle/50 px-4 py-2 rounded-xl border border-primary-subtle-strong/50">
                    <div className="flex items-center gap-1.5" title="Raciones de Hidratos">
                        <span>🍎</span>
                        <span className="font-bold text-text-secondary">{simulation.carbs_ingested / 10} R</span>
                    </div>
                    <div className="w-px h-5 bg-border-strong"></div>
                    <div className="flex items-center gap-1.5" title="Insulina administrada">
                        <span>💉</span>
                        <span className="font-bold text-text-secondary">{simulation.insulin_administered} U</span>
                    </div>
                </div>

                {/* Botón de borrado */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    title="Eliminar simulación"
                    className="p-2 text-text-subtle hover:text-danger-strong hover:bg-danger-subtle rounded-xl transition-colors focus:outline-none"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>

                {/* Flecha para indicar si la card está desplegada */}
                <div className={`text-text-subtle transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

            </div>
        </div>

        {/* Contenido desplegado (gráfica) */}
        <div 
            className={`transition-all duration-500 ease-in-out origin-top overflow-hidden
            ${isOpen ? 'max-h-[600px] opacity-100 border-t border-border-subtle' : 'max-h-0 opacity-0'}
            `}
        >
            <div className="p-4 sm:p-6 bg-surface-alt/50">
                <div className="h-[250px] sm:h-[300px] w-full bg-surface p-4 rounded-xl border border-border shadow-inner">
                    {isOpen && (
                        <GlucoseChart chartData={chartData} isSimulating={false} compact={true} />
                    )}
                </div>
            </div>
        </div>

    </div>
  );
};