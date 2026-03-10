import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export const ParameterPanel = ({ onSimulate, isSimulating }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="bg-white border-y md:border border-gray-200 md:rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-112.5">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Parámetros</h3>
                <p className="text-xs text-gray-500 font-medium">Ajusta los valores para simular</p>
            </div>
            <Link to="/settings" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <span className="text-xl">⚙️</span>
            </Link>
        </div>

        <form onSubmit={handleSubmit(onSimulate)} className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">

                <div className="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <label className="block text-center font-bold text-gray-700 mb-2 text-sm">Glucosa actual</label>
                    <div className="flex items-center justify-center gap-2">
                    <input 
                        type="number" 
                        className={`w-20 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors ${errors.initial_glucose ? 'border-red-500 text-red-600' : 'border-gray-300 focus:border-blue-600 text-gray-800'}`} 
                        placeholder="100" 
                        {...register('initial_glucose', { required: true, min: 20 })} 
                    />
                    <span className="text-lg font-bold text-gray-400 mt-2">mg/dL</span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm relative">
                    <div className="absolute top-3 right-3 group">
                    <span className="text-gray-400 cursor-help text-lg">ℹ️</span>
                    <div className="absolute right-0 w-48 p-3 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 mt-1 shadow-xl hidden md:block">
                        <p className="font-bold mb-1">¿Dudas con las raciones?</p>
                        <p className="text-gray-300">1 ración (R) equivale a 10g de carbohidratos.</p>
                    </div>
                    </div>
                    <label className="block text-center font-bold text-gray-700 mb-2 text-sm">Raciones (HC)</label>
                    <div className="flex items-center justify-center gap-2">
                    <input 
                        type="number" 
                        step="0.5" 
                        className={`w-20 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors ${errors.raciones ? 'border-red-500 text-red-600' : 'border-gray-300 focus:border-blue-600 text-gray-800'}`} 
                        placeholder="6" 
                        {...register('raciones', { required: true, min: 0 })} 
                    />
                    <span className="text-lg font-bold text-gray-400 mt-2">R</span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <label className="block text-center font-bold text-gray-700 mb-2 text-sm">Insulina rápida</label>
                    <div className="flex items-center justify-center gap-2">
                    <input 
                        type="number" 
                        step="0.1" 
                        className={`w-20 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors ${errors.insulin_administered ? 'border-red-500 text-red-600' : 'border-gray-300 focus:border-blue-600 text-gray-800'}`} 
                        placeholder="3.5" 
                        {...register('insulin_administered', { required: true, min: 0 })} 
                    />
                    <span className="text-lg font-bold text-gray-400 mt-2">u</span>
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <button type="submit" disabled={isSimulating} className={`w-full text-white font-bold py-4 rounded-xl text-lg transition-all shadow-lg flex justify-center items-center gap-2 ${isSimulating ? 'bg-gray-400' : 'bg-black hover:bg-gray-800 active:scale-95'}`}>
                    {isSimulating ? 'Calculando...' : '▶ Simular Curva'}
                </button>
            </div>
        </form>
    </div>
  );
};