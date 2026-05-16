import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../lib/axios';
import { AuthContext } from '../context/AuthContext';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-elevated">
      <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">Glucode</h2>
        
        {serverError && (
          <div className="bg-danger-subtle border border-danger-border text-danger-text px-4 py-3 rounded mb-4 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary">Email</label>
            <input
              type="email"
              autoComplete="username"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light ${errors.email ? 'border-danger-strong' : 'border-border-strong'}`}
              placeholder="alexis@glucode.com"
              {...register('email', { 
                  required: "El email es obligatorio",
                  pattern: { value: /^\S+@\S+$/i, message: "Email no válido" }
              })}
            />
            {errors.email && <span className="text-danger-strong text-xs mt-1">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary">Contraseña</label>
            <input
              type="password"
              autoComplete="current-password"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light ${errors.password ? 'border-danger-strong' : 'border-border-strong'}`}
              placeholder="••••••••"
              {...register('password', { 
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" }
              })}
            />
            {errors.password && <span className="text-danger-strong text-xs mt-1">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-on-primary font-bold py-2 px-4 rounded-lg transition duration-200 
              ${isSubmitting ? 'bg-disabled-soft cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Entrar'}
          </button>

           <p className="mt-6 text-center text-sm text-text-secondary">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                    Regístrate aquí
                </Link>
            </p> 

        </form>
      </div>
    </div>
  );
}