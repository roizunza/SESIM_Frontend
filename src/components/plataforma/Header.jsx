import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, History, UploadCloud } from 'lucide-react';

export default function Header({ isAdmin = false }) {
  const navigate = useNavigate();

  const handleImgError = (e) => {
    e.currentTarget.style.display = 'none';
    const placeholder = e.currentTarget.nextElementSibling;
    if (placeholder) placeholder.style.display = 'flex';
  };

  /* Funcion para manejar la accion del boton de usuario */
  const handleUserAction = () => {
    if (isAdmin) {
      /* Logica futura de cierre de sesion */
      navigate('/');
    } else {
      navigate('/admin');
    }
  };

  return (
    <header className="header" role="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB' }}>
      <div className="header__inner" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link to="/" className="header__logos" aria-label="Ir al inicio" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', height: 56, display: 'flex', alignItems: 'center' }}>
            <img src="/gobiernoparatodos.png" alt="Escudo del Estado de Campeche" className="header__logo-img header__logo-img--campeche" onError={handleImgError} style={{ height: '40px' }} />
          </div>
          
          <div className="header__logo-divider" aria-hidden="true" style={{ width: '1px', height: '32px', backgroundColor: '#E5E7EB' }} />
          
          <div style={{ position: 'relative', height: 56, display: 'flex', alignItems: 'center' }}>
            <img src="/logocampeche.png" alt="Gobierno para Todos" className="header__logo-img header__logo-img--gobierno" onError={handleImgError} style={{ height: '40px' }} />
          </div>
        </Link>

        {/* Controles de Usuario y Notificaciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Controles exclusivos de la administradora */}
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid #E5E7EB', paddingRight: '16px' }}>

              {/* Botón de Bitácora / Histórico */}
              <button 
                style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Bitácora de Auditoría"
              >
                <History size={20} />
              </button>
            </div>
          )}

          {/* Botón de Login / Logout */}
          <button 
            className="header__user-btn" 
            aria-label={isAdmin ? "Cerrar sesión" : "Iniciar sesión"}
            onClick={handleUserAction}
            title={isAdmin ? "Cerrar sesión" : "Iniciar sesión"}
            style={{ background: 'transparent', border: 'none', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isAdmin ? <LogOut size={20} /> : <User size={20} />}
          </button>

        </div>
      </div>
    </header>
  );
}