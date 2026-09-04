import React, { useState, useRef, useEffect } from 'react';
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import DistanceMeasurement2D from "@arcgis/core/widgets/DistanceMeasurement2D";
import { Map as MapIcon, List, Plus, Minus, Ruler, ChevronDown, ChevronUp } from 'lucide-react';
import CapturistaSidebar from './CapturistaSidebar';
import CapturistaModal from './CapturistaModal';
import '@arcgis/core/assets/esri/themes/light/main.css';
import '../../geovisor/AdminMapViewer.css';
import '../administradora/Admin.css';

const CapturistaLayout = () => {
  const mapDiv = useRef(null);
  const measureWidgetRef = useRef(null);
  const [viewInstance, setViewInstance] = useState(null);
  const [graphicsLayer, setGraphicsLayer] = useState(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [nombreCapaActiva, setNombreCapaActiva] = useState('');
  
  const [capasEnBorradores, setCapasEnBorradores] = useState([]);
  const [capasEnRevision, setCapasEnRevision] = useState(['pimus_municipio_carmen']);
  const [actionLog, setActionLog] = useState('');
  
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
        ui: { components: [] } // <-- ¡AQUÍ ESTÁ LA CORRECCIÓN! Déjalo completamente vacío.
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

  /* Renderizado del polígono de previsualización */
  useEffect(() => {
    if (graphicsLayer && isVerifying) {
      graphicsLayer.removeAll();
      
      const polygon = new Polygon({
        rings: [[[-90.58, 19.82], [-90.48, 19.82], [-90.48, 19.88], [-90.58, 19.88], [-90.58, 19.82]]]
      });

      const fillSymbol = {
        type: "simple-fill",
        color: [159, 34, 65, 0.4], // Guinda
        outline: { color: [159, 34, 65, 1], width: 2 }
      };

      graphicsLayer.add(new Graphic({ geometry: polygon, symbol: fillSymbol }));
    } else if (graphicsLayer) {
      graphicsLayer.removeAll();
    }
  }, [isVerifying, graphicsLayer]);

  const handleVerifyLayer = (nombreArchivo) => {
    setNombreCapaActiva(nombreArchivo);
    setCapasEnBorradores(prev => [nombreArchivo, ...prev]);
    setActionLog(`Carga inicial: Archivos físicos y PDF técnico de "${nombreArchivo}" retenidos en memoria local.`);
    setIsModalOpen(false);
    setIsVerifying(true);
    if (viewInstance) viewInstance.goTo({ center: [-90.53, 19.85], zoom: 12 }, { duration: 1500 });
  };

  const handleFinalSubmit = () => {
    if (nombreCapaActiva) {
      setCapasEnBorradores(prev => prev.filter(capa => capa !== nombreCapaActiva));
      setCapasEnRevision(prev => [nombreCapaActiva, ...prev]);
      setActionLog(`Confirmación EPSG y visualización: "${nombreCapaActiva}" enviada a revisión institucional.`);
    }
    setIsVerifying(false);
    setNombreCapaActiva('');
    if (viewInstance) viewInstance.goTo({ center: [-90.5, 19.3], zoom: 8 }, { duration: 1500 });
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

            <div className="panel-content" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h5 className="panel-section-title">Simbología Activa</h5>
              {isVerifying ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                    <div style={{ width: '16px', height: '16px', backgroundColor: 'rgba(159, 34, 65, 0.4)', border: '2px solid var(--c-guinda)', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={nombreCapaActiva}>
                      {nombreCapaActiva}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', paddingLeft: '24px' }}>Capa Vectorial (EPSG:4326)</span>
                </div>
              ) : (
                <p className="text-muted" style={{ margin: 0 }}>No hay capas cargadas en previsualización.</p>
              )}
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
        <CapturistaSidebar 
          isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}
          onOpenModal={() => setIsModalOpen(true)} isVerifying={isVerifying} onFinalSubmit={handleFinalSubmit}
          capasEnBorradores={capasEnBorradores} capasEnRevision={capasEnRevision} actionLog={actionLog}
        />
      </div>
      
      <CapturistaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onVerify={handleVerifyLayer} />

    </div>
  );
};

export default CapturistaLayout;