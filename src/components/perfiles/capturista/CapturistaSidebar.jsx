import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, ChevronDown, ChevronUp, Layers, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import './Capturista.css';

const CapturistaSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [bandejaOpen, setBandejaOpen] = useState(true);

  return (
    <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
      <button 
        className="admin-sidebar-toggle" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title={isSidebarOpen ? "Ocultar panel" : "Mostrar panel"}
      >
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="admin-profile-section">
        <UserCircle size={64} className="profile-icon" />
        <div className="profile-info">
          <span className="profile-greeting">Bienvenid@</span>
          <span className="profile-role">Capturista</span>
          <span className="user-email">ejemplo@gobcampeche.com</span>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-group">
          
          <div style={{ padding: '0 20px', marginBottom: '24px' }}>
            <button className="btn-registro" onClick={() => console.log("Abrir CapturistaModal")}>
              <Plus size={18} /> Registrar Indicador
            </button>
          </div>

          <div className="admin-nav-header">
            <span className="nav-title">BANDEJA DE ENTRADA</span>
          </div>

          <button 
            className={`admin-nav-link ${bandejaOpen ? 'active' : ''}`} 
            onClick={() => setBandejaOpen(!bandejaOpen)}
          >
            <Layers size={18} />
            <span>Indicadores</span>
            {bandejaOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${bandejaOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: bandejaOpen ? '450px' : '0' }}>
            <div style={{ padding: '10px 20px 16px 46px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <h5 className="bandeja-category-title">En Borradores</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="bandeja-item">nombre_capa</span>
                </div>
              </div>

              <div>
                <h5 className="bandeja-category-title">En Revisión</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="bandeja-item">nombre_capa</span>
                </div>
              </div>

              <div>
                <h5 className="bandeja-category-title">Aprobados</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="bandeja-item">nombre_capa</span>
                </div>
              </div>

              <div>
                <h5 className="bandeja-category-title">Rechazados</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="bandeja-item">nombre_capa</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#FCA5A5', paddingLeft: '120px', cursor: 'pointer', textDecoration: 'underline' }}>
                    Ver comentarios
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="admin-nav-group" style={{ marginTop: 'auto' }}>
          <button className="admin-nav-link text-logout" onClick={() => navigate('/')}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default CapturistaSidebar;