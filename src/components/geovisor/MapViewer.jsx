import React, { useState, useRef, useEffect } from 'react';
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import '@arcgis/core/assets/esri/themes/light/main.css';
import './MapViewer.css';
import { cargarMapaBase } from '../../lib/mapaBase';

const YEARS = [1980, 2000, 2010, 2016, 2020];

const MapViewer = () => {
  const mapDiv = useRef(null);
  const layersRef = useRef({});
  const [viewInstance, setViewInstance] = useState(null);
  
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeBaseLayer, setActiveBaseLayer] = useState('claro');
  
  const [showCrecUrb, setShowCrecUrb] = useState(false);
  const [showLocRur, setShowLocRur] = useState(false);
  const [showRedVial, setShowRedVial] = useState(false);
  const [showViaFerrea, setShowViaFerrea] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mapa Base del geovisor PEOTDU
  const [mapaBaseData, setMapaBaseData] = useState([]);
  const [showMapaBase, setShowMapaBase] = useState(true);

  // Opciones de Evolución (Crecimiento Urbano)
  const [startYear, setStartYear] = useState(1980);
  const [endYear, setEndYear] = useState(2020);

  const handleYearClick = (year) => {
    const idx = YEARS.indexOf(year);
    const startIdx = YEARS.indexOf(startYear);
    const endIdx = YEARS.indexOf(endYear);
    
    if (idx === startIdx || idx === endIdx) return;
    
    const distStart = Math.abs(idx - startIdx);
    const distEnd = Math.abs(idx - endIdx);
    
    if (distStart < distEnd) {
      setStartYear(year);
    } else {
      setEndYear(year);
    }
  };

  const handleDownloadActiveLayers = () => {
    try {
      const activeLayersList = [];
      if (showCrecUrb) activeLayersList.push('crecimiento_urbano');
      if (showLocRur) activeLayersList.push('localidades_rurales');
      if (showRedVial) activeLayersList.push('red_vial');
      if (showViaFerrea) activeLayersList.push('via_ferrea');

      const mockContent = new Uint8Array([0x47, 0x50, 0x4b, 0x47]);
      const blob = new Blob([mockContent], { type: 'application/geopackage+sqlite3' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const layersString = activeLayersList.length > 0 ? activeLayersList.join('_') : 'capas_campeche';
      a.download = `capas_${layersString}.gpkg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar capas:", error);
    }
  };

  /* Inicialización Segura del Mapa ArcGIS (Con candado antierrores) */
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
        ui: { components: [] } // Candado de UI
      });

      // 1. Límites Base
      const limEstLayer = new GeoJSONLayer({
        url: "/Datos/Lim_Est_Base.json",
        renderer: { type: "simple", symbol: { type: "simple-fill", color: [0,0,0,0], outline: { color: "#0E6EC5", width: 2, style: "dash" } } }
      });

      const limMunLayer = new GeoJSONLayer({
        url: "/Datos/Lim_Mun_Base.json",
        renderer: { type: "simple", symbol: { type: "simple-fill", color: [10, 207, 216, 0.1], outline: { color: "#009CD8", width: 1 } } }
      });

      // 2. Crecimiento Urbano (Renderizado dinámico por atributo "layer")
      const crecUrbEndLayer = new GeoJSONLayer({
        url: "/Datos/Crec_Urb_1980_2020.geojson",
        visible: false,
        renderer: { type: "simple", symbol: { type: "simple-fill", color: [15, 206, 154, 0.4], outline: { color: "#0FCE9A", width: 2 } } }
      });

      const crecUrbStartLayer = new GeoJSONLayer({
        url: "/Datos/Crec_Urb_1980_2020.geojson",
        visible: false,
        renderer: { type: "simple", symbol: { type: "simple-fill", color: [255, 82, 82, 0.15], outline: { color: "#FF5252", width: 2.5, style: "dash" } } }
      });

      // 3. Vía Férrea (Simbología condicional)
      const viaFerreaLayer = new GeoJSONLayer({
        url: "/Datos/Infraestructura/Via_Ferrea.geojson",
        visible: false,
        popupTemplate: { title: "{VIA}", content: "Servicio: {SERVICIO}<br/>Tipo: {TIPO_VIA}" },
        renderer: {
          type: "unique-value",
          field: "VIA",
          defaultSymbol: { type: "simple-line", color: "#64748B", width: 2, style: "dash" },
          uniqueValueInfos: [
            { value: "Tren Maya", symbol: { type: "simple-line", color: "#00D2C4", width: 3.5 } }
          ]
        }
      });

      // 4. Red Vial Nacional (Simbología condicional)
      const redVialLayer = new GeoJSONLayer({
        url: "/Datos/Infraestructura/Red_vial.geojson",
        visible: false,
        popupTemplate: { title: "{NOM_VIAL}", content: "Red Vial Nacional" },
        renderer: {
          type: "unique-value",
          field: "TIPO_VIAL",
          defaultSymbol: { type: "simple-line", color: "#64748B", width: 1.0 },
          uniqueValueInfos: [
            { value: "Carretera", symbol: { type: "simple-line", color: "#C00000", width: 2.2 } },
            { value: "Boulevard", symbol: { type: "simple-line", color: "#C00000", width: 2.2 } },
            { value: "Avenida", symbol: { type: "simple-line", color: "#F97316", width: 1.6 } },
            { value: "Circuito", symbol: { type: "simple-line", color: "#F97316", width: 1.6 } },
            { value: "Prolongación", symbol: { type: "simple-line", color: "#F97316", width: 1.6 } },
            { value: "Calle", symbol: { type: "simple-line", color: "#78350F", width: 1.0 } },
            { value: "Camino", symbol: { type: "simple-line", color: "#A16207", width: 1.4 } }
          ]
        }
      });

      // 5. Localidades Rurales
      const locRurLayer = new GeoJSONLayer({
        url: "/Datos/Sociedad/Loc_rur.geojson",
        visible: false,
        popupTemplate: { title: "{NOMGEO}", content: "Municipio: {NOM_MUN}<br/>Población: {POB1}" },
        renderer: { type: "simple", symbol: { type: "simple-marker", color: "#FFB300", size: 6, outline: { color: "#FFFFFF", width: 1 } } }
      });

      const baseGroup = new GroupLayer({ visible: true });

      // Agregamos todo al mapa
      map.addMany([baseGroup, limEstLayer, limMunLayer, crecUrbEndLayer, crecUrbStartLayer, viaFerreaLayer, redVialLayer, locRurLayer]);

      // Guardamos las referencias para prenderlas/apagarlas luego
      layersRef.current = { crecUrbEndLayer, crecUrbStartLayer, viaFerreaLayer, redVialLayer, locRurLayer, baseGroup };

      view.when(() => {
        if (!isMounted) { view.destroy(); return; }
        setViewInstance(view);
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

  /* Carga del Mapa Base Dinámico de QGIS */
  useEffect(() => {
    cargarMapaBase().then(capas => {
      setMapaBaseData(capas);
      if (layersRef.current.baseGroup) {
        layersRef.current.baseGroup.removeAll();
        // Invertimos para respetar el orden visual original de Leaflet
        [...capas].reverse().forEach(capa => {
          // Convertimos la memoria JSON en una URL virtual para que ArcGIS la consuma velozmente
          const blob = new Blob([JSON.stringify(capa.data)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const geoLayer = new GeoJSONLayer({
            url: url,
            title: capa.id,
            opacity: 0.8,
            renderer: { type: "simple", symbol: { type: "simple-fill", color: [100, 116, 139, 0.2], outline: { color: [100, 116, 139, 0.8], width: 1 } } }
          });
          layersRef.current.baseGroup.add(geoLayer);
        });
      }
    }).catch(err => console.error("Error loading Mapa Base:", err));
  }, []);

  /* Controladores de Visibilidad */
  useEffect(() => {
    if (layersRef.current.crecUrbStartLayer) {
      layersRef.current.crecUrbStartLayer.visible = showCrecUrb;
      layersRef.current.crecUrbEndLayer.visible = showCrecUrb;
      layersRef.current.crecUrbStartLayer.definitionExpression = `layer = ${startYear}`;
      layersRef.current.crecUrbEndLayer.definitionExpression = `layer = ${endYear}`;
    }
  }, [showCrecUrb, startYear, endYear]);

  useEffect(() => {
    if (layersRef.current.viaFerreaLayer) layersRef.current.viaFerreaLayer.visible = showViaFerrea;
  }, [showViaFerrea]);

  useEffect(() => {
    if (layersRef.current.redVialLayer) layersRef.current.redVialLayer.visible = showRedVial;
  }, [showRedVial]);

  useEffect(() => {
    if (layersRef.current.locRurLayer) layersRef.current.locRurLayer.visible = showLocRur;
  }, [showLocRur]);

  useEffect(() => {
    if (layersRef.current.baseGroup) layersRef.current.baseGroup.visible = showMapaBase;
  }, [showMapaBase]);

  /* Cambio de Capa Base de Fondo */
  useEffect(() => {
    if (viewInstance) {
      viewInstance.map.basemap = activeBaseLayer === 'claro' ? 'gray-vector' : 'satellite';
    }
  }, [activeBaseLayer, viewInstance]);

  return (
    <div className="map-container-wrapper">
      {/* Barra lateral flotante de controles */}
      <div className={`map-sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? "Contraer panel" : "Expandir panel"}
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        <div className="sidebar-header">
          <Layers size={20} className="header-icon" />
          <h3>Control de Capas</h3>
        </div>

        <div className="sidebar-section">
          <div className="section-title">
            <Layers size={14} />
            <span>Mapa Base</span>
          </div>
          <div className="overlay-options">
            <label className="switch-container">
              <input
                type="checkbox"
                checked={showMapaBase}
                onChange={(e) => setShowMapaBase(e.target.checked)}
              />
              <span className="switch-slider"></span>
              <span className="switch-label">
                Mapa Base PEOTDU {mapaBaseData.length > 0 ? `(${mapaBaseData.length} capas)` : '(cargando…)'}
              </span>
            </label>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="section-title">
            <Layers size={14} />
            <span>Capas Temáticas</span>
          </div>
          <div className="overlay-options">
            <label className="switch-container">
              <input
                type="checkbox"
                checked={showCrecUrb}
                onChange={(e) => setShowCrecUrb(e.target.checked)}
              />
              <span className="switch-slider"></span>
              <span className="switch-label">Crecimiento Urbano (1980-2020)</span>
            </label>
            
            {showCrecUrb && (
              <div className="evolution-panel">
                <div className="timeline-container">
                  <div className="timeline-track">
                    <div 
                      className="timeline-highlight" 
                      style={{ 
                        left: `${YEARS.indexOf(startYear) * 25}%`, 
                        width: `${(YEARS.indexOf(endYear) - YEARS.indexOf(startYear)) * 25}%` 
                      }}
                    ></div>
                  </div>
                  <div className="timeline-ticks">
                    {YEARS.map((year, idx) => {
                      const isStart = year === startYear;
                      const isEnd = year === endYear;
                      const isInRange = year >= startYear && year <= endYear;
                      
                      let tickClass = "";
                      if (isStart) tickClass = "tick-start";
                      else if (isEnd) tickClass = "tick-end";
                      else if (isInRange) tickClass = "tick-in-range";

                      return (
                        <div 
                          key={year} 
                          className={`timeline-tick-wrapper ${tickClass}`}
                          style={{ left: `${idx * 25}%` }}
                          onClick={() => handleYearClick(year)}
                        >
                          <div className="timeline-tick-dot"></div>
                          <span className="timeline-tick-label">{year}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="evolution-range-display">
                  <span className="year-badge start">{startYear}</span>
                  <span className="arrow">➔</span>
                  <span className="year-badge end">{endYear}</span>
                </div>
              </div>
            )}
            
            <label className="switch-container" style={{ marginTop: 'var(--spacing-md)' }}>
              <input 
                type="checkbox" 
                checked={showLocRur} 
                onChange={(e) => setShowLocRur(e.target.checked)} 
              />
              <span className="switch-slider"></span>
              <span className="switch-label">Localidades Rurales</span>
            </label>

            <label className="switch-container" style={{ marginTop: 'var(--spacing-md)' }}>
              <input 
                type="checkbox" 
                checked={showRedVial} 
                onChange={(e) => setShowRedVial(e.target.checked)} 
              />
              <span className="switch-slider"></span>
              <span className="switch-label">Red Vial Nacional</span>
            </label>
            
            {showRedVial && (
              <div className="layer-legend">
                <div className="legend-item">
                  <span className="legend-line" style={{ backgroundColor: '#C00000', height: '3px' }}></span>
                  <span className="legend-text">Carretera</span>
                </div>
                <div className="legend-item">
                  <span className="legend-line" style={{ backgroundColor: '#F97316', height: '2px' }}></span>
                  <span className="legend-text">Avenida</span>
                </div>
                <div className="legend-item">
                  <span className="legend-line" style={{ backgroundColor: '#78350F', height: '1.5px' }}></span>
                  <span className="legend-text">Calle</span>
                </div>
                <div className="legend-item">
                  <span className="legend-line" style={{ backgroundColor: '#A16207', height: '2px' }}></span>
                  <span className="legend-text">Camino</span>
                </div>
                <div className="legend-item">
                  <span className="legend-line" style={{ backgroundColor: '#64748B', height: '1.5px' }}></span>
                  <span className="legend-text">Otro</span>
                </div>
              </div>
            )}

            <label className="switch-container" style={{ marginTop: 'var(--spacing-md)' }}>
              <input 
                type="checkbox" 
                checked={showViaFerrea} 
                onChange={(e) => setShowViaFerrea(e.target.checked)} 
              />
              <span className="switch-slider"></span>
              <span className="switch-label">Vía Férrea</span>
            </label>
            
            {showViaFerrea && (
              <div className="layer-legend">
                <div className="legend-item">
                  <span className="legend-line" style={{ backgroundColor: '#00D2C4', height: '3px' }}></span>
                  <span className="legend-text">Tren Maya</span>
                </div>
                <div className="legend-item">
                  <div className="legend-line-dashed"></div>
                  <span className="legend-text">Vía Corta Mayab</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controles flotantes en la esquina superior derecha */}
      <div className="map-custom-controls">
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="map-ctrl-btn"
            aria-label="Cambiar mapa base"
            title="Mapa base"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </button>

          {selectorOpen && (
            <div className="capa-base-popover">
              <h5>CAPA BASE</h5>
              <button
                onClick={() => { setActiveBaseLayer('claro'); setSelectorOpen(false); }}
                className={`capa-base-option ${activeBaseLayer === 'claro' ? 'active' : ''}`}
              >
                Mapa Claro
              </button>
              <button
                onClick={() => { setActiveBaseLayer('satelite'); setSelectorOpen(false); }}
                className={`capa-base-option ${activeBaseLayer === 'satelite' ? 'active' : ''}`}
              >
                Vista Satelital
              </button>
            </div>
          )}
        </div>

        {/* Botones de Zoom y Descarga */}
        <div className="map-ctrl-stack">
          <button
            onClick={() => viewInstance && viewInstance.goTo({ zoom: viewInstance.zoom + 1 })}
            className="map-ctrl-btn"
            aria-label="Acercar"
            title="Zoom in"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={() => viewInstance && viewInstance.goTo({ zoom: viewInstance.zoom - 1 })}
            className="map-ctrl-btn"
            aria-label="Alejar"
            title="Zoom out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            onClick={handleDownloadActiveLayers}
            className="map-ctrl-btn"
            aria-label="Descargar capas activas (.gpkg)"
            title="Descargar capas activas"
          >
            <svg width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
              <path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM256 362.7c-7.5 0-14.7-3-20-8.3L129.3 247.7c-11-11-11-29 0-40s29-11 40 0l58.7 58.7V117.3c0-15.6 12.7-28.3 28.3-28.3s28.3 12.7 28.3 28.3v149.1l58.7-58.7c11-11 29-11 40 0s11 29 0 40L276 354.3C270.7 359.7 263.5 362.7 256 362.7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contenedor del Mapa ArcGIS */}
      <div ref={mapDiv} style={{ width: '100%', height: '100%', zIndex: 1, outline: 'none' }} className="leaflet-map" />
      
    </div>
  );
};

export default MapViewer;