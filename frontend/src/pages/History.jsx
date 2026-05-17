import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { SimulationCard } from '../components/simulations/SimulationCard';

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
            console.error("Error al cargar el historial:", error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchHistory();
    }, []);

    const handleDeleteSimulation = async (id) => {
        try {
            await axios.delete(`/simulations/${id}`);
            setSimulations(simulations.filter(sim => sim.id !== id));
        } catch (error) {
            console.error("Error al eliminar la simulación:", error);
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
    <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full bg-surface-alt/50">
        <div className="max-w-5xl mx-auto">
            
            <header className="mb-8">
                <h2 className="text-3xl font-black text-text-strong tracking-tight">Tu Historial</h2>
                <p className="text-text-muted mt-1">Revisa tus simulaciones pasadas para comprender mejor tus pautas.</p>
            </header>
            
            {isLoading ? (
            <div className="flex flex-col gap-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
            ) : simulations.length === 0 ? (
            <div className="bg-surface p-12 rounded-3xl border border-border-strong text-center shadow-sm">
                <h3 className="text-2xl font-bold text-text">Aún no hay simulaciones</h3>
                <p className="text-text-muted mt-2">Ve al panel principal y genera tu primera curva glucémica.</p>
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
    </main>
  );
};