import React from 'react';
import KPICard from './KPICard';
import { Map, ShieldCheck, Activity } from 'lucide-react';

const DashboardKPIs = ({ capa }) => {
  if (!capa) return null;

  return (
    <div className="kpi-dashboard-panel" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
      <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--c-guinda)', background: 'rgba(255,255,255,0.9)', padding: '8px 12px', borderRadius: '4px' }}>
        Análisis de Impacto Espacial
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <KPICard 
          title="Elemento Auditado" 
          value={capa} 
          unit="" 
          trend={0} 
          icon={Map} 
          color="#3B82F6" 
        />
        
        <KPICard 
          title="Validación Topológica" 
          value="100" 
          unit="% (Sin traslapes)" 
          trend={12} 
          icon={ShieldCheck} 
          color="#10B981" 
        />

        <KPICard 
          title="Variación Territorial" 
          value="2.4" 
          unit="km" 
          trend={-5} 
          icon={Activity} 
          color="#F59E0B" 
        />
      </div>
    </div>
  );
};

export default DashboardKPIs;