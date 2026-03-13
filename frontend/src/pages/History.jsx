import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { SimulationCard } from '../components/simulations/SimulationCard';

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
        const isConfirmed = window.confirm('¿Estás seguro de que quieres eliminar esta simulación? Esta acción no se puede deshacer.');
        
        if (isConfirmed) {
        try {
            await axios.delete(`/simulations/${id}`);
            setSimulations(simulations.filter(sim => sim.id !== id));
        } catch (error) {
            console.error("Error al eliminar la simulación:", error);
            alert('Hubo un error al eliminar la simulación.');
        }
        }
    };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
            
            <header className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tu Historial</h2>
                <p className="text-gray-500 mt-1">Revisa tus simulaciones pasadas para comprender mejor tus pautas.</p>
            </header>
            
            {isLoading ? (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            ) : simulations.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800">Aún no hay simulaciones</h3>
                <p className="text-gray-500 mt-2">Ve al panel principal y genera tu primera curva glucémica.</p>
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