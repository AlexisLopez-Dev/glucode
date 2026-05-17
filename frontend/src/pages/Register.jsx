import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../lib/axios';
import { DisclaimerModal } from '../components/modals/DisclaimerModal';
import { IconSimulator, IconWarning } from '../components/icons/Icons';
import { Logo } from '../components/common/Logo';

/**
 * Register — Alta de usuario nueva
 *
 * Requiere aceptar DisclaimerModal antes de enviar POST /register.
 * Guarda el email en sessionStorage y redirige a /verify-email.
 */
export default function Register() {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, getValues, setValue, formState: { errors, isSubmitting } } = useForm();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const response = await axios.post('/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        terms: data.terms,
      });
      sessionStorage.setItem('pending_verification_email', response.data.email);
      navigate('/verify-email');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        const erroresServidor = err.response?.data?.errors || {};
        const [[primerError] = ['Error desconocido o de conexión']] = Object.values(erroresServidor);
        setServerError(primerError);
      } else {
        setServerError('Error de conexión o el servidor no responde.');
      }
    }
  };

  const inputClass = (hasError) =>
    `block w-full px-4 min-h-12 rounded-md border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary
     ${hasError ? 'border-danger-strong' : 'border-border'}`;

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">

        <div
          className="flex-shrink-0 flex flex-col items-center justify-center
                     h-16 md:h-auto md:w-[45%] p-6 md:p-14 bg-dark-surface"
        >
          <div className="flex items-center gap-2 text-dark-text">
            <Logo variant="full" theme="dark" size="lg" />
          </div>

          <div className="hidden md:flex flex-col items-center mt-12 gap-10">
            <p className="text-lg font-medium text-center text-dark-text-muted">
              Descifra tu diabetes
            </p>

            <div
              className="w-32 h-32 flex items-center justify-center rounded-2xl bg-dark-surface-alt"
              style={{ boxShadow: '0 0 32px 4px rgba(37, 99, 235, 0.35)' }}
            >
              <IconSimulator className="w-20 h-20 text-primary" />
            </div>

            <p className="text-sm text-center max-w-xs leading-relaxed text-dark-text-muted">
              Simula cómo afectan la insulina y los carbohidratos a tu glucosa. Una herramienta educativa para ti y tu familia.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto bg-surface">
          <div className="w-full max-w-[420px] py-4">

            <h2 className="text-2xl font-black tracking-tight mb-1 text-text-strong">
              Crear cuenta
            </h2>
            <p className="text-sm mb-8 text-text-muted">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-semibold underline text-primary hover:text-primary-darker">
                Inicia sesión
              </Link>
            </p>

            {serverError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm font-medium border bg-danger-subtle border-danger-border text-danger-text">
                <IconWarning className="w-4 h-4 shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text-secondary">
                  Nombre
                </label>
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alexis López"
                  className={inputClass(!!errors.name)}
                  {...register('name', { required: 'El nombre es obligatorio' })}
                />
                {errors.name && (
                  <span className="text-xs mt-1 block text-danger-strong">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text-secondary">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  autoComplete="email"
                  placeholder="alexis@glucode.com"
                  className={inputClass(!!errors.email)}
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: { value: /^\S+@\S+$/i, message: 'Email no válido' },
                  })}
                />
                {errors.email && (
                  <span className="text-xs mt-1 block text-danger-strong">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text-secondary">
                  Contraseña
                </label>
                <input
                  id="reg-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={inputClass(!!errors.password)}
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 6, message: 'Debe tener al menos 6 caracteres' },
                  })}
                />
                {errors.password && (
                  <span className="text-xs mt-1 block text-danger-strong">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5 text-text-secondary">
                  Confirmar contraseña
                </label>
                <input
                  id="reg-password-confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={inputClass(!!errors.password_confirmation)}
                  {...register('password_confirmation', {
                    required: 'Confirma tu contraseña',
                    validate: value => value === getValues('password') || 'Las contraseñas no coinciden',
                  })}
                />
                {errors.password_confirmation && (
                  <span className="text-xs mt-1 block text-danger-strong">
                    {errors.password_confirmation.message}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-3 pt-4 border-t border-border-subtle">
                <div className="flex items-center shrink-0 mt-0.5">
                  <input
                    id="terms"
                    type="checkbox"
                    className={`w-4 h-4 rounded accent-primary
                      ${errors.terms ? 'border-danger-strong' : 'border-border-strong'}`}
                    {...register('terms', { required: 'Debes aceptar el aviso médico para continuar' })}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="terms" className="text-sm leading-snug cursor-pointer block text-text-secondary">
                    He leído y acepto el{' '}
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setShowDisclaimer(true); }}
                      className="underline font-semibold transition-colors duration-150 inline align-baseline text-primary hover:text-primary-darker"
                    >
                      Aviso Médico y Exención de Responsabilidad
                    </button>
                  </label>
                </div>
              </div>
              {errors.terms && (
                <span className="text-xs block font-bold text-danger-strong">
                  {errors.terms.message}
                </span>
              )}

              <button
                id="reg-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-12 font-bold text-base rounded-md transition-all duration-150 active:scale-95 mt-2
                           text-on-primary bg-dark-surface hover:bg-dark-surface-alt
                           disabled:bg-disabled-strong disabled:cursor-not-allowed disabled:hover:bg-disabled-strong"
              >
                {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
              </button>

            </form>
          </div>
        </div>

      </div>

      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAccept={() => {
          setValue('terms', true);
          setShowDisclaimer(false);
        }}
      />
    </>
  );
}
