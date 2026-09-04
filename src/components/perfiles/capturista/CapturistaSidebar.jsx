import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, ChevronDown, ChevronUp, Map, FileText, ChevronLeft, ChevronRight, Plus, CheckCircle2, History } from 'lucide-react';
import './Capturista.css';

const CapturistaSidebar = ({ isSidebarOpen, setIsSidebarOpen, onOpenModal, isVerifying, onFinalSubmit, capasEnBorradores, capasEnRevision }) => {
  const navigate = useNavigate();
  
  const [cartografiaOpen, setCartografiaOpen] = useState(true);
  const [instrumentosOpen, setInstrumentosOpen] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmitAndReset = () => {
    onFinalSubmit();
    setTermsAccepted(false);
  };

  /* Mock de instrumentos para que haga match visual con tu imagen */
  const instrumentosEnRevision = ['PIMUS_Carmen_2025.pdf'];
  const instrumentosAprobados = ['PIMUS_Campeche_2024.pdf'];

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
          
          {/* Botón al Historial de Actividades (Bitácora) */}
          <button
            onClick={() => navigate('/logs/capturista/ejemplo_usuario')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#BCA986', fontSize: '12px', fontWeight: 'bold', fontStyle: 'italic', cursor: 'pointer', padding: 0, marginTop: '4px' }}
          >
            <History size={14} /> Historial de Actividades
          </button>
        </div>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-group">
          
          {/* SECCIÓN: SUBIR AL SISTEMA */}
          <div className="admin-nav-header" style={{ marginBottom: '8px' }}>
            <span className="nav-title">SUBIR AL SISTEMA</span>
          </div>
          
          <div style={{ padding: '0 20px', marginBottom: '8px' }}>
            <button 
              className="btn-base btn-white" 
              onClick={() => onOpenModal('cartografia')} 
              disabled={isVerifying} 
              style={{ opacity: isVerifying ? 0.5 : 1, width: '100%', display: 'flex', justifyContent: 'flex-start', color: '#9F2241', padding: '10px 16px' }}
            >
              <Plus size={18} /> Cartografía
            </button>
          </div>
          
          <div style={{ padding: '0 20px', marginBottom: '24px' }}>
            <button 
              className="btn-base btn-white" 
              onClick={() => onOpenModal('instrumento')} 
              disabled={isVerifying} 
              style={{ opacity: isVerifying ? 0.5 : 1, width: '100%', display: 'flex', justifyContent: 'flex-start', color: '#9F2241', padding: '10px 16px' }}
            >
              <Plus size={18} /> Instrumentos
            </button>
          </div>

          {/* Banner UX del Último Paso (Solo visible cuando se verifica una capa) */}
          {isVerifying && (
            <div style={{ margin: '0 20px 24px', padding: '16px', background: 'var(--c-white)', border: '1px solid var(--border-color)', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
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
                style={{ width: '100%', background: termsAccepted ? '#10B981' : '#E5E7EB', color: termsAccepted ? '#ffffff' : '#9CA3AF', cursor: termsAccepted ? 'pointer' : 'not-allowed', border: 'none', transition: 'all 0.2s ease-in-out' }}
              >
                Enviar a revisión
              </button>
            </div>
          )}

          {/* SECCIÓN: BANDEJA DE ENTRADA */}
          <div className="admin-nav-header" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <span className="nav-title">BANDEJA DE ENTRADA</span>
          </div>

          {/* ACORDEÓN 1: Cartografía */}
          <button className={`admin-nav-link ${cartografiaOpen ? 'active' : ''}`} onClick={() => setCartografiaOpen(!cartografiaOpen)} style={{ backgroundColor: cartografiaOpen ? 'rgba(0, 0, 0, 0.05)' : 'transparent' }}>
            <Map size={18} />
            <span>Cartografía</span>
            {cartografiaOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${cartografiaOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: cartografiaOpen ? '800px' : '0' }}>
            <div className="box-container" style={{ padding: '10px 20px 16px 44px' }}>
              
              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title" style={{ color: '#BCA986' }}>EN BORRADORES</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {capasEnBorradores.length > 0 ? (
                    capasEnBorradores.map((capa, index) => (
                      <span key={index} className="bandeja-item" title={capa}>{capa}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Bandeja vacía</span>
                  )}
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title" style={{ color: '#BCA986' }}>EN REVISIÓN</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {capasEnRevision.map((capa, index) => (
                    <span key={index} className="bandeja-item" title={capa} style={{ fontWeight: '600' }}>{capa}</span>
                  ))}
                  <span className="bandeja-item" style={{ fontWeight: '600' }}>censo_paraderos_2026</span>
                  <span className="bandeja-item" style={{ fontWeight: '600' }}>pimus_municipio_carmen</span>
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title" style={{ color: '#BCA986' }}>APROBADOS</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <span className="bandeja-item" style={{ fontWeight: '600' }}>red_vial_primaria</span>
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden' }}>
                <h5 className="bandeja-category-title" style={{ color: '#BCA986' }}>RECHAZADOS</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                  <span className="bandeja-item" style={{ fontWeight: '600' }}>censo_paraderos_2025</span>
                  <span style={{ fontSize: '11px', color: '#FCA5A5', paddingLeft: '2px', cursor: 'pointer', textDecoration: 'underline' }}>
                    Ver comentarios
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ACORDEÓN 2: Instrumentos */}
          <button className={`admin-nav-link ${instrumentosOpen ? 'active' : ''}`} onClick={() => setInstrumentosOpen(!instrumentosOpen)} style={{ backgroundColor: instrumentosOpen ? 'rgba(0, 0, 0, 0.05)' : 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <FileText size={18} />
            <span>Instrumentos</span>
            {instrumentosOpen ? <ChevronUp size={16} className="nav-chevron" /> : <ChevronDown size={16} className="nav-chevron" />}
          </button>

          <div className={`admin-nav-submenu ${instrumentosOpen ? 'open' : ''}`} style={{ background: 'transparent', maxHeight: instrumentosOpen ? '800px' : '0' }}>
            <div className="box-container" style={{ padding: '10px 20px 16px 44px' }}>
              
              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title" style={{ color: '#BCA986' }}>EN BORRADORES</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Bandeja vacía</span>
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden', marginBottom: '12px' }}>
                <h5 className="bandeja-category-title" style={{ color: '#BCA986' }}>EN REVISIÓN</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {instrumentosEnRevision.map((inst, index) => (
                    <span key={index} className="bandeja-item" title={inst} style={{ fontWeight: '600' }}>{inst}</span>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', overflow: 'hidden' }}>
                <h5 className="bandeja-category-title" style={{ color: '#BCA986' }}>APROBADOS</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  {instrumentosAprobados.map((inst, index) => (
                    <span key={index} className="bandeja-item" title={inst} style={{ fontWeight: '600' }}>{inst}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Cerrar Sesión */}
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