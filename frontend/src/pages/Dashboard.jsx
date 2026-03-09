import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

export const Dashboard = () => {

  const { user, logout } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [chartData, setChartData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    setIsSimulating(true);
    setServerError('');
    
    try {

      const payload = {
        initial_glucose: parseInt(data.initial_glucose),
        // Conversión de raciones a gramos antes de mandar al servidor
        carbs_ingested: parseFloat(data.raciones) * 10, 
        insulin_administered: parseFloat(data.insulin_administered)
      };

      const response = await axios.post('/simulations', payload);
      
      if (response.data.points) {
        setChartData(response.data.points);
      }
    } catch (err) {
      console.error(err);
      setServerError(
        err.response?.data?.message || 'Error al conectar con el servidor.'
      );
    } finally {
      setIsSimulating(false);
    }
  };

  // Letrero informativo que se muestra al pasar el ratón por la gráfica
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
        <div className="bg-white p-4 border border-gray-100 shadow-xl rounded-2xl">
          <p className="text-sm text-gray-500 font-bold mb-1">Minuto {label}</p>
          <p className={`text-2xl font-black ${valueColor} transition-colors duration-200`}>
            {glucoseValue} <span className="text-sm font-bold text-gray-400">mg/dL</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20">
        <div className="p-8 pb-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Glucode<span className="text-blue-600">.</span>
          </h1>
        </div>
        <nav className="mt-4 flex flex-col gap-2 px-4 flex-1">
          <Link to="/dashboard" className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl font-bold transition-colors flex items-center gap-3">
            📊 Simulador
          </Link>
          <Link to="#" className="text-gray-500 hover:bg-gray-50 px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-3">
            🕒 Historial
          </Link>
        </nav>
      </aside>

      {/* CONTENEDOR DERECHO */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOPBAR */}
        <header className="h-24 flex items-center justify-between px-10 bg-white border-b border-gray-200 shadow-sm z-10">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Panel Principal</h2>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 pl-6">
              <div className="text-right">
                <p className="font-bold text-sm text-gray-800">{user?.name}</p>
                <button
                  onClick={logout}
                  className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl shadow-inner cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* ZONA PRINCIPAL */}
        <main className="flex-1 flex overflow-hidden">

          {/* ÁREA DE LA GRÁFICA */}
          <section className="flex-1 p-8 flex flex-col bg-gray-50/50 overflow-y-auto">
            <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm flex flex-col relative overflow-hidden min-h-100 p-8">
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Proyección Glucémica</h3>
                  <p className="text-gray-400 font-medium text-sm">Evolución estimada en las próximas 4 horas</p>
                </div>
                
                {chartData.length > 0 && (
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span> 
                    Zona Segura (70 - 180)
                  </div>
                )}
              </div>

              {serverError && (
                <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
                  ⚠️ {serverError}
                </div>
              )}

              {/* RENDERIZADO CONDICIONAL DE LA GRÁFICA */}
              <div className="flex-1 min-h-0 flex flex-col">
                {chartData.length === 0 ? (
                  // Cargando
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <span className="text-6xl mb-4 block animate-bounce">
                      {isSimulating ? '🔬' : '📈'}
                    </span>
                    <p className="text-gray-400 font-medium text-xl">
                      {isSimulating ? 'Calculando metabolismo...' : 'Introduce tus parámetros para simular'}
                    </p>
                  </div>
                ) : (
                  // Gráfica
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      
                      <XAxis 
                        dataKey="minute" 
                        tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 600 }} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(val) => `${val}min`}
                        minTickGap={30}
                      />
                      
                      <YAxis 
                        domain={[0, dataMax => Math.max(dataMax + 40, 200)]} 
                        tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 600 }} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 2, strokeDasharray: '5 5' }} />
                      
                      <ReferenceArea y1={70} y2={180} fill="#10B981" fillOpacity={0.06} />

                      <Line 
                        type="monotone" 
                        dataKey="glucose_value" 
                        stroke="#2563EB" 
                        strokeWidth={5} 
                        dot={false}
                        activeDot={{ r: 8, strokeWidth: 4, stroke: 'white', fill: '#2563EB' }}
                        animationDuration={2000}
                        animationEasing="ease-in-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

            </div>
          </section>

          {/* PANEL DE CONTROL DERECHO */}
          <aside className="w-84 p-8 pl-0 flex flex-col shrink-0 overflow-y-auto">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Parámetros</h3>
                  <p className="text-xs text-gray-500 font-medium">Ajusta los valores para simular</p>
                </div>
                <Link
                  to="/settings"
                  title="Configurar perfil médico"
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <span className="text-xl">⚙️</span>
                </Link>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1 flex flex-col">
                {/* Card Glucosa Inicial */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                  <label className="block text-center font-bold text-gray-700 mb-3 text-sm">Glucosa actual</label>
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      className={`w-20 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors
                        ${errors.initial_glucose ? 'border-red-500 text-red-600' : 'border-gray-300 focus:border-blue-600 text-gray-800'}`}
                      placeholder="100"
                      {...register('initial_glucose', { required: true, min: 20 })}
                    />
                    <span className="text-xl font-bold text-gray-400 mt-2">mg/dL</span>
                  </div>
                </div>

                {/* Card Raciones */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors relative">
                  
                  {/* Icono explicativo */}
                  <div className="absolute top-3 right-3 group">
                    <span className="text-gray-400 cursor-help text-lg">ℹ️</span>
                    <div className="absolute right-0 w-48 p-3 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 mt-1 shadow-xl">
                      <p className="font-bold mb-1">¿Dudas con las raciones?</p>
                      <p className="text-gray-300">1 ración (R) equivale a 10g de carbohidratos.</p>
                      <p className="text-blue-300 mt-2 font-semibold">Módulo de aprendizaje próximamente.</p>
                    </div>
                  </div>

                  <label className="block text-center font-bold text-gray-700 mb-3 text-sm">Raciones (HC)</label>
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      step="0.5" 
                      className={`w-20 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors
                        ${errors.raciones ? 'border-red-500 text-red-600' : 'border-gray-300 focus:border-blue-600 text-gray-800'}`}
                      placeholder="6"
                      {...register('raciones', { required: true, min: 0 })}
                    />
                    <span className="text-xl font-bold text-gray-400 mt-2">R</span>
                  </div>
                </div>

                {/* Card Insulina */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                  <label className="block text-center font-bold text-gray-700 mb-3 text-sm">Insulina rápida</label>
                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      className={`w-20 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors
                        ${errors.insulin_administered ? 'border-red-500 text-red-600' : 'border-gray-300 focus:border-blue-600 text-gray-800'}`}
                      placeholder="3.5"
                      {...register('insulin_administered', { required: true, min: 0 })}
                    />
                    <span className="text-xl font-bold text-gray-400 mt-2">u</span>
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <button
                    type="submit"
                    disabled={isSimulating}
                    className={`w-full text-white font-bold py-4 rounded-xl text-lg transition-all shadow-lg flex justify-center items-center gap-2
                      ${isSimulating ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 active:scale-95'}`}
                  >
                    {isSimulating ? 'Calculando...' : '▶ Simular Curva'}
                  </button>
                </div>
              </form>
            </div>
          </aside>

        </main>
      </div>
    </div>
  );
}