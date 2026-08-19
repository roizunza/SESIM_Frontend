import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import '../capturista/Capturista.css';

const AdministradorSidebar = ({ isSidebarOpen, setIsSidebarOpen, capasEnRevision, capasAprobadas, onSelectCapa, capaActiva }) => {
  const navigate = useNavigate();
  const [bandejaOpen, setBandejaOpen] = useState(true);

  return (
    <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
      <button className="admin-sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="admin-profile-section">
        <UserCircle size={64} className="profile-icon" />
        <div className="profile-info">
          <span className="profile-greeting">Bienvenid@ Administrador@</span>
          <span className="user-email">ejemplo@gobcampeche.mx</span>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-group">
          
          <div className="admin-nav-header">
            <span className="nav-title">CONTROL</span>
          </div>

          <button className={`admin-nav-link ${bandejaOpen ? 'active' : ''}`} onClick={() => setBandejaOpen(!bandejaOpen)}>
            <Inbox size={18} />
            <span>Solicitudes</span>
            {bandejaOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${bandejaOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: bandejaOpen ? '800px' : '0' }}>
            <div className="box-container">
              
              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title">En Revisión</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {capasEnRevision.map((capa, i) => (
                    <div 
                      key={i} 
                      onClick={() => onSelectCapa(capa)} 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px', background: capaActiva === capa ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                    >
                      <span className="status-dot revision" />
                      <span className="bandeja-item" style={{ color: capaActiva === capa ? '#fff' : 'rgba(255, 255, 255, 0.9)' }}>{capa}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title">Aprobadas</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {capasAprobadas.map((capa, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                      <span className="status-dot aprobado" />
                      <span className="bandeja-item" style={{ opacity: 0.8 }}>{capa}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title">Rechazadas</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', padding: '4px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="status-dot rechazado" />
                    <span className="bandeja-item" style={{ opacity: 0.8 }}>nombre_capa</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="admin-nav-group" style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button className="admin-nav-link text-logout" onClick={() => navigate('/')}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default AdministradorSidebar;