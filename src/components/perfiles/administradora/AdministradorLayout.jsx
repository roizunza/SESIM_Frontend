import React, { useState, useRef, useEffect } from 'react';
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import DistanceMeasurement2D from "@arcgis/core/widgets/DistanceMeasurement2D";
import AdministradorSidebar from './AdministradorSidebar';
import DashboardKPIs from './DashboardKPIs';
import PanelDictamen from './PanelDictamen';
import { Download, Table, Play, Map as MapIcon, List, Plus, Minus, Ruler, ChevronDown, ChevronUp, Printer } from 'lucide-react';
import '@arcgis/core/assets/esri/themes/light/main.css';
import '../../geovisor/AdminMapViewer.css';
import '../capturista/Capturista.css'; 
import './Admin.css';

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

const CAMPECHE_BOUNDS = [[13.5, -97.0], [25.0, -83.0]];

const AdministradorLayout = () => {
  const mapDiv = useRef(null);
  const measureWidgetRef = useRef(null);
  const [viewInstance, setViewInstance] = useState(null);
  const [graphicsLayer, setGraphicsLayer] = useState(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardActivo, setDashboardActivo] = useState(false);
  const [isDictamenOpen, setIsDictamenOpen] = useState(false);
  
  const [capaSimulada, setCapaSimulada] = useState('');
  const [capaActivaAuditoria, setCapaActivaAuditoria] = useState('');
  const [capasEnRevision, setCapasEnRevision] = useState(['red_ciclovias_v2', 'censo_paraderos_2026']);
  const [capasAprobadas, setCapasAprobadas] = useState(['red_vial_primaria']);

  const [mapaBaseOpen, setMapaBaseOpen] = useState(false);
  const [activeBaseMap, setActiveBaseMap] = useState('gray-vector');
  const [isMeasuring, setIsMeasuring] = useState(false);

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

  /* Inicialización Segura del Mapa ArcGIS */
  useEffect(() => {
    let view;
    let isMounted = true;

    if (mapDiv.current) {
      const map = new Map({ basemap: "gray-vector" });

      view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [-90.5, 19.3], 
        zoom: 8,
        ui: { components: [] } // <-- Igual, vacío.
      });

      const gLayer = new GraphicsLayer();
      map.add(gLayer);

      view.when(() => {
        if (!isMounted) {
          view.destroy();
          return;
        }
        setViewInstance(view);
        setGraphicsLayer(gLayer);
      });
    }

    return () => {
      isMounted = false;
      if (view) {
        view.container = null; 
        view.destroy();
      }
    };
  }, []);

  /* Actualizar Mapa Base */
  useEffect(() => {
    if (viewInstance && activeBaseMap) {
      viewInstance.map.basemap = activeBaseMap;
    }
  }, [activeBaseMap, viewInstance]);

  /* Control de la herramienta de Medición de Esri */
  useEffect(() => {
    if (!viewInstance) return;

    if (isMeasuring) {
      const measurement = new DistanceMeasurement2D({ view: viewInstance });
      measurement.viewModel.start();
      viewInstance.ui.add(measurement, "bottom-right");
      measureWidgetRef.current = measurement;
    } else {
      if (measureWidgetRef.current) {
        viewInstance.ui.remove(measureWidgetRef.current);
        measureWidgetRef.current.destroy();
        measureWidgetRef.current = null;
      }
    }
  }, [isMeasuring, viewInstance]);

  /* Renderizado de Capas Geométricas */
  useEffect(() => {
    if (graphicsLayer && (capaActivaAuditoria || capaSimulada)) {
      graphicsLayer.removeAll();
      
      const polygon = new Polygon({
        rings: [[[-90.58, 19.82], [-90.48, 19.82], [-90.48, 19.88], [-90.58, 19.88], [-90.58, 19.82]]]
      });

      const fillSymbol = {
        type: "simple-fill",
        color: [245, 158, 11, 0.3], // Naranja/Ambar
        outline: { color: [245, 158, 11, 1], width: 4 }
      };

      graphicsLayer.add(new Graphic({ geometry: polygon, symbol: fillSymbol }));
    } else if (graphicsLayer) {
      graphicsLayer.removeAll();
    }
  }, [capaActivaAuditoria, capaSimulada, graphicsLayer]);

  const handleGenerarTablero = () => {
    setCapaSimulada('Red de Movilidad Estatal');
    setDashboardActivo(true);
  };

  const handleSelectCapaAuditoria = (nombreCapa) => {
    setCapaActivaAuditoria(nombreCapa);
    setIsDictamenOpen(true);
    if (viewInstance) viewInstance.goTo({ center: [-90.53, 19.85], zoom: 12 }, { duration: 1500 });
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

  const zoomIn = () => { if (viewInstance) viewInstance.goTo({ zoom: viewInstance.zoom + 1 }); };
  const zoomOut = () => { if (viewInstance) viewInstance.goTo({ zoom: viewInstance.zoom - 1 }); };

  return (
    <div className="dashboard-fullscreen-container">
      
      <div className={`dashboard-map-area ${isMeasuring ? 'measuring-mode' : ''}`}>
        
        <div className="draggable-wrapper" style={{ left: `${herramientasPos.x}px`, top: `${herramientasPos.y}px`, position: 'absolute', zIndex: 1000, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '8px' }}>
          
          <div className="floating-panel" style={{ position: 'relative', top: 'auto', left: 'auto', width: '280px', margin: 0 }}>
            <div className="panel-header drag-handle" onMouseDown={handleMouseDown}>
              <List size={18} /><h4>Herramientas del Mapa</h4>
            </div>

            <div className="panel-content" style={{ borderBottom: '1px solid var(--surface-border)' }}>
              <h5 className="panel-section-title">Simbología Activa</h5>
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
              <button className="btn-base btn-tertiary">
                <Printer size={16} /> Imprimir Plano
              </button>
            </div>

            <div className="accordion-section">
              <button className="accordion-header" onClick={() => setMapaBaseOpen(!mapaBaseOpen)}>
                <div className="header-title"><MapIcon size={16} /><span>Mapa Base</span></div>
                {mapaBaseOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div className={`accordion-content ${mapaBaseOpen ? 'open' : ''}`}>
                <div className="base-map-grid" style={{ marginTop: '8px' }}>
                  <button className={`base-map-btn ${activeBaseMap === 'gray-vector' ? 'active' : ''}`} onClick={() => setActiveBaseMap('gray-vector')}>Carto Light</button>
                  <button className={`base-map-btn ${activeBaseMap === 'dark-gray-vector' ? 'active' : ''}`} onClick={() => setActiveBaseMap('dark-gray-vector')}>Carto Dark</button>
                  <button className={`base-map-btn ${activeBaseMap === 'terrain' ? 'active' : ''}`} onClick={() => setActiveBaseMap('terrain')}>Google Terrain</button>
                  <button className={`base-map-btn ${activeBaseMap === 'satellite' ? 'active' : ''}`} onClick={() => setActiveBaseMap('satellite')}>Google Sat</button>
                </div>
              </div>
            </div>
          </div>

          <div className="external-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button onClick={zoomIn} title="Acercar"><Plus size={16} /></button>
            <button onClick={zoomOut} title="Alejar"><Minus size={16} /></button>
            <button className={isMeasuring ? 'active' : ''} onClick={() => setIsMeasuring(!isMeasuring)} title="Medir distancia"><Ruler size={16} /></button>
          </div>
        </div>

        <div ref={mapDiv} style={{ width: '100%', height: '100%', zIndex: 1, outline: 'none' }} />
      </div>

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

      <PanelDictamen 
        capa={capaActivaAuditoria}
        isOpen={isDictamenOpen}
        onClose={() => setIsDictamenOpen(false)}
        onDictamen={procesarDictamen}
      />

      {dashboardActivo && (
        <div className="floating-right-panel" style={{ background: 'transparent', border: 'none', backdropFilter: 'none', boxShadow: 'none' }}>
          <DashboardKPIs capa={capaSimulada} />
        </div>
      )}

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
            <button className="btn-base btn-primary" onClick={handleGenerarTablero}>
              <Play size={16} fill="currentColor" /> Generar
            </button>
            <button className="btn-base btn-secondary">
              <Table size={16} /> Ver tabla de atributos
            </button>
            <button className="btn-base btn-tertiary">
              <Download size={16} /> Exportar
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdministradorLayout;