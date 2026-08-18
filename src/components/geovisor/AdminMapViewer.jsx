import React from 'react';
import CapturistaLayout from '../perfiles/capturista/CapturistaLayout';
import AdministradorLayout from '../perfiles/administradora/AdministradorLayout';

const AdminMapViewer = () => {
  /* Forzamos temporalmente a 'administrador' para que puedas ver el diseño, 
     luego lo regresas a pedir el dato de localStorage */
  const userRole = 'administrador'; 

  // Renderizado condicional basado en el rol
  switch (userRole) {
    case 'capturista':
      return <CapturistaLayout />;
    case 'administrador':
      return <AdministradorLayout />; /* <-- Aquí conectamos la interfaz real */
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