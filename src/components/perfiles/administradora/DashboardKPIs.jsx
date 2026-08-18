import React from 'react';
import { Target, PieChart, BarChart2 } from 'lucide-react';

const DashboardKPIs = ({ capa }) => {
  if (!capa) return null;

  return (
    <div className="kpi-dashboard-panel" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
      
      {/* Título dinámico que muestra el Indicador actual */}
      <h4 style={{ 
        margin: '0 0 16px', 
        fontSize: '15px', 
        color: 'var(--c-guinda-dk)', 
        background: 'var(--c-white)', 
        padding: '12px 16px', 
        borderRadius: '6px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
        borderLeft: '4px solid var(--c-guinda)' 
      }}>
        {capa}
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* 1. CAJA: Dispersión Municipal */}
        <div className="geo-card">
          <div className="geo-card-header">
            <Target size={14} color="var(--c-guinda)" />
            <span>Dispersión Municipal</span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>
            Densidad vs. Población
          </p>
          <div className="scatter-mockup">
            {/* Simulacion de puntos de dispersion */}
            <div className="scatter-dot" style={{ bottom: '10%', left: '10%' }}></div>
            <div className="scatter-dot" style={{ bottom: '15%', left: '20%' }}></div>
            <div className="scatter-dot" style={{ bottom: '40%', left: '35%' }}></div>
            <div className="scatter-dot" style={{ bottom: '60%', left: '50%', transform: 'scale(1.5)' }}></div>
            <div className="scatter-dot" style={{ bottom: '30%', left: '70%' }}></div>
            <div className="scatter-dot" style={{ bottom: '80%', left: '85%', transform: 'scale(2)' }}></div>
          </div>
        </div>

        {/* 2. CAJA: Proporción Territorial (Dona) */}
        <div className="geo-card">
          <div className="geo-card-header">
            <PieChart size={14} color="var(--c-guinda)" />
            <span>Cobertura Territorial</span>
          </div>
          <div className="donut-container">
            <div className="donut-chart">
              <div className="donut-hole"></div>
            </div>
            <div className="donut-stats">
              <div className="stat-row primary">
                <span>Zona Urbana</span>
                <span>68%</span>
              </div>
              <div className="stat-row secondary">
                <span>Zona Rural</span>
                <span>32%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CAJA: Ranking (Barras Horizontales) */}
        <div className="geo-card">
          <div className="geo-card-header">
            <BarChart2 size={14} color="var(--c-guinda)" />
            <span>Top 3 Concentración</span>
          </div>
          <div className="hbar-container">
            
            <div className="hbar-row">
              <div className="hbar-label"><span>Carmen</span><span>124 km</span></div>
              <div className="hbar-track"><div className="hbar-fill" style={{ width: '85%' }}></div></div>
            </div>

            <div className="hbar-row">
              <div className="hbar-label"><span>Campeche</span><span>98 km</span></div>
              <div className="hbar-track"><div className="hbar-fill" style={{ width: '65%' }}></div></div>
            </div>

            <div className="hbar-row">
              <div className="hbar-label"><span>Champotón</span><span>45 km</span></div>
              <div className="hbar-track"><div className="hbar-fill" style={{ width: '30%' }}></div></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardKPIs;