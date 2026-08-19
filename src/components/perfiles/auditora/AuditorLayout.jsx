import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, ScaleControl, GeoJSON, useMap } from 'react-leaflet';
import AuditorSidebar from './AuditorSidebar';
import { Download, UploadCloud, XCircle, CheckCircle, List, Map, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import '../../geovisor/AdminMapViewer.css';
import '../capturista/Capturista.css'; 
import '../administradora/Admin.css';
import './Auditor.css';

/* Helper para capturar la instancia del mapa */
const MapInstanceCapture = ({ setMapInstance }) => {
  const map = useMap();
  useEffect(() => { setMapInstance(map); }, [map, setMapInstance]);
  return null;
};

const MapFlyTo = ({ capaActiva }) => {
  const map = useMap();
  useEffect(() => {
    if (capaActiva) map.flyTo([19.83, -90.54], 11, { duration: 1.5 });
  }, [capaActiva, map]);
  return null;
};

const CAMPECHE_BOUNDS = [[13.5, -97.0], [25.0, -83.0]];

const AuditorLayout = () => {
  const [mapInstance, setMapInstance] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [capaActivaAuditoria, setCapaActivaAuditoria] = useState('');

  /* Herramientas de Mapa */
  const [mapaBaseOpen, setMapaBaseOpen] = useState(false);
  const [activeBaseMap, setActiveBaseMap] = useState('cartoLight');

  /* Logica de arrastre de la caja de herramientas */
  const [herramientasPos, setHerramientasPos] = useState({ x: 300, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ startX: 0, startY: 0, x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = { startX: e.clientX, startY: e.clientY, x: herramientasPos.x, y: herramientasPos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setHerramientasPos({
        x: dragStartPos.current.x + (e.clientX - dragStartPos.current.startX),
        y: dragStartPos.current.y + (e.clientY - dragStartPos.current.startY)
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
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

  const handleSelectCapa = (nombreCapa) => {
    setCapaActivaAuditoria(nombreCapa);
  };

  return (
    <div className="dashboard-fullscreen-container">
      
      {/* CAPA 1: MAPA MODO LECTURA */}
      <div className="dashboard-map-area">
        
        {/* CAJA DE HERRAMIENTAS UNIFICADA */}
        <div className="draggable-wrapper" style={{ left: `${herramientasPos.x}px`, top: `${herramientasPos.y}px`, position: 'absolute', zIndex: 1000, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '8px' }}>
          
          <div className="floating-panel" style={{ position: 'relative', top: 'auto', left: 'auto', width: '280px', margin: 0 }}>
            <div className="panel-header drag-handle" onMouseDown={handleMouseDown}>
              <List size={18} /><h4>Herramientas del Mapa</h4>
            </div>

            <div className="panel-content" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h5 className="panel-section-title">Simbología Activa</h5>
              {capaActivaAuditoria ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: 'rgba(107, 114, 128, 0.4)', border: '2px solid #6B7280', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={capaActivaAuditoria}>
                      {capaActivaAuditoria}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', paddingLeft: '24px' }}>Capa Histórica (Auditoría)</span>
                </div>
              ) : (
                <p className="text-muted" style={{ margin: 0 }}>Seleccione una capa para auditar.</p>
              )}
            </div>

            <div className="accordion-section">
              <button className="accordion-header" onClick={() => setMapaBaseOpen(!mapaBaseOpen)}>
                <div className="header-title"><Map size={16} /><span>Mapa Base</span></div>
                {mapaBaseOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div className={`accordion-content ${mapaBaseOpen ? 'open' : ''}`}>
                <div className="base-map-grid" style={{ marginTop: '8px' }}>
                  <button className={`base-map-btn ${activeBaseMap === 'cartoLight' ? 'active' : ''}`} onClick={() => setActiveBaseMap('cartoLight')}>Carto Light</button>
                  <button className={`base-map-btn ${activeBaseMap === 'cartoDark' ? 'active' : ''}`} onClick={() => setActiveBaseMap('cartoDark')}>Carto Dark</button>
                  <button className={`base-map-btn ${activeBaseMap === 'googleTer' ? 'active' : ''}`} onClick={() => setActiveBaseMap('googleTer')}>Google Terrain</button>
                  <button className={`base-map-btn ${activeBaseMap === 'googleSat' ? 'active' : ''}`} onClick={() => setActiveBaseMap('googleSat')}>Google Sat</button>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de zoom */}
          <div className="external-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button onClick={() => mapInstance?.zoomIn()} title="Acercar"><Plus size={16} /></button>
            <button onClick={() => mapInstance?.zoomOut()} title="Alejar"><Minus size={16} /></button>
          </div>
        </div>

        <MapContainer center={[19.3, -90.5]} zoom={8} minZoom={7} maxBounds={CAMPECHE_BOUNDS} zoomControl={false} style={{ width: '100%', height: '100%', zIndex: 1 }} preferCanvas={true}>
          <MapInstanceCapture setMapInstance={setMapInstance} />
          {renderBaseMap()}
          <MapFlyTo capaActiva={capaActivaAuditoria} />
          {capaActivaAuditoria && (
            <GeoJSON 
              key={capaActivaAuditoria} 
              data={{ type: "Feature", geometry: { type: "Polygon", coordinates: [[[-90.58, 19.82], [-90.48, 19.82], [-90.48, 19.88], [-90.58, 19.88], [-90.58, 19.82]]] } }} 
              pathOptions={{ color: '#6B7280', weight: 2, fillColor: '#6B7280', fillOpacity: 0.2 }} 
            />
          )}
          <ScaleControl position="bottomleft" imperial={false} />
        </MapContainer>
      </div>

      {/* CAPA 2: SIDEBAR */}
      <div className="floating-sidebar-wrapper">
        <AuditorSidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          onSelectCapa={handleSelectCapa}
          capaActiva={capaActivaAuditoria}
        />
      </div>

      {/* CAPA 3: PANEL DE TRAZABILIDAD (Línea de Tiempo) */}
      {capaActivaAuditoria && (
        <div className="floating-right-panel" style={{ width: '400px', height: 'calc(100% - 48px)', bottom: '24px' }}>
          
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="panel-section-title" style={{ margin: 0 }}>LOG DE ACTIVIDAD</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '15px', color: 'var(--text-primary)' }}>{capaActivaAuditoria}</h3>
            </div>
            {/* Aplicación del botón normalizado */}
            <button className="btn-base btn-tertiary" style={{ width: 'auto', padding: '0 12px', height: '36px' }}>
              <Download size={14} /> PDF
            </button>
          </div>

          <div className="timeline-container">
            
            <div className="timeline-item">
              <div className="timeline-icon approve"><CheckCircle size={16} /></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-user">Administradora (Rocío)</span>
                  <span className="timeline-date">12 Ago 2026, 09:15</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px' }}>Capa aprobada y publicada en el tablero operativo.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon upload"><UploadCloud size={16} /></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-user">Capturista (Juan C.)</span>
                  <span className="timeline-date">11 Ago 2026, 16:30</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px' }}>Se subió la corrección geométrica de la capa.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon reject"><XCircle size={16} /></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-user">Administradora (Rocío)</span>
                  <span className="timeline-date">11 Ago 2026, 11:45</span>
                </div>
                <p className="timeline-comment">"La capa tiene un desfase de 30 metros en la zona norte del polígono. Revisar EPSG antes de volver a enviar."</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon upload"><UploadCloud size={16} /></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-user">Capturista (Juan C.)</span>
                  <span className="timeline-date">10 Ago 2026, 10:00</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px' }}>Carga inicial del archivo .geojson y metadatos.</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AuditorLayout;