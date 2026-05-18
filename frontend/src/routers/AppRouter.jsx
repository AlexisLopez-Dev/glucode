import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import Register from '../pages/Register';
import Settings from '../pages/Settings';
import { History } from '../pages/History';
import { MainLayout } from '../components/layout/MainLayout';
import VerifyEmail from '../pages/VerifyEmail';
import GoogleCallback from '../pages/GoogleCallback';
import { IconSpinner } from '../components/icons/Icons';

/**
 * AppRouter — Definición de rutas y protección por autenticación
 *
 * Rutas públicas (login, register, verify-email) redirigen si ya hay sesión.
 * Dashboard e history requieren MainLayout y token válido.
 */
export const AppRouter = () => {
    
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <IconSpinner className="w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />

        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/settings" /> : <Register />} 
        />

        <Route 
          path="/verify-email" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <VerifyEmail />} 
        />

        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        
        <Route 
          path="/settings" 
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
        />

        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Route>

        <Route path="/*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
};