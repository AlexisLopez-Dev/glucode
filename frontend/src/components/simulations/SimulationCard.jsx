import { useState } from 'react';
import { GlucoseChart } from './GlucoseChart';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import { IconHistory, IconArrowRight, IconCarbs, IconInsulin, IconTrash } from '../icons/Icons';

/**
 * SimulationCard — Tarjeta expandible de una simulación del historial
 *
 * Props:
 *  - simulation — registro con glucose_points, parámetros y fecha
 *  - onDelete   — callback al confirmar el borrado (id de la simulación)
 *
 * Al expandir muestra la gráfica en modo compact y abre ConfirmDeleteModal al eliminar.
 */
export const SimulationCard = ({ simulation, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const finalGlucose = simulation.glucose_points?.length > 0
        ? simulation.glucose_points[simulation.glucose_points.length - 1].glucose_value
        : '--';

    const formattedDate = new Date(simulation.created_at).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    const chartData = simulation.glucose_points || [];

    const getGlucoseColor = (value) => {
        if (value === null || value === undefined || value === '--' || isNaN(value)) {
            return 'text-text-muted';
        }
        const n = Number(value);
        if (n <= 40 || n >= 250) return 'text-glucose-low';
        if ((n > 40 && n < 70) || (n > 180 && n < 250)) return 'text-glucose-high';
        return 'text-glucose-normal';
    };

    return (
        <div className="rounded-2xl border overflow-hidden transition-all duration-300 bg-surface border-border shadow-card">
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
                className="w-full min-h-[72px] px-5 py-4 flex flex-col xl:flex-row items-center justify-between gap-4 transition-colors duration-150 focus:outline-none cursor-pointer hover:bg-surface-alt"
            >
                <div className="flex items-center gap-4 w-full xl:w-auto">
                    <div className="p-3 rounded-xl shrink-0 bg-primary-subtle-strong text-primary">
                        <IconHistory className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold capitalize text-text">{formattedDate}</p>
                        <p className="text-xs font-medium text-text-muted">Simulación guardada</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between w-full xl:w-auto gap-4 sm:gap-5">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-surface-alt border-border-subtle">
                        <span
                            title="Glucosa inicial"
                            className={`font-bold ${getGlucoseColor(simulation.initial_glucose)}`}
                        >
                            {simulation.initial_glucose}
                        </span>
                        <IconArrowRight className="w-4 h-4 text-text-subtle" />
                        <span
                            title="Glucosa final (4h)"
                            className={`font-black ${getGlucoseColor(finalGlucose)}`}
                        >
                            {finalGlucose}{' '}
                            <span className="text-xs font-normal text-text-muted">mg/dL</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl border bg-primary-subtle/50 border-primary-subtle-strong/50">
                        <div className="flex items-center gap-1.5" title="Raciones de Hidratos">
                            <IconCarbs className="w-4 h-4 text-primary" />
                            <span className="font-bold text-text-secondary">
                                {simulation.carbs_ingested / 10} R
                            </span>
                        </div>
                        <div className="w-px h-5 bg-border-strong" />
                        <div className="flex items-center gap-1.5" title="Insulina administrada">
                            <IconInsulin className="w-4 h-4 text-primary" />
                            <span className="font-bold text-text-secondary">
                                {simulation.insulin_administered} U
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                        }}
                        title="Eliminar simulación"
                        className="flex items-center justify-center touch-target rounded-xl transition-all duration-150 focus:outline-none
                          text-text-subtle hover:text-danger-strong hover:bg-danger-subtle"
                    >
                        <IconTrash className="w-5 h-5" />
                    </button>

                    <div className={`shrink-0 transition-transform duration-300 text-text-subtle ${isOpen ? 'rotate-180' : ''}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            <div
                className={`transition-all duration-500 ease-in-out origin-top overflow-hidden
                  ${isOpen ? 'max-h-[600px] opacity-100 border-t border-border-subtle' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-4 sm:p-6 bg-surface-alt/50">
                    <div className="h-[250px] sm:h-[300px] w-full p-4 rounded-xl border bg-surface border-border shadow-inner">
                        {isOpen && (
                            <GlucoseChart chartData={chartData} isSimulating={false} compact={true} />
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onConfirm={() => {
                    setIsModalOpen(false);
                    onDelete();
                }}
            />
        </div>
    );
};
