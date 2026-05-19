import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { SimulationCard } from '../components/simulations/SimulationCard';
import { IconHistory } from '../components/icons/Icons';

/**
 * History — Listado de simulaciones guardadas del usuario
 *
 * Carga GET /simulations y delega el borrado en SimulationCard (DELETE /simulations/:id).
 */
export const History = () => {
    const [simulations, setSimulations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('/simulations');
                setSimulations(response.data.data);
            } catch (error) {
                console.error('Error al cargar el historial:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const handleDeleteSimulation = async (id) => {
        try {
            await axios.delete(`/simulations/${id}`);
            setSimulations(simulations.filter((sim) => sim.id !== id));
        } catch (error) {
            console.error('Error al eliminar la simulación:', error);
            alert('Hubo un error al eliminar la simulación.');
        }
    };

    const SkeletonCard = () => (
        <div className="rounded-2xl border bg-surface border-border shadow-card w-full min-h-[72px] px-5 py-4 flex flex-col xl:flex-row items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-4 w-full xl:w-auto">
                <div className="w-11 h-11 rounded-xl bg-border-subtle shrink-0" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-border-strong rounded" />
                    <div className="h-3 w-24 bg-border rounded" />
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between w-full xl:w-auto gap-4 sm:gap-5">
                <div className="h-10 w-[120px] sm:w-[140px] bg-border-subtle rounded-xl" />
                <div className="h-10 w-[140px] sm:w-[150px] bg-border-subtle rounded-xl" />
                <div className="w-11 h-11 rounded-xl bg-border-subtle shrink-0" />
                <div className="w-6 h-6 rounded bg-border-subtle shrink-0" />
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 lg:p-8 md:flex-1 md:flex md:flex-col md:min-h-0 md:overflow-y-auto">
            <div className="flex flex-col md:flex-1 md:min-h-0 w-full max-w-[1600px] 2xl:max-w-[1760px] mx-auto">
                <header className="mb-4 md:mb-6 shrink-0">
                    <h2 className="text-lg md:text-2xl font-bold text-text">Tu Historial</h2>
                    <p className="font-medium text-xs md:text-sm text-text-subtle">
                        Revisa tus simulaciones pasadas para comprender mejor tus pautas.
                    </p>
                </header>

                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar md:flex-1">
                    {isLoading ? (
                            <div className="flex flex-col gap-4">
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                        ) : simulations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center gap-3 min-h-[280px] md:min-h-full py-12">
                                <IconHistory className="w-8 h-8 text-text-subtle" />
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-text">
                                        Aún no hay simulaciones
                                    </h3>
                                    <p className="font-medium text-sm md:text-base text-text-subtle mt-1">
                                        Ve al panel principal y genera tu primera curva glucémica.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {simulations.map((sim) => (
                                    <SimulationCard
                                        key={sim.id}
                                        simulation={sim}
                                        onDelete={() => handleDeleteSimulation(sim.id)}
                                    />
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};
