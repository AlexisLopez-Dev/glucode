import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

export const History = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [simulations, setSimulations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    useEffect(() => {
        const fetchHistory = async () => {
        try {
            const response = await axios.get('/simulations');
            // Hay que acceder a response.data.data porque Laravel paginate envuelve los resultados en un objeto "data" adicional
            setSimulations(response.data.data); 
        } catch (error) {
            console.error("Error al cargar el historial:", error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchHistory();
    }, []);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            <Topbar toggleSidebar={toggleSidebar} />

            <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Historial de Simulaciones</h2>
                    
                    {isLoading ? (
                    <p className="text-gray-500">Cargando tu historial...</p>
                    ) : simulations.length === 0 ? (
                    <div className="bg-white p-10 rounded-3xl border border-gray-200 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800">Aún no hay simulaciones</h3>
                        <p className="text-gray-500 mt-2">Ve al simulador y genera tu primera curva glucémica.</p>
                    </div>
                    ) : (
                    <div className="space-y-4">
                        {/* Tarjetas de cada simulación */}
                        {simulations.map((sim) => (
                        <div key={sim.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <p className="font-bold">Glucosa inicial: {sim.initial_glucose} mg/dL</p>
                            <p className="text-gray-500">Raciones: {sim.carbs_ingested / 10} R | Insulina: {sim.insulin_administered} u</p>
                        </div>
                        ))}
                    </div>
                    )}
                    
                </div>
            </main>
        </div>
    </div>
  );
};