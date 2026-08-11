import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { UserCircle, Map, LogOut, CheckSquare, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './AdminMapViewer.css';

const AdminMapViewer = () => {
  const navigate = useNavigate();

  /* Simulacion de datos de sesion (reemplazar con backend) */
  const mockUser = {
    name: 'ejemplo@gobcampeche.mx',
    role: 'Administrador' 
  };

  /* Funcion de renderizado condicional para el menu lateral */
  const renderNavItemsByRole = (role) => {
    switch(role) {
      case 'Administrador':
        return (
          <>
        
            <button className="admin-nav-link">
              <Map size={18} />
              <span>Despliegue de funcionalidades dependiendo del tipo de usuario</span>
            </button>
          </>
        );
      case 'Validador':
        return (
          <>
            <button className="admin-nav-link active">
              <CheckSquare size={18} />
              <span>Validar Información</span>
            </button>
            <button className="admin-nav-link">
              <Map size={18} />
              <span>Revisión Espacial</span>
            </button>
          </>
        );
      default:
        return (
          <button className="admin-nav-link">
            <Map size={18} />
            <span>Visor Básico</span>
          </button>
        );
    }
  };

  return (
    <div className="admin-map-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-profile-section">
          <UserCircle size={48} className="profile-icon" />
          <div className="profile-info">
            <span className="profile-greeting">Bienvenid@</span>
            <span className="profile-role">{mockUser.role}</span>
            <span className="profile-name">{mockUser.name}</span>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-group">
            <div className="admin-nav-header">
              <span className="nav-title">NAVEGACIÓN</span>
            </div>
            
            {/* Inyeccion dinamica de modulos segun el perfil */}
            {renderNavItemsByRole(mockUser.role)}
            
            <button className="admin-nav-link">
              <UserCircle size={18} />
              <span>Mi Perfil</span>
            </button>

            <button className="admin-nav-link text-logout" onClick={() => navigate('/')}>
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="admin-map-container">
        <MapContainer 
          center={[19.3, -90.5]} 
          zoom={8} 
          zoomControl={true}
          className="admin-leaflet-map"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default AdminMapViewer;