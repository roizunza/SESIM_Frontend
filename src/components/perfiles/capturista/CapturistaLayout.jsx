import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, ScaleControl, Polyline, Marker, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Map, List, Plus, Minus, Ruler, ChevronDown, ChevronUp } from 'lucide-react';
import CapturistaSidebar from './CapturistaSidebar';
import 'leaflet/dist/leaflet.css';
import '../../geovisor/AdminMapViewer.css';

/* Helper para capturar la instancia del mapa */
const MapInstanceCapture = ({ setMapInstance }) => {
  const map = useMap();
  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);
  return null;
};

/* Componente nativo para medir distancias */
const MeasureTool = ({ isMeasuring }) => {
  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState(0);

  useMapEvents({
    click(e) {
      if (!isMeasuring) return;
      const newPoints = [...points, e.latlng];
      setPoints(newPoints);
      
      /* Calculo de distancia acumulada en metros */
      if (newPoints.length > 1) {
        let dist = 0;
        for (let i = 0; i < newPoints.length - 1; i++) {
          dist += newPoints[i].distanceTo(newPoints[i + 1]);
        }
        setDistance(dist);
      }
    }
  });

  useEffect(() => {
    if (!isMeasuring) {
      setPoints([]);
      setDistance(0);
    }
  }, [isMeasuring]);

  if (!isMeasuring || points.length === 0) return null;

  const dotIcon = L.divIcon({
    className: 'measure-dot',
    iconSize: [10, 10]
  });

  return (
    <>
      <Polyline positions={points} color="#6b1428" weight={3} dashArray="5, 10" />
      {points.map((p, i) => (
        <Marker key={i} position={p} icon={dotIcon}>
          {i === points.length - 1 && points.length > 1 && (
            <Tooltip permanent direction="right" offset={[10, 0]} className="measure-tooltip">
              {(distance / 1000).toFixed(2)} km
            </Tooltip>
          )}
        </Marker>
      ))}
    </>
  );
};

const CAMPECHE_BOUNDS = [
  [13.5, -97.0],
  [25.0, -83.0]
];

const CapturistaLayout = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mapaBaseOpen, setMapaBaseOpen] = useState(true);
  const [activeBaseMap, setActiveBaseMap] = useState('cartoLight');
  
  /* Estado para la herramienta de medicion */
  const [isMeasuring, setIsMeasuring] = useState(false);

  /* Logica para hacer la caja arrastrable */
  const [simbologiaPos, setSimbologiaPos] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ startX: 0, startY: 0, x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = {
      startX: e.clientX,
      startY: e.clientY,
      x: simbologiaPos.x,
      y: simbologiaPos.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartPos.current.startX;
      const dy = e.clientY - dragStartPos.current.startY;
      setSimbologiaPos({
        x: dragStartPos.current.x + dx,
        y: dragStartPos.current.y + dy
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);
  
  const renderBaseMap = () => {
    switch (activeBaseMap) {
      case 'cartoLight': return <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />;
      case 'cartoDark': return <TileLayer url="http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />;
      case 'googleTer': return <TileLayer url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}" />;
      case 'googleSat': return <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />;
      default: return null;
    }
  };

  return (
    <div className="admin-map-wrapper">
      <CapturistaSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className={`admin-map-container ${isMeasuring ? 'measuring-mode' : ''}`}>
        
        {/* Contenedor arrastrable (Simbología + Herramientas de navegación) */}
        <div 
          className="draggable-wrapper"
          style={{ left: `${simbologiaPos.x}px`, top: `${simbologiaPos.y}px` }}
        >
          <div className="floating-panel" style={{ position: 'relative', top: 'auto', left: 'auto', width: '260px', margin: 0 }}>
            <div className="panel-header drag-handle" onMouseDown={handleMouseDown}>
              <List size={18} />
              <h4>Simbología Activa</h4>
            </div>
            <div className="panel-content">
              <p className="text-muted">No hay capas cargadas en previsualización.</p>
            </div>
          </div>

          <div className="external-toolbar">
            <button onClick={() => mapInstance?.zoomIn()} title="Acercar">
              <Plus size={16} />
            </button>
            <button onClick={() => mapInstance?.zoomOut()} title="Alejar">
              <Minus size={16} />
            </button>
            <button 
              className={isMeasuring ? 'active' : ''} 
              onClick={() => setIsMeasuring(!isMeasuring)} 
              title="Medir distancia"
            >
              <Ruler size={16} />
            </button>
          </div>
        </div>

        {/* Panel lateral derecho estático para selector de Mapa Base */}
        <div className="floating-panel floating-right">
          <div className="accordion-section">
            <button className="accordion-header" onClick={() => setMapaBaseOpen(!mapaBaseOpen)}>
              <div className="header-title">
                <Map size={18} />
                <span>Mapa Base</span>
              </div>
              {mapaBaseOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className={`accordion-content ${mapaBaseOpen ? 'open' : ''}`}>
              <div className="base-map-grid">
                <button className={`base-map-btn ${activeBaseMap === 'cartoLight' ? 'active' : ''}`} onClick={() => setActiveBaseMap('cartoLight')}>Carto</button>
                <button className={`base-map-btn ${activeBaseMap === 'cartoDark' ? 'active' : ''}`} onClick={() => setActiveBaseMap('cartoDark')}>Carto Dark</button>
                <button className={`base-map-btn ${activeBaseMap === 'googleTer' ? 'active' : ''}`} onClick={() => setActiveBaseMap('googleTer')}>Google Ter</button>
                <button className={`base-map-btn ${activeBaseMap === 'googleSat' ? 'active' : ''}`} onClick={() => setActiveBaseMap('googleSat')}>Google Sat</button>
              </div>
            </div>
          </div>
        </div>

        <MapContainer 
          center={[19.3, -90.5]} 
          zoom={8} 
          minZoom={7}
          maxBounds={CAMPECHE_BOUNDS}
          zoomControl={false}
          className="admin-leaflet-map"
          preferCanvas={true}
        >
          <MapInstanceCapture setMapInstance={setMapInstance} />
          {renderBaseMap()}
          <ScaleControl position="bottomleft" imperial={false} />
          <MeasureTool isMeasuring={isMeasuring} />
        </MapContainer>
      </div>
    </div>
  );
};

export default CapturistaLayout;