import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Administracion.css';

const Administracion = () => {
  /* Estado para alternar la visibilidad del input de contrasena */
  const [showPassword, setShowPassword] = useState(false);
  
  /* Estados para almacenar los valores ingresados */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* Instancia del hook para redireccion programatica */
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    /* Simulacion de validacion: asegurar que los campos no esten vacios */
    if (email && password) {
      /* Redireccion a la ruta de geovisualización administrativa*/
      navigate('/admin-visor');
    }
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
                placeholder="contraseña"
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
    </div>
  );
};

export default Administracion;