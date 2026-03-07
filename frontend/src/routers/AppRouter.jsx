import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';

export const AppRouter = () => {
    
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando Glucode...</div>;
  }

  return (
    <Router>
      <Routes>

        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />

        <Route path="/*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
};