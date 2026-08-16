import React from 'react';
import CapturistaLayout from '../perfiles/capturista/CapturistaLayout';

const AdminMapViewer = () => {
  const userRole = localStorage.getItem('sim_role') || 'capturista';

  // Renderizado condicional basado en el rol simulado
  switch (userRole) {
    case 'capturista':
      return <CapturistaLayout />;
    case 'administrador':
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Panel de Administración (En construcción)</h2>
        </div>
      );
    case 'auditor':
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Panel de Auditoría (En construcción)</h2>
        </div>
      );
    default:
      return <CapturistaLayout />;
  }
};

export default AdminMapViewer;