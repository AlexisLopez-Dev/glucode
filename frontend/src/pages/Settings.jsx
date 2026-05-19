import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../lib/axios';
import { AuthContext } from '../context/AuthContext';
import { MadLibInput } from '../components/forms/MadLibInput';
import { IconArrowRight, IconSpinner, IconSimulator } from '../components/icons/Icons';
import { Logo } from '../components/common/Logo';

/**
 * SettingsForm — Formulario de parámetros clínicos.
 *
 * Componente separado a nivel de módulo (fuera de Settings) para que React
 * mantenga una referencia estable entre renders. Definirlo dentro de Settings
 * causaba que el teclado virtual en móvil disparase un re-render que desmontaba
 * el formulario y perdía los valores escritos antes de enviar.
 */
function SettingsForm({ register, handleSubmit, onSubmit, errors, isSubmitting, loadError, serverError, navigate, showBackButton, isOnboarding }) {
    return (
        <>
            {showBackButton && (
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-text-muted hover:text-text transition-colors duration-150 mb-6 text-sm font-medium"
                    aria-label="Volver atrás"
                >
                    <IconArrowRight className="w-4 h-4 rotate-180" />
                    Volver
                </button>
            )}

            <h2 className="text-2xl font-bold text-text-strong mb-1">Parámetros Clínicos</h2>
            <p className="text-text-muted text-sm mb-6">
                {isOnboarding
                    ? 'Antes de usar el simulador, configura tus factores metabólicos.'
                    : 'Define tus factores para que el simulador se adapte a tu perfil metabólico.'}
            </p>



            {/* Error al cargar */}
            {loadError && (
                <p className="text-danger-strong text-sm mb-4">{loadError}</p>
            )}

            {/* Error al enviar */}
            {serverError && (
                <div className="bg-danger-subtle border border-danger-border text-danger-text px-4 py-3 rounded-lg mb-6 text-sm">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Sección comidas */}
                <div className="text-base text-text-secondary leading-relaxed">
                    <span className="text-text-muted font-semibold text-xs uppercase tracking-wide block mb-3">
                        Para las comidas:
                    </span>
                    1 unidad de insulina me cubre
                    <MadLibInput
                        name="carb_ratio"
                        register={register}
                        errors={errors}
                        placeholder="10"
                        step="0.1"
                        rules={{ required: true, min: 0.1 }}
                        inputWidth="w-16"
                        textSize="text-base"
                    />
                    gramos (ej. 10 g = 1 Ración).
                </div>

                {/* Sección corrección */}
                <div className="text-base text-text-secondary leading-relaxed">
                    <span className="text-text-muted font-semibold text-xs uppercase tracking-wide block mb-3">
                        Para corregir hiperglucemias:
                    </span>
                    <p className="mb-2">
                        Corrijo a partir de{' '}
                        <MadLibInput
                            name="correction_start"
                            register={register}
                            errors={errors}
                            placeholder="150"
                            rules={{ required: true, min: 50 }}
                            inputWidth="w-16"
                            textSize="text-base"
                        />{' '}
                        mg/dL.
                    </p>
                    <p>
                        Por cada{' '}
                        <MadLibInput
                            name="correction_step"
                            register={register}
                            errors={errors}
                            placeholder="50"
                            rules={{ required: true, min: 1 }}
                            inputWidth="w-16"
                            textSize="text-base"
                        />{' '}
                        mg/dL extra, sumo{' '}
                        <MadLibInput
                            name="correction_units"
                            register={register}
                            errors={errors}
                            placeholder="1"
                            step="0.1"
                            rules={{ required: true, min: 0.1 }}
                            inputWidth="w-16"
                            textSize="text-base"
                        />{' '}
                        unidades de insulina.
                    </p>
                </div>

                {/* Botón de guardar */}
                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full min-h-[44px] text-on-primary font-bold py-3 px-8 rounded-xl text-base
                            transition-all duration-150 active:scale-95
                            ${isSubmitting
                                ? 'bg-disabled-strong cursor-not-allowed'
                                : 'bg-dark-surface hover:bg-dark-surface-alt'
                            }`}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar configuración'}
                    </button>
                </div>
            </form>
        </>
    );
}

/**
 * Settings — Configuración de parámetros médicos del usuario
 *
 * Formulario tipo "mad lib" (ratio de carbos, corrección) enviado a POST /medical-settings.
 * En montaje, hace GET /medical-settings para pre-rellenar valores existentes.
 * Tras guardar, redirige al dashboard.
 *
 * Diseño responsive con un solo formulario en el DOM (móvil + escritorio comparten el mismo SettingsForm).
 */
export default function Settings() {
    const { hasMedicalSettings, refreshMedicalSettings } = useContext(AuthContext);
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading]     = useState(true);
    const [loadError, setLoadError]     = useState('');
    const navigate = useNavigate();
    const isOnboarding = !hasMedicalSettings;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    /* ── Cargar configuración existente ── */
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/medical-settings');
                const s = response.data?.data ?? response.data;
                if (s && s.carb_ratio != null) {
                    reset({
                        carb_ratio:        s.carb_ratio,
                        correction_start:  s.correction_start,
                        correction_step:   s.correction_step,
                        correction_units:  s.correction_units,
                    });
                }
            } catch (err) {
                // 404 = sin configuración aún → formulario vacío, sin error visible
                if (err.response?.status !== 404) {
                    setLoadError('No se pudo cargar la configuración actual.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [reset]);

    /* Guardar configuración */
    const onSubmit = async (data) => {
        setServerError('');
        try {
            const payload = {
                carb_ratio:        parseFloat(data.carb_ratio),
                correction_start:  parseInt(data.correction_start),
                correction_step:   parseInt(data.correction_step),
                correction_units:  parseFloat(data.correction_units),
            };
            await axios.post('/medical-settings', payload);
            await refreshMedicalSettings();
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response?.data?.errors) {
                const [[primerError] = ['Revisa los datos introducidos']] = Object.values(err.response.data.errors);
                setServerError(primerError);
            } else {
                setServerError('Error al guardar la configuración.');
            }
        }
    };

    /* Cargando */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <IconSpinner className="w-10 h-10 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-surface">
            <div className="h-16 flex md:hidden items-center justify-center bg-dark-surface shrink-0">
                <div className="flex items-center gap-2 text-dark-text">
                    <Logo variant="full" theme="dark" size="lg" />
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-sm">
                        <SettingsForm
                            register={register}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            errors={errors}
                            isSubmitting={isSubmitting}
                            loadError={loadError}
                            serverError={serverError}
                            navigate={navigate}
                            showBackButton={hasMedicalSettings}
                            isOnboarding={isOnboarding}
                        />
                    </div>
                </div>
            </div>

            <div className="hidden md:flex w-1/2 flex-col bg-dark-surface p-10 shrink-0">
                <div className="mb-auto">
                    <div className="flex items-center gap-2 text-dark-text">
                        <Logo variant="full" theme="dark" size="lg" />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 gap-6">
                    <div
                        className="flex items-center justify-center bg-dark-surface-alt rounded-2xl p-6"
                        style={{ boxShadow: '0 0 32px 4px rgba(37, 99, 235, 0.35)' }}
                    >
                        <IconSimulator className="w-20 h-20 text-primary" />
                    </div>

                    <h3 className="text-dark-text font-bold text-xl mt-2">
                        Parámetros Clínicos
                    </h3>
                    <p className="text-dark-text-muted text-sm text-center max-w-xs leading-relaxed">
                        Define tus factores para que el simulador se adapte a tu perfil metabólico.
                    </p>
                </div>
            </div>
        </div>
    );
}