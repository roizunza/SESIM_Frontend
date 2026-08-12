import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Administracion.css';

const Administracion = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      /* Interceptacion del flujo para mostrar politicas de uso */
      setShowPoliciesModal(true);
    }
  };

  const handleAcceptPolicies = () => {
    /* Ejecucion de la redireccion final al visor administrativo */
    navigate('/admin-visor');
  };

  const handleCancelPolicies = () => {
    /* Cierre del modal, el usuario permanece en la vista de login */
    setShowPoliciesModal(false);
  };

  return (
    <div className="admin-container">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Inicio de Sesión</h1>
        
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="ejemplo@gobcampeche.com.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="constraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-login-submit">
            Entrar
          </button>
        </form>
      </div>

      {/* Renderizado condicional del modal de politicas */}
      {showPoliciesModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">SESIM - Sistema Estatal de Seguimiento a indicadores de Movilidad y Seguridad vial</h2>
            <h3 className="modal-subtitle">Políticas de uso del sitio</h3>
            
            <div className="modal-text">
              <p>
                La información geoespacial y estadística gestionada en este módulo de la plataforma del Gobierno del Estado de Campeche se encuentra en actualización continua por parte de las unidades administrativas competentes. Debido a la naturaleza dinámica del sistema, los datos pueden contener diferencias en relación al tema o característica que representa.
              </p>
              <p>
               Para fines de estandarización, todas las capas espaciales han sido reproyectadas al sistema EPSG 4326. Es responsabilidad estricta del usuario verificar la exactitud, integridad y vigencia de la información antes de realizar cualquier análisis o alteración en el sistema.
              </p>
              <p>
                Si selecciona la opción <strong>Aceptar</strong> ingresará al SESIM. Si selecciona <strong>Cancelar</strong> permanecerá en la página de inicio de sesión.
              </p>
            </div>

            <div className="modal-actions">
              <button className="modal-btn modal-btn-accept" onClick={handleAcceptPolicies}>
                Aceptar
              </button>
              <button className="modal-btn modal-btn-cancel" onClick={handleCancelPolicies}>
                Cancelar
              </button>
            
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Administracion;