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

/* Componentes de Bitacora */
import BitacoraLogs from './components/Bitacora/BitacoraLogs';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Plataforma />}>
        <Route index element={<Inicio />} />
        <Route path="geovisor" element={<MapViewer />} />
        <Route path="monitoreo" element={<MonitoreoIndicadores />} />
        <Route path="admin" element={<Administracion />} />
      </Route>

      <Route path="/admin-visor" element={<AdminLayout />}>
        <Route index element={<AdminMapViewer />} />
      </Route>

      <Route path="/admin-control" element={<AdministradorLayout />} />

      <Route element={<AdminLayout />}>
        <Route path="/logs/capturista/:userId" element={<BitacoraLogs />} />
        <Route path="/logs/administradora/:userId" element={<BitacoraLogs />} />
        <Route path="/logs/auditora/:userId" element={<BitacoraLogs />} />
      </Route>
    </Routes>
  );
}

export default App;