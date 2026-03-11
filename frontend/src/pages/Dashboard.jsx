import { useState } from 'react';
import axios from '../lib/axios';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { GlucoseChart } from '../components/simulations/GlucoseChart';
import { ParameterPanel } from '../components/simulations/ParameterPanel';

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
        insulin_administered: parseFloat(data.insulin_administered)
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
    <main className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-full w-full">
        
        <div className="flex-1 min-h-[400px] lg:min-h-0">
          <GlucoseChart chartData={chartData} isSimulating={isSimulating} serverError={serverError} />
        </div>
        
        <div className="w-full lg:w-84 shrink-0">
          <ParameterPanel onSimulate={handleSimulate} isSimulating={isSimulating} />
        </div>

      </div>
    </main>
  );
};