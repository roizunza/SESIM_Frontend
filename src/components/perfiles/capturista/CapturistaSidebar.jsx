import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, ChevronDown, ChevronUp, Layers, ChevronLeft, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import './Capturista.css';

const CapturistaSidebar = ({ isSidebarOpen, setIsSidebarOpen, onOpenModal, isVerifying, onFinalSubmit, capasEnBorradores, capasEnRevision }) => {
  const navigate = useNavigate();
  const [bandejaOpen, setBandejaOpen] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmitAndReset = () => {
    onFinalSubmit();
    setTermsAccepted(false);
  };

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
          
          <div style={{ padding: '0 20px', marginBottom: '16px' }}>
            <button className="btn-base btn-white" onClick={onOpenModal} disabled={isVerifying} style={{ opacity: isVerifying ? 0.5 : 1 }}>
              <Plus size={18} /> Registrar Nuevo Indicador
            </button>
          </div>

          {/* Banner UX del Último Paso */}
          {isVerifying && (
            <div style={{ 
              margin: '0 20px 24px', 
              padding: '16px', 
              background: 'var(--c-white)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
            }}>
              <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 8px', color: 'var(--c-guinda)', fontSize: '14px', fontWeight: '700' }}>
                <CheckCircle2 size={18} color="#10B981" /> Último paso.
              </h5>
              
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.4' }}>
                Asegúrese de que la capa no tenga errores o desplazamientos no deseados con relación al geovisualizador antes de enviarla a revisión.
              </p>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}>
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{ marginTop: '2px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', fontWeight: '500' }}>
                  Estoy de acuerdo con enviar la capa geoespacial a la Etapa de Revisión Administrativa.
                </span>
              </label>

              <button 
                className="btn-base btn-primary" 
                onClick={handleSubmitAndReset} 
                disabled={!termsAccepted}
                style={{ 
                  width: '100%', 
                  background: termsAccepted ? '#10B981' : '#E5E7EB', 
                  color: termsAccepted ? '#ffffff' : '#9CA3AF',
                  cursor: termsAccepted ? 'pointer' : 'not-allowed',
                  border: 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Enviar a revisión
              </button>
            </div>
          )}

          <div className="admin-nav-header">
            <span className="nav-title">BANDEJA DE ENTRADA</span>
          </div>

          <button 
            className={`admin-nav-link ${bandejaOpen ? 'active' : ''}`} 
            onClick={() => setBandejaOpen(!bandejaOpen)}
          >
            <Layers size={18} />
            <span>Indicadores Geoespaciales</span>
            {bandejaOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${bandejaOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: bandejaOpen ? '800px' : '0' }}>
            <div className="box-container">
              
              <div style={{ width: '100%', overflow: 'hidden' }}>
                <h5 className="bandeja-category-title">En Borradores</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {capasEnBorradores.length > 0 ? (
                    capasEnBorradores.map((capa, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                        <span className="bandeja-item" title={capa}>{capa}</span>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Bandeja vacía</span>
                  )}
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden' }}>
                <h5 className="bandeja-category-title">En Revisión</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {capasEnRevision.map((capa, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                      <span className="bandeja-item" title={capa}>{capa}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden' }}>
                <h5 className="bandeja-category-title">Aprobados</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <span className="bandeja-item">nombre_capa</span>
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden' }}>
                <h5 className="bandeja-category-title">Rechazados</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
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

export default CapturistaSidebar;