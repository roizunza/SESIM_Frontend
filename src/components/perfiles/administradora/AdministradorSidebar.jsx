import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, ChevronDown, ChevronUp, Layers, ChevronLeft, ChevronRight, Search, BarChart2 } from 'lucide-react';
import '../capturista/Capturista.css';

const AdministradorSidebar = ({ isSidebarOpen, setIsSidebarOpen, capasEnRevision, capasAprobadas, onSelectCapa, capaActiva }) => {
  const navigate = useNavigate();
  const [bandejaOpen, setBandejaOpen] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('todos');

  return (
    <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
      <button className="admin-sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="admin-profile-section">
        <UserCircle size={64} className="profile-icon" />
        <div className="profile-info">
          <span className="profile-greeting">Bienvenid@</span>
          <span className="profile-role">Administradora</span>
          <span className="user-email">director.movilidad@campeche.gob.mx</span>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-group">
          
          {/* Dashboard General Button */}
          <div style={{ padding: '0 20px 16px' }}>
            <button className="btn-registro" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
              <BarChart2 size={18} /> Dashboard General
            </button>
          </div>

          {/* Search & Filters */}
          <div className="sidebar-search-container">
            <div className="search-input-wrapper">
              <Search size={16} color="rgba(255,255,255,0.6)" />
              <input type="text" placeholder="Buscar capa..." />
            </div>
            <div className="filters-row">
              {['todos', 'instrumento', 'nivel', 'fecha'].map(f => (
                <span 
                  key={f} 
                  className={`filter-pill ${filtroActivo === f ? 'active' : ''}`}
                  onClick={() => setFiltroActivo(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </span>
              ))}
            </div>
          </div>

          <div className="admin-nav-header">
            <span className="nav-title">AUDITORÍA Y CONTROL</span>
          </div>

          <button className={`admin-nav-link ${bandejaOpen ? 'active' : ''}`} onClick={() => setBandejaOpen(!bandejaOpen)}>
            <Layers size={18} />
            <span>Capas e Indicadores</span>
            {bandejaOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${bandejaOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: bandejaOpen ? '800px' : '0' }}>
            <div className="box-container">
              
              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title" style={{ color: 'var(--status-borrador)' }}>Por Validar</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {capasEnRevision.map((capa, i) => (
                    <div key={i} onClick={() => onSelectCapa(capa)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px', background: capaActiva === capa ? 'rgba(245, 158, 11, 0.15)' : 'transparent' }}>
                      <span className="status-dot borrador" />
                      <span className="bandeja-item" style={{ color: capaActiva === capa ? 'var(--status-borrador)' : '#fff' }}>{capa}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title" style={{ color: 'var(--status-aprobado)' }}>Vigentes / Públicas</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {capasAprobadas.map((capa, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                      <span className="status-dot aprobado" />
                      <span className="bandeja-item" style={{ opacity: 0.7 }}>{capa}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden' }}>
                <h5 className="bandeja-category-title" style={{ color: 'var(--text-secondary)' }}>Histórico de Capas</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                    <span className="status-dot" style={{ background: '#6B7280' }} />
                    <span className="bandeja-item" style={{ opacity: 0.5 }}>red_ciclovias_v1</span>
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