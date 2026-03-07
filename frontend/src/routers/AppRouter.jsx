import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';

export const AppRouter = () => {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/*" element={<Navigate to="/login" />} />
        
      </Routes>
    </Router>
  );
};