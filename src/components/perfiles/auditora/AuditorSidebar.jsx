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
      {/* Actualizado para usar la variable de color en lugar del hexadecimal en duro */}
      <button className="admin-sidebar-toggle" style={{ background: 'var(--c-verde-dk, #10312B)' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="admin-profile-section">
        <Eye size={64} className="profile-icon" color="#9CA3AF" />
        <div className="profile-info">
          <span className="profile-greeting">Bienvenid@ Auditor@</span>
          <span className="user-email">ejemplo@gobcampeche.mx</span>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-group">
          
          {/* Buscador actualizado */}
          <div className="sidebar-search-container">
            <div className="search-input-wrapper">
              <Search size={16} color="rgba(255,255,255,0.6)" />
              <input type="text" placeholder="Buscar indicador o usuario" />
            </div>
          </div>

          {/* Título de sección actualizado */}
          <div className="admin-nav-header">
            <span className="nav-title">ACTIVIDAD</span>
          </div>

          {/* Nuevo: Filtro de fecha a fecha */}
          <div style={{ padding: '0 20px', marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>Desde</label>
              <input 
                type="date" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(0, 0, 0, 0.2)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '4px', 
                  color: '#fff', 
                  padding: '6px 8px', 
                  fontSize: '12px', 
                  outline: 'none', 
                  fontFamily: 'var(--font-body)',
                  colorScheme: 'dark' /* Ayuda a que el icono del calendario del navegador se vea bien en fondos oscuros */
                }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>Hasta</label>
              <input 
                type="date" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(0, 0, 0, 0.2)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '4px', 
                  color: '#fff', 
                  padding: '6px 8px', 
                  fontSize: '12px', 
                  outline: 'none', 
                  fontFamily: 'var(--font-body)',
                  colorScheme: 'dark'
                }} 
              />
            </div>
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