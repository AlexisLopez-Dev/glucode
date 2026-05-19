import { useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { IconSpinner } from '../components/icons/Icons';

/**
 * GoogleCallback — Procesa el retorno del flujo OAuth de Google.
 *
 * El backend redirige aquí con ?token=xxx tras autenticar al usuario.
 * Lee el token, actualiza el contexto de autenticación y navega al dashboard.
 * El ref `processed` evita dobles ejecuciones en StrictMode de React.
 */
export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const processed = useRef(false);

  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    if (error || !token) {
      navigate('/login?error=google_auth_failed', { replace: true });
      return;
    }

    login(token)
      .then((hasSettings) => navigate(hasSettings ? '/dashboard' : '/settings', { replace: true }))
      .catch(() => navigate('/login?error=google_auth_failed', { replace: true }));
  }, [token, error, login, navigate]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4">
      <IconSpinner className="w-10 h-10 text-primary" />
      <p className="text-sm text-text-muted">Iniciando sesión con Google...</p>
    </div>
  );
}
