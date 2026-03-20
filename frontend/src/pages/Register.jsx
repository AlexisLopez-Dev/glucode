import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../lib/axios';
import { AuthContext } from '../context/AuthContext';
import { DisclaimerModal } from '../components/ui/DisclaimerModal';

export default function Register() {

  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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
        terms: data.terms
      });
      
      const token = response.data.access_token;
      
      if (token) {
        await login(token);
        console.log('¡Registro y Login exitosos!');
        navigate('/settings');
      } else {
        navigate('/login');
      }
      
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


  return (
  <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md z-10">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">Crear Cuenta</h2>
        <p className="text-center text-gray-500 mb-6">Únete a Glucode para simular tus pautas</p>
        
        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              autoComplete="name"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Alexis López"
              {...register('name', { required: "El nombre es obligatorio" })}
            />
            {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              autoComplete="email"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="alexis@glucode.com"
                {...register('email', { 
                    required: "El email es obligatorio",
                    pattern: { value: /^\S+@\S+$/i, message: "Email no válido" }
                })}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              autoComplete="new-password"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="••••••••"
                {...register('password', { 
                    required: "La contraseña es obligatoria",
                    minLength: { value: 6, message: "Debe tener al menos 6 caracteres" }
                })}
            />
            {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              autoComplete="new-password"
              className={`mt-1 block w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="••••••••"
                {...register('password_confirmation', { 
                required: "Confirma tu contraseña",
                validate: value => value === getValues("password") || "Las contraseñas no coinciden"
                })}
            />
            {errors.password_confirmation && <span className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</span>}
          </div>

          {/* CHECKBOX Y DISCLAIMER MÉDICO */}          
          <div className="flex items-start gap-3 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center shrink-0 mt-0.5">
              <input
                id="terms"
                type="checkbox"
                className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${errors.terms ? 'border-red-500 focus:ring-red-500' : ''}`}
                {...register('terms', { required: "Debes aceptar el aviso médico para continuar" })}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="terms" className="text-sm text-gray-600 leading-snug cursor-pointer block">
                He leído y acepto el{' '}
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDisclaimer(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 underline transition-colors inline align-baseline text-left font-medium"
                >
                  Aviso Médico y Exención de Responsabilidad
                </button>
              </label>
            </div>
          </div>
          {errors.terms && <span className="text-red-500 text-xs block font-bold mt-1.5">{errors.terms.message}</span>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-2 px-4 rounded-lg mt-4 transition duration-200 
              ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
        
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