import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { AuthContext } from './AuthContext';

/**
 * AuthProvider — Contexto de autenticación (Laravel Sanctum)
 *
 * Al montar, valida el token en localStorage contra GET /user.
 * Expone login (guarda token + carga usuario), logout y estado isLoading para el router.
 */
export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasMedicalSettings, setHasMedicalSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedicalSettingsStatus = async () => {
    try {
      await axios.get('/medical-settings');
      setHasMedicalSettings(true);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        setHasMedicalSettings(false);
        return false;
      }
      setHasMedicalSettings(false);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const response = await axios.get('/user');
          setUser(response.data);
          setIsAuthenticated(true);
          await fetchMedicalSettingsStatus();
        } catch (error) {
          console.error("Token inválido o expirado: " + error);
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
          setUser(null);
          setHasMedicalSettings(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (token) => {
    localStorage.setItem('auth_token', token);
    
    try {
      const response = await axios.get('/user');
      setUser(response.data);
      setIsAuthenticated(true);
      return await fetchMedicalSettingsStatus();
    } catch (error) {
      console.error("Error al obtener los datos del usuario tras el login: " + error);
      localStorage.removeItem('auth_token');
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
    } catch (error) {
      console.error("Error al hacer logout", error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
      setHasMedicalSettings(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      hasMedicalSettings,
      login,
      logout,
      refreshMedicalSettings: fetchMedicalSettingsStatus,
    }}>
      {children}
    </AuthContext.Provider>
  )
  
}