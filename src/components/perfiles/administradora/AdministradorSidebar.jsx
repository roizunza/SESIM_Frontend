import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Settings, Map, FileText } from 'lucide-react';
import '../capturista/Capturista.css';

const AdministradorSidebar = ({ isSidebarOpen, setIsSidebarOpen, cartografiaList, instrumentosList, onSelectCapa, capaActiva }) => {
  const navigate = useNavigate();
  const [cartografiaOpen, setCartografiaOpen] = useState(true);
  const [instrumentosOpen, setInstrumentosOpen] = useState(true);

  // Helper para pintar el punto (dot) dependiendo del estatus
  const getStatusColor = (estatus) => {
    if (estatus === 'revision') return '#F59E0B'; // Ámbar (En revisión)
    if (estatus === 'aprobado') return '#10B981'; // Verde (Aprobado)
    if (estatus === 'rechazado') return '#EF4444'; // Rojo (Rechazado)
    return '#6B7280'; // Gris por defecto
  };

  return (
    <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`} style={{ backgroundColor: '#183B33' }}>
      <button className="admin-sidebar-toggle" style={{ background: '#102A24' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>

      <div className="admin-profile-section" style={{ borderBottom: 'none', paddingBottom: '16px' }}>
        <UserCircle size={64} className="profile-icon" color="#fff" />
        <div className="profile-info">
          <span className="profile-greeting" style={{ fontSize: '16px' }}>Bienvenid@<br/>Administrador@</span>
          <span className="user-email">ejemplo@gobcampeche.mx</span>
          
          {/* Botón a Bitácora con icono de engrane dorado como en tu diseño */}
          <button 
            onClick={() => navigate('/logs/administradora/institucional')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#D97706', fontSize: '12px', fontWeight: 'bold', fontStyle: 'italic', cursor: 'pointer', padding: 0, marginTop: '6px' }}
          >
            <Settings size={14} /> Bitácora de Loggs
          </button>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-group">
          
          <div className="admin-nav-header" style={{ background: '#254E45', padding: '8px 20px', marginBottom: '8px' }}>
            <span className="nav-title" style={{ color: '#A7F3D0', fontWeight: 'bold' }}>CONTROL DE SOLICITUDES</span>
          </div>

          {/* ACORDEÓN: CARTOGRAFÍA */}
          <button className={`admin-nav-link ${cartografiaOpen ? 'active' : ''}`} onClick={() => setCartografiaOpen(!cartografiaOpen)} style={{ background: 'transparent' }}>
            <Map size={18} />
            <span style={{ fontWeight: '600' }}>Cartografía</span>
            {cartografiaOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${cartografiaOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: cartografiaOpen ? '800px' : '0' }}>
            <div className="box-container" style={{ padding: '8px 20px 16px 44px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cartografiaList.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => onSelectCapa(item.id)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px', background: capaActiva === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(item.estatus), flexShrink: 0 }}></div>
                    <span className="bandeja-item" style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{item.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACORDEÓN: INSTRUMENTOS */}
          <button className={`admin-nav-link ${instrumentosOpen ? 'active' : ''}`} onClick={() => setInstrumentosOpen(!instrumentosOpen)} style={{ background: 'rgba(255,255,255,0.05)' }}>
            <FileText size={18} />
            <span style={{ fontWeight: '600' }}>Instrumentos</span>
            {instrumentosOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${instrumentosOpen ? 'open' : ''}`} style={{ background: 'rgba(255,255,255,0.05)', maxHeight: instrumentosOpen ? '800px' : '0' }}>
            <div className="box-container" style={{ padding: '8px 20px 16px 44px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {instrumentosList.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => onSelectCapa(item.id)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px', background: capaActiva === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent' }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(item.estatus), flexShrink: 0 }}></div>
                    <span className="bandeja-item" style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{item.id}</span>
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

export default AdministradorSidebar;