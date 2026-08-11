import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

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
      /* Logica futura de cierre de sesion (limpiar tokens, etc) */
      navigate('/');
    } else {
      navigate('/admin');
    }
  };

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <div className="header__logos">
          <div style={{ position: 'relative', height: 56, display: 'flex', alignItems: 'center' }}>
            <img src="/gobiernoparatodos.jpeg" alt="Escudo del Estado de Campeche" className="header__logo-img header__logo-img--campeche" onError={handleImgError} />
            <div className="header__logo-placeholder header__logo-img--campeche" style={{ display: 'none', height: 56 }}>
              <span style={{ fontSize: 10, color: 'var(--c-gray-md)', textAlign: 'center', lineHeight: 1.3 }}>Logo<br />Campeche</span>
            </div>
          </div>
          <div className="header__logo-divider" aria-hidden="true" />
          <div style={{ position: 'relative', height: 56, display: 'flex', alignItems: 'center' }}>
            <img src="/logocampeche.jpg" alt="Gobierno para Todos" className="header__logo-img header__logo-img--gobierno" onError={handleImgError} />
            <div className="header__logo-placeholder header__logo-img--gobierno" style={{ display: 'none', height: 56 }}>
              <span style={{ fontSize: 10, color: 'var(--c-gray-md)', textAlign: 'center', lineHeight: 1.3 }}>Gobierno<br />para Todos</span>
            </div>
          </div>
        </div>

        <button 
          className="header__user-btn" 
          aria-label={isAdmin ? "Cerrar sesión" : "Iniciar sesión"}
          onClick={handleUserAction}
          title={isAdmin ? "Cerrar sesión" : "Iniciar sesión"}
        >
          {isAdmin ? <LogOut size={20} /> : <User size={20} />}
        </button>
      </div>
    </header>
  );
}