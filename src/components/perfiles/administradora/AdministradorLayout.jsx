import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, ScaleControl, Polyline, Marker, Tooltip, useMapEvents, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import AdministradorSidebar from './AdministradorSidebar';
import DashboardKPIs from './DashboardKPIs';
import PanelDictamen from './PanelDictamen';
import { Download, Table, Play, Map, List, Plus, Minus, Ruler, ChevronDown, ChevronUp, Printer } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import '../../geovisor/AdminMapViewer.css';
import '../capturista/Capturista.css'; 
import './Admin.css';

/* Helper para capturar la instancia del mapa */
const MapInstanceCapture = ({ setMapInstance }) => {
  const map = useMap();
  useEffect(() => { setMapInstance(map); }, [map, setMapInstance]);
  return null;
};

/* Componente para la herramienta de medicion lineal */
const MeasureTool = ({ isMeasuring }) => {
  const [points, setPoints] = useState([]);
  const [distance, setDistance] = useState(0);

  useMapEvents({
    click(e) {
      if (!isMeasuring) return;
      const newPoints = [...points, e.latlng];
      setPoints(newPoints);
      if (newPoints.length > 1) {
        let dist = 0;
        for (let i = 0; i < newPoints.length - 1; i++) {
          dist += newPoints[i].distanceTo(newPoints[i + 1]);
        }
        setDistance(dist);
      }
    }
  });

  useEffect(() => { if (!isMeasuring) { setPoints([]); setDistance(0); } }, [isMeasuring]);

  if (!isMeasuring || points.length === 0) return null;
  const dotIcon = L.divIcon({ className: 'measure-dot', iconSize: [10, 10] });

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

/* JSON del Catalogo Operativo */
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

const mockGeoJSONData = {
  type: "FeatureCollection",
  features: [{
    type: "Feature",
    properties: { id: "T-001", instrumento: "PIMUS", nivel: "Estatal", fecha: "2026-08-15", estatus: "En Revisión", indicador: "Ciclovías" },
    geometry: { type: "Polygon", coordinates: [[[-90.58, 19.82], [-90.48, 19.82], [-90.48, 19.88], [-90.58, 19.88], [-90.58, 19.82]]] }
  }]
};

const CAMPECHE_BOUNDS = [[13.5, -97.0], [25.0, -83.0]];

const AdministradorLayout = () => {
  const [mapInstance, setMapInstance] = useState(null);
  
  /* Estados Generales de Paneles */
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardActivo, setDashboardActivo] = useState(false);
  const [isDictamenOpen, setIsDictamenOpen] = useState(false);
  
  /* Estados de Datos y Capas */
  const [capaSimulada, setCapaSimulada] = useState('');
  const [capaActivaAuditoria, setCapaActivaAuditoria] = useState('');
  const [capasEnRevision, setCapasEnRevision] = useState(['red_ciclovias_v2', 'censo_paraderos_2026']);
  const [capasAprobadas, setCapasAprobadas] = useState(['red_vial_primaria']);

  /* Estados de las Herramientas del Mapa */
  const [mapaBaseOpen, setMapaBaseOpen] = useState(false);
  const [activeBaseMap, setActiveBaseMap] = useState('cartoLight');
  const [isMeasuring, setIsMeasuring] = useState(false);

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

  /* Handlers Operativos */
  const handleGenerarTablero = () => {
    setCapaSimulada('Red de Movilidad Estatal');
    setDashboardActivo(true);
  };

  const handleSelectCapaAuditoria = (nombreCapa) => {
    setCapaActivaAuditoria(nombreCapa);
    setIsDictamenOpen(true);
    if (mapInstance) mapInstance.flyTo([19.85, -90.53], 12, { duration: 1.5 });
  };

  const procesarDictamen = (decision, comentario) => {
    if (decision === 'aprobar') {
      setCapasEnRevision(prev => prev.filter(c => c !== capaActivaAuditoria));
      setCapasAprobadas(prev => [capaActivaAuditoria, ...prev]);
    } else {
      setCapasEnRevision(prev => prev.filter(c => c !== capaActivaAuditoria));
    }
    setIsDictamenOpen(false);
    setCapaActivaAuditoria('');
  };

  return (
    <div className="dashboard-fullscreen-container">
      
      {/* CAPA 1: MAPA Y HERRAMIENTAS */}
      <div className={`dashboard-map-area ${isMeasuring ? 'measuring-mode' : ''}`}>
        
        {/* CAJA DE HERRAMIENTAS UNIFICADA ARRASTRABLE */}
        <div className="draggable-wrapper" style={{ left: `${herramientasPos.x}px`, top: `${herramientasPos.y}px`, position: 'absolute', zIndex: 1000, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '8px' }}>
          
          <div className="floating-panel" style={{ position: 'relative', top: 'auto', left: 'auto', width: '280px', margin: 0 }}>
            <div className="panel-header drag-handle" onMouseDown={handleMouseDown}>
              <List size={18} /><h4>Herramientas del Mapa</h4>
            </div>

            <div className="panel-content" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <h5 style={{ margin: '0 0 12px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simbología Activa</h5>
              {capaActivaAuditoria || capaSimulada ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <div style={{ width: '16px', height: '16px', backgroundColor: 'rgba(245, 158, 11, 0.4)', border: '2px solid #F59E0B', borderRadius: '2px' }}></div>
                  <span style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {capaActivaAuditoria || capaSimulada}
                  </span>
                </div>
              ) : (
                <p className="text-muted" style={{ margin: 0 }}>Seleccione o genere una capa.</p>
              )}
            </div>

            <div style={{ padding: '16px', borderBottom: '1px solid var(--surface-border)' }}>
              <button className="btn-exportar" style={{ width: '100%', justifyContent: 'center' }}>
                <Printer size={16} /> Imprimir Plano
              </button>
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

          <div className="external-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button onClick={() => mapInstance?.zoomIn()} title="Acercar"><Plus size={16} /></button>
            <button onClick={() => mapInstance?.zoomOut()} title="Alejar"><Minus size={16} /></button>
            <button className={isMeasuring ? 'active' : ''} onClick={() => setIsMeasuring(!isMeasuring)} title="Medir distancia"><Ruler size={16} /></button>
          </div>
        </div>

        <MapContainer center={[19.3, -90.5]} zoom={8} minZoom={7} maxBounds={CAMPECHE_BOUNDS} zoomControl={false} style={{ width: '100%', height: '100%', zIndex: 1 }} preferCanvas={true}>
          <MapInstanceCapture setMapInstance={setMapInstance} />
          {renderBaseMap()}
          {(capaActivaAuditoria || dashboardActivo) && (
            <GeoJSON 
              key={capaActivaAuditoria || capaSimulada} 
              data={mockGeoJSONData} 
              pathOptions={{ color: '#F59E0B', weight: 4, fillColor: '#F59E0B', fillOpacity: 0.3 }} 
            />
          )}
          <ScaleControl position="bottomleft" imperial={false} />
          <MeasureTool isMeasuring={isMeasuring} />
        </MapContainer>
      </div>

      {/* CAPA 2: SIDEBAR */}
      <div className="floating-sidebar-wrapper">
        <AdministradorSidebar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen}
          capasEnRevision={capasEnRevision} 
          capasAprobadas={capasAprobadas}
          onSelectCapa={handleSelectCapaAuditoria}
          capaActiva={capaActivaAuditoria}
        />
      </div>

      {/* CAPA 3: CAJÓN DE DICTAMEN (Auditoría de Solicitudes) */}
      <PanelDictamen 
        capa={capaActivaAuditoria}
        isOpen={isDictamenOpen}
        onClose={() => setIsDictamenOpen(false)}
        onDictamen={procesarDictamen}
      />

      {/* CAPA 4: KPIs DERECHA */}
      {dashboardActivo && (
        <div className="floating-right-panel" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <DashboardKPIs capa={capaSimulada} />
        </div>
      )}

      {/* CAPA 5: TABLERO OPERATIVO INFERIOR */}
      <div className="fullwidth-bottom-banner" style={{ left: isSidebarOpen ? '280px' : '0', transition: 'left 0.3s ease' }}>
        <div className="banner-filter-row">
          
          <div className="filter-group">
            <label>Instrumento Normativo</label>
            <select>
              <option value="">Seleccione instrumento...</option>
              {catalogos.cat_instrumento.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}
            </select>
          </div>

          <div className="filter-group">
            <label>Escala Territorial</label>
            <select>
              <option value="">Seleccione escala...</option>
              {catalogos.cat_escala.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}
            </select>
          </div>

          <div className="filter-group">
            <label>Eje de Evaluación</label>
            <select>
              <option value="">Seleccione eje...</option>
              {catalogos.cat_eje_evaluacion.map(item => (<option key={item.id} value={item.id}>{item.etiqueta}</option>))}
            </select>
          </div>

          <div className="filter-group">
            <label>Indicador</label>
            <select>
              <option value="">Seleccione indicador...</option>
              <option>Cobertura de Ciclovías</option>
              <option>Siniestralidad Vial</option>
            </select>
          </div>

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