import { useState } from 'react';
import axios from '../lib/axios';
import { GlucoseChart } from '../components/simulations/GlucoseChart';
import { ParameterPanel } from '../components/simulations/ParameterPanel';

/**
 * Dashboard — Pantalla principal de simulación glucémica
 *
 * Envía los parámetros a POST /simulations y actualiza GlucoseChart con los puntos.
 * Móvil: columna (gráfica arriba, formulario abajo). Escritorio: fila con panel lateral.
 * Usa formId distinto por breakpoint para evitar ids duplicados en el DOM.
 */
export const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSimulate = async (data) => {
    setIsSimulating(true);
    setServerError('');
    try {
      const payload = {
        initial_glucose: parseInt(data.initial_glucose),
        carbs_ingested: parseFloat(data.raciones) * 10,
        insulin_administered: parseFloat(data.insulin_administered),
      };
      const response = await axios.post('/simulations', payload);
      if (response.data.points) {
        setChartData(response.data.points);
      }
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || 'Error al conectar con el servidor.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Diseño tablet y escritorio */}
      <div className="hidden md:flex gap-6 lg:gap-8 p-4 md:p-6 lg:p-8 min-h-full">
        <div className="flex-1 min-h-0 border md:border p-5 md:p-6 bg-surface border-border rounded-2xl flex flex-col">
          <GlucoseChart chartData={chartData} isSimulating={isSimulating} serverError={serverError} />
        </div>
        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <ParameterPanel formId="desktop-param-form" onSimulate={handleSimulate} isSimulating={isSimulating} />
        </div>
      </div>

      {/* Diseño móvil */}
      <div className="flex md:hidden flex-col gap-4 p-4">
        {/* Gráfica a ancho completo (mín. 280px) */}
        <div className="border-y md:border p-5 md:p-6 bg-surface border-border rounded-2xl min-h-[280px]">
          <GlucoseChart chartData={chartData} isSimulating={isSimulating} serverError={serverError} />
        </div>
        {/* Panel de parámetros y botón Simular */}
        <ParameterPanel formId="mobile-param-form" onSimulate={handleSimulate} isSimulating={isSimulating} />
      </div>


    </div>
  );
};