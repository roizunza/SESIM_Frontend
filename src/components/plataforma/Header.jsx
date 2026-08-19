import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, History } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  /* Se lee el rol y el ID del usuario activo desde el almacenamiento local */
  const userRole = localStorage.getItem('sim_role');
  const userId = localStorage.getItem('sim_user_id') || 'usuario_actual';

  const handleImgError = (e) => {
    e.currentTarget.style.display = 'none';
    const placeholder = e.currentTarget.nextElementSibling;
    if (placeholder) placeholder.style.display = 'flex';
  };

  /* Transicion de autenticacion */
  const handleUserAction = () => {
    if (userRole) {
      /* Se limpian las credenciales al cerrar sesion */
      localStorage.removeItem('sim_role');
      localStorage.removeItem('sim_user_id');
      navigate('/');
    } else {
      navigate('/admin');
    }
  };

  /* Enrutamiento dinamico de la bitacora basado en el perfil y credencial */
  const handleAbrirBitacora = () => {
    if (userRole === 'administradora' || userRole === 'administrador') {
      /* La administradora requiere acceso a la vista integral */
      navigate('/logs/global');
    } else if (userRole === 'capturista') {
      /* El capturista solo accede a la vista filtrada por su identificador */
      navigate(`/logs/user/${userId}`);
    }
  };

  return (
    <header className="header" role="banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', backgroundColor: 'var(--c-white)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="header__inner" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link to="/" className="header__logos" aria-label="Ir al inicio" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', height: 56, display: 'flex', alignItems: 'center' }}>
            <img src="/gobiernoparatodos.png" alt="Escudo del Estado de Campeche" className="header__logo-img header__logo-img--campeche" onError={handleImgError} style={{ height: '40px' }} />
          </div>
          
          <div className="header__logo-divider" aria-hidden="true" style={{ width: '1px', height: '32px', backgroundColor: 'var(--border-color)' }} />
          
          <div style={{ position: 'relative', height: 56, display: 'flex', alignItems: 'center' }}>
            <img src="/logocampeche.png" alt="Gobierno para Todos" className="header__logo-img header__logo-img--gobierno" onError={handleImgError} style={{ height: '40px' }} />
          </div>
        </Link>

        {/* Controles de Usuario y Notificaciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* El boton de bitacora se expone unicamente para perfiles con permisos de log */}
          {(userRole === 'administradora' || userRole === 'administrador' || userRole === 'capturista') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
              <button 
                onClick={handleAbrirBitacora}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title={userRole === 'capturista' ? "Mi Historial de Actividad" : "Bitácora de Auditoría Global"}
              >
                <History size={20} />
              </button>
            </div>
          )}

          {/* Boton de Login / Logout */}
          <button 
            className="header__user-btn" 
            aria-label={userRole ? "Cerrar sesión" : "Iniciar sesión"}
            onClick={handleUserAction}
            title={userRole ? "Cerrar sesión" : "Iniciar sesión"}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {userRole ? <LogOut size={20} /> : <User size={20} />}
          </button>

        </div>
      </div>
    </header>
  );
}