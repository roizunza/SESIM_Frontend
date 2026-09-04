import React, { useState, useRef, useEffect } from 'react';
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import AuditorSidebar from './AuditorSidebar';
import { Download, UploadCloud, XCircle, CheckCircle, List, Map as MapIcon, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import '@arcgis/core/assets/esri/themes/light/main.css';
import '../../geovisor/AdminMapViewer.css';
import '../capturista/Capturista.css'; 
import '../administradora/Admin.css';
import './Auditor.css';

const AuditorLayout = () => {
  const mapDiv = useRef(null);
  const [viewInstance, setViewInstance] = useState(null);
  const [graphicsLayer, setGraphicsLayer] = useState(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [capaActivaAuditoria, setCapaActivaAuditoria] = useState('');

  const [mapaBaseOpen, setMapaBaseOpen] = useState(false);
  const [activeBaseMap, setActiveBaseMap] = useState('gray-vector');

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
    
    return () => { 
      window.removeEventListener('mousemove', handleMouseMove); 
      window.removeEventListener('mouseup', handleMouseUp); 
    };
  }, [isDragging]);

  /* Inicializacion segura del mapa de ArcGIS con bandera de montaje */
  useEffect(() => {
    let view;
    let isMounted = true;

    if (mapDiv.current) {
      const map = new Map({
        basemap: "gray-vector" 
      });

      view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [-90.5, 19.3], 
        zoom: 8,
        ui: { components: [] } 
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

  /* Actualizacion de Mapa Base */
  useEffect(() => {
    if (viewInstance && activeBaseMap) {
      viewInstance.map.basemap = activeBaseMap;
    }
  }, [activeBaseMap, viewInstance]);

  /* Vuelo a la capa activa */
  useEffect(() => {
    if (viewInstance && capaActivaAuditoria) {
      viewInstance.goTo({
        center: [-90.54, 19.83],
        zoom: 11
      }, { duration: 1500 });
    }
  }, [capaActivaAuditoria, viewInstance]);

  /* Renderizado del poligono temporal */
  useEffect(() => {
    if (graphicsLayer && capaActivaAuditoria) {
      graphicsLayer.removeAll();
      
      const polygon = new Polygon({
        rings: [[[-90.58, 19.82], [-90.48, 19.82], [-90.48, 19.88], [-90.58, 19.88], [-90.58, 19.82]]]
      });

      const fillSymbol = {
        type: "simple-fill",
        color: [107, 114, 128, 0.2],
        outline: {
          color: [107, 114, 128, 1],
          width: 2
        }
      };

      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: fillSymbol
      });

      graphicsLayer.add(polygonGraphic);
    } else if (graphicsLayer) {
      graphicsLayer.removeAll();
    }
  }, [capaActivaAuditoria, graphicsLayer]);

  const handleSelectCapa = (nombreCapa) => {
    setCapaActivaAuditoria(nombreCapa);
  };

  const zoomIn = () => {
    if (viewInstance) viewInstance.goTo({ zoom: viewInstance.zoom + 1 });
  };

  const zoomOut = () => {
    if (viewInstance) viewInstance.goTo({ zoom: viewInstance.zoom - 1 });
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

          {/* Botones de zoom */}
          <div className="external-toolbar" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button onClick={zoomIn} title="Acercar"><Plus size={16} /></button>
            <button onClick={zoomOut} title="Alejar"><Minus size={16} /></button>
          </div>
        </div>

        {/* CONTENEDOR DEL MAPA */}
        <div ref={mapDiv} style={{ width: '100%', height: '100%', zIndex: 1, outline: 'none' }} />
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

      {/* CAPA 3: PANEL DE TRAZABILIDAD */}
      {capaActivaAuditoria && (
        <div className="floating-right-panel" style={{ width: '400px', height: 'calc(100% - 48px)', bottom: '24px' }}>
          
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="panel-section-title" style={{ margin: 0 }}>LOG DE ACTIVIDAD</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '15px', color: 'var(--text-primary)' }}>{capaActivaAuditoria}</h3>
            </div>
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