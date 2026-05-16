import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { IconSettings, IconInfo, IconPlay, IconSpinner } from '../icons/Icons';

export const ParameterPanel = ({ onSimulate, isSimulating }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="bg-surface border-y md:border border-border md:rounded-3xl p-6 shadow-sm flex flex-col h-full min-h-112.5">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-xl font-bold text-text-strong mb-1">Parámetros</h3>
                <p className="text-xs text-text-muted font-medium">Ajusta los valores para simular</p>
            </div>
            <Link to="/settings" className="p-2 text-text-subtle hover:text-primary hover:bg-primary-subtle rounded-lg transition-all">
                <IconSettings className="w-5 h-5" />
            </Link>
        </div>

        <form onSubmit={handleSubmit(onSimulate)} className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">

                <div className="bg-surface-alt p-4 md:p-5 rounded-2xl border border-border-subtle shadow-sm">
                    <label className="block text-center font-bold text-text-secondary mb-2 text-sm">Glucosa actual</label>
                    <div className="flex items-center justify-center gap-2">
                    <input 
                        type="number" 
                        className={`w-20 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors ${errors.initial_glucose ? 'border-danger-strong text-danger-strong' : 'border-border-strong focus:border-primary text-text'}`} 
                        placeholder="100" 
                        {...register('initial_glucose', { required: true, min: 20 })} 
                    />
                    <span className="text-lg font-bold text-text-subtle mt-2">mg/dL</span>
                    </div>
                </div>

                <div className="bg-surface-alt p-4 md:p-5 rounded-2xl border border-border-subtle shadow-sm relative">
                    <div className="absolute top-3 right-3 group">
                    <span className="text-text-subtle cursor-help"><IconInfo className="w-4 h-4" /></span>
                    <div className="absolute right-0 w-48 p-3 bg-inverse-surface text-on-primary text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 mt-1 shadow-xl hidden md:block">
                        <p className="font-bold mb-1">¿Dudas con las raciones?</p>
                        <p className="text-inverse-text">1 ración (R) equivale a 10g de carbohidratos.</p>
                    </div>
                    </div>
                    <label className="block text-center font-bold text-text-secondary mb-2 text-sm">Raciones (HC)</label>
                    <div className="flex items-center justify-center gap-2">
                    <input 
                        type="number" 
                        step="0.5" 
                        className={`w-20 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors ${errors.raciones ? 'border-danger-strong text-danger-strong' : 'border-border-strong focus:border-primary text-text'}`} 
                        placeholder="6" 
                        {...register('raciones', { required: true, min: 0 })} 
                    />
                    <span className="text-lg font-bold text-text-subtle mt-2">R</span>
                    </div>
                </div>

                <div className="bg-surface-alt p-4 md:p-5 rounded-2xl border border-border-subtle shadow-sm">
                    <label className="block text-center font-bold text-text-secondary mb-2 text-sm">Insulina rápida</label>
                    <div className="flex items-center justify-center gap-2">
                    <input 
                        type="number" 
                        step="0.1" 
                        className={`w-20 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors ${errors.insulin_administered ? 'border-danger-strong text-danger-strong' : 'border-border-strong focus:border-primary text-text'}`} 
                        placeholder="3.5" 
                        {...register('insulin_administered', { required: true, min: 0 })} 
                    />
                    <span className="text-lg font-bold text-text-subtle mt-2">u</span>
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <button type="submit" disabled={isSimulating} className={`w-full text-on-primary font-bold py-4 rounded-xl text-lg transition-all shadow-lg flex justify-center items-center gap-2 ${isSimulating ? 'bg-disabled-strong' : 'bg-cta-strong hover:bg-cta-strong-hover active:scale-95'}`}>
                    {isSimulating
                        ? <><IconSpinner className="w-5 h-5" /><span>Calculando...</span></>
                        : <><IconPlay className="w-5 h-5" /><span>Simular Curva</span></>}
                </button>
            </div>
        </form>
    </div>
  );
};