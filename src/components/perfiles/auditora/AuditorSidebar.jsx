import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, LogOut, ChevronDown, ChevronUp, History, FileText, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import '../capturista/Capturista.css';
import './Auditor.css';

const AuditorSidebar = ({ isSidebarOpen, setIsSidebarOpen, onSelectCapa, capaActiva }) => {
  const navigate = useNavigate();
  const [bandejaOpen, setBandejaOpen] = useState(true);

  /* Mock de capas auditables */
  const capasAuditables = ['red_ciclovias_v2', 'pimus_municipio_carmen', 'censo_paraderos_2026'];

  return (
    <aside className={`admin-sidebar auditor-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
      <button className="admin-sidebar-toggle" style={{ background: '#1F2937' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="admin-profile-section">
        <Eye size={64} className="profile-icon" color="#9CA3AF" />
        <div className="profile-info">
          <span className="profile-greeting">Órgano de Control</span>
          <span className="profile-role">Auditor de Sistema</span>
          <span className="user-email">Solo Lectura</span>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-group">
          
          <div className="sidebar-search-container">
            <div className="search-input-wrapper">
              <Search size={16} color="rgba(255,255,255,0.6)" />
              <input type="text" placeholder="Rastrear indicador o ID..." />
            </div>
          </div>

          <div className="admin-nav-header">
            <span className="nav-title">TRAZABILIDAD Y LOGS</span>
          </div>

          <button className={`admin-nav-link ${bandejaOpen ? 'active' : ''}`} onClick={() => setBandejaOpen(!bandejaOpen)}>
            <History size={18} />
            <span>Histórico de Capas</span>
            {bandejaOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${bandejaOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: bandejaOpen ? '800px' : '0' }}>
            <div className="box-container">
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {capasAuditables.map((capa, i) => (
                    <div 
                      key={i} 
                      onClick={() => onSelectCapa(capa)} 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px', background: capaActiva === capa ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                    >
                      <FileText size={14} color={capaActiva === capa ? '#fff' : '#9CA3AF'} />
                      <span className="bandeja-item" style={{ color: capaActiva === capa ? '#fff' : '#9CA3AF' }}>{capa}</span>
                    </div>
                  ))}
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

export default AuditorSidebar;