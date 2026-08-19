import React from 'react';
import CapturistaLayout from '../perfiles/capturista/CapturistaLayout';
import AdministradorLayout from '../perfiles/administradora/AdministradorLayout';
import AuditorLayout from '../perfiles/auditora/AuditorLayout'; // Asegúrate de que la carpeta se llame 'auditora'

const AdminMapViewer = () => {
  /* Lee el rol real que guardó tu Login en el navegador */
  const userRole = localStorage.getItem('sim_role') || 'capturista'; 

  // Renderizado condicional basado en el rol real del usuario
  switch (userRole) {
    case 'capturista':
      return <CapturistaLayout />;
    case 'administradora': 
    case 'administrador':
      return <AdministradorLayout />;
    case 'auditor':
    case 'auditora': 
      return <AuditorLayout />; 
    default:
      return <CapturistaLayout />;
  }
};

export default AdminMapViewer;