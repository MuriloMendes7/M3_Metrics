// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SplashScreen } from './components/common/SplashScreen';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { WorkoutBuilder } from './pages/WorkoutBuilder';
import { Diet } from './pages/Diet';

const MIN_SPLASH_DURATION_MS = 700;

function AppRoutes() {
  const { isCheckingSession } = useAuth();
  const [hasMinDurationElapsed, setHasMinDurationElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasMinDurationElapsed(true), MIN_SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = isCheckingSession || !hasMinDurationElapsed;

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/alunos" element={<Students />} />
        <Route path="/treinos" element={<WorkoutBuilder />} />
        <Route path="/dieta" element={<Diet />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}