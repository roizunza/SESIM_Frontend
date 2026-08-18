import React from 'react';
import CapturistaLayout from '../perfiles/capturista/CapturistaLayout';
import AdministradorLayout from '../perfiles/administradora/AdministradorLayout';

const AdminMapViewer = () => {
  /* ¡CORRECCIÓN! Ahora sí lee el rol real que guardó tu Login en el navegador.
     Si por alguna razón no hay rol, te manda al login o a capturista por defecto */
  const userRole = localStorage.getItem('sim_role') || 'capturista'; 

  // Renderizado condicional basado en el rol real del usuario
  switch (userRole) {
    case 'capturista':
      return <CapturistaLayout />;
    case 'administradora': /* Asegúrate de que tu login guarde 'administradora' o 'administrador' según lo hayas programado */
    case 'administrador':
      return <AdministradorLayout />;
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