import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../lib/axios';
import { AuthContext } from '../context/AuthContext';
import { IconSimulator, IconWarning } from '../components/icons/Icons';
import { Logo } from '../components/common/Logo';

/**
 * Login — Inicio de sesión con email y contraseña
 *
 * POST /login; guarda el token vía AuthContext y redirige al dashboard.
 * Si la cuenta no está verificada, envía a /verify-email.
 */
export default function Login() {
  const { login } = useContext(AuthContext);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const response = await axios.post('/login', data);
      await login(response.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response?.data?.requires_verification) {
        sessionStorage.setItem('pending_verification_email', err.response.data.email);
        navigate('/verify-email');
        return;
      }
      setServerError(err.response?.data?.message || 'Credenciales incorrectas o error de conexión.');
    }
  };

  const inputClass = (hasError) =>
    `block w-full px-4 min-h-12 rounded-md border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary
     ${hasError ? 'border-danger-strong' : 'border-border'}`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Panel izquierdo — zona de marca oscura */}
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

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-surface">
        <div className="w-full max-w-[420px]">
          <h2 className="text-2xl font-black tracking-tight mb-1 text-text-strong">
            Iniciar sesión
          </h2>
          <p className="text-sm mb-8 text-text-muted">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold underline text-primary hover:text-primary-darker">
              Regístrate aquí
            </Link>
          </p>

          {serverError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm font-medium border bg-danger-subtle border-danger-border text-danger-text">
              <IconWarning className="w-4 h-4 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-text-secondary">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
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
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputClass(!!errors.password)}
                {...register('password', {
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
              />
              {errors.password && (
                <span className="text-xs mt-1 block text-danger-strong">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-12 font-bold text-base rounded-md transition-all duration-150 active:scale-95
                         text-on-primary bg-dark-surface hover:bg-dark-surface-alt
                         disabled:bg-disabled-strong disabled:cursor-not-allowed disabled:hover:bg-disabled-strong"
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

