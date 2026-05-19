import { useState } from 'react';
import axios from '../lib/axios';
import { GlucoseChart } from '../components/simulations/GlucoseChart';
import { ParameterPanel } from '../components/simulations/ParameterPanel';

/**
 * Dashboard — Pantalla principal de simulación glucémica.
 * Una sola instancia de GlucoseChart (modo normal, gráfica grande).
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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 min-h-full">

        <div className="flex-1 min-w-0 border rounded-2xl bg-surface border-border shadow-card p-5 md:p-6 flex flex-col min-h-[420px] md:min-h-[520px]">
          <GlucoseChart
            chartData={chartData}
            isSimulating={isSimulating}
            serverError={serverError}
          />
        </div>

        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <ParameterPanel
            formId="simulation-form"
            onSimulate={handleSimulate}
            isSimulating={isSimulating}
          />
        </div>

      </div>
    </div>
  );
};
