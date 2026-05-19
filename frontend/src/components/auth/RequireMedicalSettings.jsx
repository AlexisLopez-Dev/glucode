import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * RequireMedicalSettings — Guard de rutas para el simulador e historial.
 *
 * Redirige a /settings si el usuario autenticado aún no tiene parámetros médicos.
 */
export function RequireMedicalSettings() {
  const { hasMedicalSettings } = useContext(AuthContext);

  if (!hasMedicalSettings) {
    return <Navigate to="/settings" replace />;
  }

  return <Outlet />;
}
