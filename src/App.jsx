import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Plataforma from './components/plataforma/Plataforma';
import Inicio from './pages/Inicio';
import Dashboard from './pages/Dashboard';
import MatrizIndicadores from './pages/MatrizIndicadores';
import AnalisisDatos from './pages/AnalisisDatos';
import Administracion from './pages/Administracion';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Plataforma />}>
        <Route index element={<Inicio />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="matriz" element={<MatrizIndicadores />} />
        <Route path="analisis" element={<AnalisisDatos />} />
        <Route path="admin" element={<Administracion />} />
      </Route>
    </Routes>
  );
}

export default App;
