import React from 'react';
import KPICard from '../components/matriz/KPICard';
import MapViewer from '../components/geovisor/MapViewer';
import { Users, TrendingUp, Bus, Activity } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="map-section">
        <div className="map-wrapper">
          <MapViewer />
        </div>
      </div>

      <div className="kpi-grid">
        <KPICard 
          title="Viajes Diarios (Est.)" 
          value="1.2M" 
          unit="viajes" 
          trend={5.2} 
          icon={Activity} 
          color="#0E6EC5" 
        />
        <KPICard 
          title="Cobertura de Transporte" 
          value="84" 
          unit="%" 
          trend={1.5} 
          icon={Bus} 
          color="#0ACFD8" 
        />
        <KPICard 
          title="Crecimiento Urbano" 
          value="+4.2" 
          unit="km²" 
          trend={2.1} 
          icon={TrendingUp} 
          color="#0FCE9A" 
        />
        <KPICard 
          title="Población Servida" 
          value="750k" 
          unit="hab" 
          trend={-0.5} 
          icon={Users} 
          color="#7BC961" 
        />
      </div>
    </div>
  );
};

export default Geovisualizador;
