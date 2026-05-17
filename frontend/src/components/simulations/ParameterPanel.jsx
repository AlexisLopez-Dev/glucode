import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { IconSettings, IconInfo, IconPlay, IconSpinner } from '../icons/Icons';

/**
 * ParameterPanel — Formulario de parámetros para la simulación glucémica
 *
 * Props:
 *  - formId       — id del formulario (permite distinguir instancias móvil/escritorio)
 *  - onSimulate   — callback al enviar el formulario con los datos validados
 *  - isSimulating — indica si hay una simulación en curso
 */
export const ParameterPanel = ({ formId = 'parameter-form', onSimulate, isSimulating }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const inputBlockClass = 'p-4 md:p-5 border bg-surface-alt border-border-subtle rounded-xl shadow-sm';

    const inputClass = (hasError) =>
        `w-24 min-h-12 text-center text-3xl font-black bg-transparent border-b-4 focus:outline-none pb-1 transition-colors duration-150
     ${hasError
            ? 'border-danger-strong text-danger-strong'
            : 'border-border-strong focus:border-primary text-text'}`;

    return (
        <div className="border-y md:border p-5 md:p-6 flex flex-col h-full bg-surface border-border rounded-2xl">
            {/* Cabecera del panel */}
            <div className="flex justify-between items-start mb-5">
                <div>
                    <h3 className="text-xl font-bold mb-0.5 text-text-strong">
                        Parámetros
                    </h3>
                    <p className="text-xs font-medium text-text-muted">
                        Ajusta los valores para simular
                    </p>
                </div>
                <Link
                    to="/settings"
                    className="flex items-center justify-center rounded-lg transition-all duration-150
                               text-text-subtle hover:text-primary hover:bg-primary-subtle touch-target"
                >
                    <IconSettings className="w-5 h-5" />
                </Link>
            </div>

            {/* Formulario de simulación */}
            <form
                id={formId}
                onSubmit={handleSubmit(onSimulate)}
                className="space-y-4 flex-1 flex flex-col"
            >
                <div className="space-y-4 flex-1">

                    {/* Glucosa actual */}
                    <div className={inputBlockClass}>
                        <label className="block text-center font-bold text-sm mb-3 text-text-secondary">
                            Glucosa actual
                        </label>
                        <div className="flex items-center justify-center gap-2">
                            <input
                                id={`${formId}-glucose`}
                                type="number"
                                className={inputClass(errors.initial_glucose)}
                                placeholder="100"
                                {...register('initial_glucose', { required: true, min: 20 })}
                            />
                            <span className="text-lg font-bold mt-2 text-text-subtle">
                                mg/dL
                            </span>
                        </div>
                    </div>

                    {/* Raciones */}
                    <div className={`${inputBlockClass} relative`}>
                        <div className="absolute top-3 right-3 group">
                            <span className="text-text-subtle cursor-help">
                                <IconInfo className="w-4 h-4" />
                            </span>
                            <div className="absolute right-0 w-52 p-3 text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 mt-1 hidden md:block bg-inverse-surface text-on-primary shadow-xl">
                                <p className="font-bold mb-1">¿Dudas con las raciones?</p>
                                <p className="text-inverse-text">1 ración (R) equivale a 10 g de carbohidratos.</p>
                            </div>
                        </div>
                        <label className="block text-center font-bold text-sm mb-3 text-text-secondary">
                            Raciones (HC)
                        </label>
                        <div className="flex items-center justify-center gap-2">
                            <input
                                id={`${formId}-carbs`}
                                type="number"
                                step="0.5"
                                className={inputClass(errors.raciones)}
                                placeholder="6"
                                {...register('raciones', { required: true, min: 0 })}
                            />
                            <span className="text-lg font-bold mt-2 text-text-subtle">R</span>
                        </div>
                    </div>

                    {/* Insulina */}
                    <div className={inputBlockClass}>
                        <label className="block text-center font-bold text-sm mb-3 text-text-secondary">
                            Insulina rápida
                        </label>
                        <div className="flex items-center justify-center gap-2">
                            <input
                                id={`${formId}-insulin`}
                                type="number"
                                step="0.1"
                                className={inputClass(errors.insulin_administered)}
                                placeholder="3.5"
                                {...register('insulin_administered', { required: true, min: 0 })}
                            />
                            <span className="text-lg font-bold mt-2 text-text-subtle">u</span>
                        </div>
                    </div>
                </div>

                {/* Botón de simulación */}
                <div className="pt-5">
                    <button
                        id={`${formId}-submit-btn`}
                        type="submit"
                        disabled={isSimulating}
                        className="w-full font-bold py-4 rounded-xl text-lg transition-all duration-150 flex justify-center items-center gap-2 active:scale-95
                                   text-on-primary shadow-lg bg-dark-surface hover:bg-dark-surface-alt
                                   disabled:bg-disabled-strong disabled:cursor-not-allowed disabled:hover:bg-disabled-strong"
                    >
                        {isSimulating
                            ? <><IconSpinner className="w-5 h-5" /><span>Calculando...</span></>
                            : <><IconPlay className="w-5 h-5" /><span>Simular</span></>
                        }
                    </button>
                </div>
            </form>
        </div>
    );
};
