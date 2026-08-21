import React from 'react';
import { Routes, Route } from 'react-router-dom';

/* Layout publico y sus vistas */
import Plataforma from './components/plataforma/Plataforma';
import Inicio from './pages/Inicio';
import MapViewer from './components/geovisor/MapViewer';
import MonitoreoIndicadores from './pages/MonitoreoIndicadores';
import Administracion from './pages/Administracion';

/* Layout administrativo y sus vistas */
import AdminLayout from './components/plataforma/AdminLayout';
import AdminMapViewer from './components/geovisor/AdminMapViewer';

import AdministradorLayout from './components/perfiles/administradora/AdministradorLayout';

/* Componentes de Bitácora / Logs (Renombrado para evitar error de caché de Git en Vercel) */
import BitacoraLogs from './components/logs/BitacoraLogs';

function App() {
  return (
    <Routes>
      {/* BLOQUE 1: Vistas publicas (Renderizan Header, Navbar y Footer) */}
      <Route path="/" element={<Plataforma />}>
        <Route index element={<Inicio />} />
        
        {/* Aquí entra tu mapa directamente, sin intermediarios */}
        <Route path="geovisor" element={<MapViewer />} />
        
        {/* Aquí entra la vista en construcción */}
        <Route path="monitoreo" element={<MonitoreoIndicadores />} />
        
        {/* Ruta oculta para que el botón de login funcione */}
        <Route path="admin" element={<Administracion />} />
      </Route>

      {/* BLOQUE 2: Vistas institucionales (Renderizan AdminLayout sin Navbar publico) */}
      <Route path="/admin-visor" element={<AdminLayout />}>
        <Route index element={<AdminMapViewer />} />
      </Route>

      {/* BLOQUE 3: Nueva Ruta de Auditoría y Control - Perfil Administradora */}
      <Route path="/admin-control" element={<AdministradorLayout />} />

      {/* BLOQUE 4: Rutas de Bitácora (Envueltas en AdminLayout para mantener el Header) */}
      <Route element={<AdminLayout />}>
        {/* Vista personal del capturista */}
        <Route path="/logs/user/:userId" element={<BitacoraLogs />} />
        
        {/* Vista global de la administradora (por ahora reutilizamos el mismo componente) */}
        <Route path="/logs/global" element={<BitacoraLogs />} />
      </Route>
    </Routes>
  );
}

export default App;