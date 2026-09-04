import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, LogOut, ChevronDown, ChevronUp, Map, FileText, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import '../capturista/Capturista.css';
import './Auditor.css';

const AuditorSidebar = ({ isSidebarOpen, setIsSidebarOpen, onSelectCapa, capaActiva }) => {
  const navigate = useNavigate();
  
  /* Estados independientes para los dos acordeones */
  const [cartografiaOpen, setCartografiaOpen] = useState(true);
  const [instrumentosOpen, setInstrumentosOpen] = useState(true);

  /* Mock de datos separados */
  const historialCartografia = ['red_ciclovias_v2', 'pimus_municipio_carmen', 'censo_paraderos_2026'];
  const historialInstrumentos = ['PIMUS_Carmen_2025.pdf', 'Programa_Movilidad_Estatal_2024.pdf', 'Dictamen_Normativo_Urbano.pdf'];

  return (
    <aside className={`admin-sidebar auditor-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`} style={{ backgroundColor: '#888B8D' }}>
      
      {/* Botón colapsar gris */}
      <button className="admin-sidebar-toggle" style={{ background: '#53565A' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="admin-profile-section">
        <Eye size={64} className="profile-icon" color="#D1D5DB" />
        <div className="profile-info">
          <span className="profile-greeting">Bienvenid@ Auditor@</span>
          <span className="user-email">ejemplo@gobcampeche.mx</span>
          
          {/* Botón de Bitácora de Loggs */}
          <button 
            onClick={() => console.log('Redirigiendo a bitácora...')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', background: 'none', 
              border: 'none', color: '#BCA986', fontSize: '12px', fontWeight: 'bold', 
              fontStyle: 'italic', cursor: 'pointer', padding: 0, marginTop: '4px' 
            }}
          >
            <Eye size={14} /> Bitácora de Loggs
          </button>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-group">
          
          <div className="sidebar-search-container">
            <div className="search-input-wrapper">
              <Search size={16} color="rgba(255,255,255,0.6)" />
              <input type="text" placeholder="Buscar usuario, cartografía o instrumento" />
            </div>
          </div>

          <div className="admin-nav-header">
            <span className="nav-title">ACTIVIDAD</span>
          </div>

          <div style={{ padding: '0 20px', marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>Desde</label>
              <input 
                type="date" 
                style={{ width: '100%', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#fff', padding: '6px 8px', fontSize: '12px', outline: 'none', fontFamily: 'var(--font-body)', colorScheme: 'dark' }} 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', display: 'block', textTransform: 'uppercase' }}>Hasta</label>
              <input 
                type="date" 
                style={{ width: '100%', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#fff', padding: '6px 8px', fontSize: '12px', outline: 'none', fontFamily: 'var(--font-body)', colorScheme: 'dark' }} 
              />
            </div>
          </div>

          {/* Acordeón 1: Historial de Cartografía */}
          <button className={`admin-nav-link ${cartografiaOpen ? 'active' : ''}`} onClick={() => setCartografiaOpen(!cartografiaOpen)} style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Map size={18} />
            <span>Historial de Cartografía</span>
            {cartografiaOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${cartografiaOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: cartografiaOpen ? '800px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
            <div className="box-container" style={{ padding: '8px 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {historialCartografia.map((capa, i) => (
                  <div 
                    key={i} 
                    onClick={() => onSelectCapa(capa)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px', background: capaActiva === capa ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                  >
                    <FileText size={14} color={capaActiva === capa ? '#fff' : '#D1D5DB'} />
                    <span className="bandeja-item" style={{ color: capaActiva === capa ? '#fff' : '#D1D5DB', fontSize: '13px', fontWeight: '500' }}>{capa}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acordeón 2: Historial de Instrumentos */}
          <button className={`admin-nav-link ${instrumentosOpen ? 'active' : ''}`} onClick={() => setInstrumentosOpen(!instrumentosOpen)} style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <FileText size={18} />
            <span>Historial de Instrumentos</span>
            {instrumentosOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${instrumentosOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: instrumentosOpen ? '800px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
            <div className="box-container" style={{ padding: '8px 20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {historialInstrumentos.map((inst, i) => (
                  <div 
                    key={i} 
                    onClick={() => onSelectCapa(inst)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px', background: capaActiva === inst ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                  >
                    <FileText size={14} color={capaActiva === inst ? '#fff' : '#D1D5DB'} />
                    <span className="bandeja-item" style={{ color: capaActiva === inst ? '#fff' : '#D1D5DB', fontSize: '13px', fontWeight: '500' }}>{inst}</span>
                  </div>
                ))}
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