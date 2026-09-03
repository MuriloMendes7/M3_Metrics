// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { WorkoutBuilder } from './pages/WorkoutBuilder';
import { Diet } from './pages/Diet';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alunos" element={<Students />} />
          <Route path="/treinos" element={<WorkoutBuilder />} />
          <Route path="/dieta" element={<Diet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}