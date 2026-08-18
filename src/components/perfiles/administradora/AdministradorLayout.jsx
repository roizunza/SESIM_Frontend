import React, { useState } from 'react';
import AdministradorSidebar from './AdministradorSidebar';
import DashboardKPIs from './DashboardKPIs';
import { Download, Table, Play } from 'lucide-react';
import './Admin.css';

/* JSON del Catálogo Reducido */
const catalogos = {
  "cat_instrumento": [
    {"id": "lgmsv", "etiqueta": "Ley General de Movilidad y Seguridad Vial (LGMSV)"}, 
    {"id": "enamov", "etiqueta": "Estrategia Nacional de Movilidad (ENAMOV)"}, 
    {"id": "ley_estatal", "etiqueta": "Ley de Movilidad del Estado de Campeche"}, 
    {"id": "eemsv", "etiqueta": "Estrategia Estatal de Movilidad y Seguridad Vial"}, 
    {"id": "ped", "etiqueta": "Plan Estatal de Desarrollo (PED)"}, 
    {"id": "pimus", "etiqueta": "PIMUS"}, 
    {"id": "pmduot", "etiqueta": "PMDUOT"}
  ],
  "cat_escala": [
    {"id": "estatal", "etiqueta": "Estatal"}, 
    {"id": "municipal", "etiqueta": "Municipal"}, 
    {"id": "regional", "etiqueta": "Regional"}, 
    {"id": "localidad", "etiqueta": "Localidad / Zona Urbana"}
  ],
  "cat_eje_evaluacion": [
    {"id": "sectorial", "etiqueta": "Sectorial"}, 
    {"id": "desempeno", "etiqueta": "De Desempeño"}
  ]
};

const AdministradorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardActivo, setDashboardActivo] = useState(false);
  const [capaSimulada, setCapaSimulada] = useState('');

  const handleGenerarTablero = () => {
    setCapaSimulada('Red de Movilidad Estatal');
    setDashboardActivo(true);
  };

  return (
    <div className="dashboard-fullscreen-container">
      
      {/* CAPA 1: MAPA */}
      <div className="dashboard-map-area">
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
          <h2>Geovisor Base</h2>
        </div>
      </div>

      {/* CAPA 2: SIDEBAR */}
      <div className="floating-sidebar-wrapper">
        <AdministradorSidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          capasEnRevision={['red_ciclovias_v2']} 
          capasAprobadas={[]}
          onSelectCapa={() => {}}
          capaActiva={''}
        />
      </div>

      {/* CAPA 3: KPIs DERECHA */}
      {dashboardActivo && (
        <div className="floating-right-panel" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <DashboardKPIs capa={capaSimulada} />
        </div>
      )}

      {/* CAPA 4: TABLERO OPERATIVO INFERIOR */}
      <div className="fullwidth-bottom-banner" style={{ left: isSidebarOpen ? '280px' : '0', transition: 'left 0.3s ease' }}>
        <div className="banner-filter-row">
          
          {/* FILTRO 1 */}
          <div className="filter-group">
            <label>Instrumento Normativo</label>
            <select>
              <option value="">Seleccione instrumento...</option>
              {catalogos.cat_instrumento.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}
            </select>
          </div>

          {/* FILTRO 2 */}
          <div className="filter-group">
            <label>Escala Territorial</label>
            <select>
              <option value="">Seleccione escala...</option>
              {catalogos.cat_escala.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}
            </select>
          </div>

          {/* FILTRO 3 */}
          <div className="filter-group">
            <label>Eje de Evaluación</label>
            <select>
              <option value="">Seleccione eje...</option>
              {catalogos.cat_eje_evaluacion.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}
            </select>
          </div>

          {/* FILTRO 4 (Dependiente del eje) */}
          <div className="filter-group">
            <label>Indicador</label>
            <select>
              <option value="">Seleccione indicador...</option>
              <option>Cobertura de Ciclovías</option>
              <option>Siniestralidad Vial</option>
            </select>
          </div>

          {/* COLUMNA DE BOTONES APILADOS */}
          <div className="filter-buttons-column">
            <button className="btn-generar" onClick={handleGenerarTablero}>
              <Play size={16} fill="currentColor" /> Generar
            </button>
            <button className="btn-tabla">
              <Table size={16} /> Ver tabla de atributos
            </button>
            <button className="btn-exportar">
              <Download size={16} /> Exportar
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdministradorLayout;