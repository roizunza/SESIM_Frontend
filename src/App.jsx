import React from 'react';
import { Routes, Route } from 'react-router-dom';

/* Layout publico y sus vistas */
import Plataforma from './components/plataforma/Plataforma';
import Inicio from './pages/Inicio';
import Dashboard from './pages/Dashboard';
import MatrizIndicadores from './pages/MatrizIndicadores';
import AnalisisDatos from './pages/AnalisisDatos';
import Administracion from './pages/Administracion';

/* Layout administrativo y sus vistas */
import AdminLayout from './components/plataforma/AdminLayout';
import AdminMapViewer from './components/geovisor/AdminMapViewer';

function App() {
  return (
    <Routes>
      {/* BLOQUE 1: Vistas publicas (Renderizan Header, Navbar y Footer) */}
      <Route path="/" element={<Plataforma />}>
        <Route index element={<Inicio />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="matriz" element={<MatrizIndicadores />} />
        <Route path="analisis" element={<AnalisisDatos />} />
        <Route path="admin" element={<Administracion />} />
      </Route>

      {/* BLOQUE 2: Vistas institucionales (Renderizan AdminLayout sin Navbar publico) */}
      <Route path="/admin-visor" element={<AdminLayout />}>
        <Route index element={<AdminMapViewer />} />
      </Route>
    </Routes>
  );
}

export default App;