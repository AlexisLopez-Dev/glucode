import { useState, useEffect } from 'react';
import axios from '../lib/axios';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const response = await axios.get('/user');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token inválido o expirado: " + error);
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
          setUser(null);
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
    } catch (error) {
      console.error("Error al obtener los datos del usuario tras el login: " + error);
      localStorage.removeItem('auth_token');
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
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
  
}