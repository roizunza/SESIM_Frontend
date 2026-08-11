import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl, useMap } from 'react-leaflet';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapViewer.css';
import { cargarMapaBase } from '../../lib/mapaBase';
import { toPathOptions, toPointLayer } from '../../lib/leafletSymbology';

// Helper component to capture Leaflet map instance
const MapInstanceCapture = ({ setMapInstance }) => {
  const map = useMap();
  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);
  return null;
};

const YEARS = [1980, 2000, 2010, 2016, 2020];
const CAMPECHE_BOUNDS = [
  [13.5, -97.0], // Amplio límite Sudoeste (Chiapas/Oaxaca/Golfo)
  [25.0, -83.0]  // Amplio límite Noreste (Yucatán/Caribe)
];

const MapViewer = () => {
  const [limEst, setLimEst] = useState(null);
  const [limMun, setLimMun] = useState(null);
  const [crecUrb, setCrecUrb] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [activeBaseLayer, setActiveBaseLayer] = useState('claro');
  
  const [showCrecUrb, setShowCrecUrb] = useState(false);
  const [showLocRur, setShowLocRur] = useState(false);
  const [locRur, setLocRur] = useState(null);
  const [showRedVial, setShowRedVial] = useState(false);
  const [redVial, setRedVial] = useState(null);
  const [showViaFerrea, setShowViaFerrea] = useState(false);
  const [viaFerrea, setViaFerrea] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mapa Base del geovisor PEOTDU: 13 capas con la simbología real de QGIS.
  const [mapaBase, setMapaBase] = useState(null);
  const [showMapaBase, setShowMapaBase] = useState(true);

  // Evolution options for Crecimiento Urbano
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

  useEffect(() => {
    // Load local GeoJSON data
    fetch('/Datos/Lim_Est_Base.json')
      .then(res => res.json())
      .then(data => setLimEst(data))
      .catch(err => console.error("Error loading Lim_Est_Base:", err));

    fetch('/Datos/Lim_Mun_Base.json')
      .then(res => res.json())
      .then(data => setLimMun(data))
      .catch(err => console.error("Error loading Lim_Mun_Base:", err));

    fetch('/Datos/Crec_Urb_1980_2020.geojson')
      .then(res => res.json())
      .then(data => setCrecUrb(data))
      .catch(err => console.error("Error loading Crec_Urb_1980_2020:", err));

    fetch('/Datos/Sociedad/Loc_rur.geojson')
      .then(res => res.json())
      .then(data => setLocRur(data))
      .catch(err => console.error("Error loading Loc_rur:", err));

    fetch('/Datos/Infraestructura/Red_vial.geojson')
      .then(res => res.json())
      .then(data => setRedVial(data))
      .catch(err => console.error("Error loading Red_vial:", err));

    fetch('/Datos/Infraestructura/Via_Ferrea.geojson')
      .then(res => res.json())
      .then(data => setViaFerrea(data))
      .catch(err => console.error("Error loading Via_Ferrea:", err));

    cargarMapaBase()
      .then(capas => setMapaBase(capas))
      .catch(err => console.error("Error loading Mapa Base:", err));
  }, []);

  const stateStyle = {
    fillColor: "transparent",
    color: "#0E6EC5", // primary blue
    weight: 2,
    opacity: 1,
    dashArray: '3',
  };

  const munStyle = {
    fillColor: "#0ACFD8", // cyan
    fillOpacity: 0.1,
    color: "#009CD8", // secondary blue
    weight: 1,
    opacity: 0.8
  };

  const startYearStyle = {
    fillColor: "#FF5252", // Red/orange for initial year
    fillOpacity: 0.15,
    color: "#FF5252",
    weight: 2.5,
    dashArray: "3, 5"
  };

  const endYearStyle = {
    fillColor: "#0FCE9A", // Teal/green for final year
    fillOpacity: 0.4,
    color: "#0FCE9A",
    weight: 2
  };

  return (
    <div className="map-container-wrapper">
      {/* Floating custom layers sidebar on the left */}
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
                Mapa Base PEOTDU {mapaBase ? `(${mapaBase.length} capas)` : '(cargando…)'}
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
        {/* Selector de Mapa Base */}
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
                onClick={() => {
                  setActiveBaseLayer('claro');
                  setSelectorOpen(false);
                }}
                className={`capa-base-option ${activeBaseLayer === 'claro' ? 'active' : ''}`}
              >
                Mapa Claro
              </button>
              <button
                onClick={() => {
                  setActiveBaseLayer('satelite');
                  setSelectorOpen(false);
                }}
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
            onClick={() => mapInstance && mapInstance.zoomIn()}
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
            onClick={() => mapInstance && mapInstance.zoomOut()}
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

      <MapContainer 
        center={[19.3, -90.5]} 
        zoom={8} 
        minZoom={7}
        maxBounds={CAMPECHE_BOUNDS}
        maxBoundsViscosity={0.8}
        zoomControl={false}
        className="leaflet-map"
        /* Canvas en vez de SVG: con el Mapa Base completo el mapa montaba
           ~78 000 nodos en el DOM. Los marcadores en divIcon siguen siendo
           DOM; canvas solo afecta a líneas y polígonos. */
        preferCanvas={true}
      >
        <MapInstanceCapture setMapInstance={setMapInstance} />

        {activeBaseLayer === 'satelite' ? (
          <TileLayer
            key="satelite"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        ) : (
          <TileLayer
            key="claro"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
        )}

        {/* Mapa Base PEOTDU: se dibuja debajo de todo lo demás.
            El array viene en orden de árbol de QGIS (la primera va encima), y
            Leaflet pinta encima lo que se monta después, así que se invierte. */}
        {showMapaBase && mapaBase && [...mapaBase].reverse().map((capa) => (
          <GeoJSON
            key={`mb-${capa.id}`}
            data={capa.data}
            /* `capa.simboloDe` es el resolvedor con memoria de esa capa: cachea
               por valor del campo de clasificación. Leaflet lo llama tres veces
               por elemento, así que resolver desde cero aquí costaba ~154 000
               evaluaciones solo en la Red Nacional de Caminos.
               Devuelve null cuando QGIS no dibujaría el elemento; el filter es
               lo que respeta esa decisión en vez de pintarlo. */
            filter={(feature) => capa.simboloDe(feature.properties) !== null}
            style={(feature) => toPathOptions(capa.simboloDe(feature.properties), 1)}
            pointToLayer={(feature, latlng) =>
              toPointLayer(capa.simboloDe(feature.properties), latlng, 1)}
          />
        ))}

        {/* Static/Always-on Overlays */}
        {limEst && (
          <GeoJSON key="limest" data={limEst} style={stateStyle} />
        )}

        {limMun && (
          <GeoJSON key="limmun" data={limMun} style={munStyle} />
        )}

        {/* Conditional Overlays Controlled by Sidebar */}
        {showCrecUrb && crecUrb && (
          <>
            {/* Render Final Year first (in background) */}
            <GeoJSON 
              key={`crecurb-end-${endYear}`} 
              data={crecUrb} 
              filter={(feature) => parseInt(feature.properties.layer) === endYear}
              style={endYearStyle} 
            />
            {/* Render Initial Year second (on top) */}
            <GeoJSON 
              key={`crecurb-start-${startYear}`} 
              data={crecUrb} 
              filter={(feature) => parseInt(feature.properties.layer) === startYear}
              style={startYearStyle} 
            />
          </>
        )}

        {showViaFerrea && viaFerrea && (
          <GeoJSON 
            key="viaferrea" 
            data={viaFerrea} 
            style={(feature) => {
              const via = feature.properties.VIA;
              if (via === 'Tren Maya') {
                return {
                  color: "#00D2C4",
                  weight: 3.5,
                  opacity: 0.95
                };
              } else {
                return {
                  color: "#64748B",
                  weight: 2,
                  dashArray: "5, 5",
                  opacity: 0.85
                };
              }
            }}
            onEachFeature={(feature, layer) => {
              if (feature.properties) {
                const { VIA, SERVICIO, TIPO_VIA } = feature.properties;
                layer.bindPopup(`
                  <div style="font-family: sans-serif; padding: 2px; color: #333;">
                    <strong style="font-size: 14px;">${VIA || 'Vía Férrea'}</strong><br/>
                    <span style="font-size: 12px; color: #666;">Servicio: ${SERVICIO || 'N/D'}</span><br/>
                    <span style="font-size: 12px; color: #666;">Tipo: ${TIPO_VIA || 'N/D'}</span>
                  </div>
                `);
              }
            }}
          />
        )}

        {showRedVial && redVial && (
          <GeoJSON 
            key="redvial" 
            data={redVial} 
            style={(feature) => {
              const tipo = feature.properties.TIPO_VIAL;
              if (tipo === 'Carretera' || tipo === 'Boulevard') {
                return { color: "#C00000", weight: 2.2, opacity: 0.9 };
              } else if (tipo === 'Avenida' || tipo === 'Circuito' || tipo === 'Prolongación') {
                return { color: "#F97316", weight: 1.6, opacity: 0.85 };
              } else if (tipo === 'Calle' || tipo === 'Privada' || tipo === 'Cerrada' || tipo === 'Callejón' || tipo === 'Diagonal') {
                return { color: "#78350F", weight: 1.0, opacity: 0.75 };
              } else if (tipo === 'Camino' || tipo === 'Vereda' || tipo === 'Andador') {
                return { color: "#A16207", weight: 1.4, opacity: 0.85 };
              }
              return { color: "#64748B", weight: 1.0, opacity: 0.75 }; // Otro
            }}
            onEachFeature={(feature, layer) => {
              if (feature.properties) {
                const name = feature.properties.NOM_VIAL || feature.properties.nombre || 'Carretera';
                layer.bindPopup(`
                  <div style="font-family: sans-serif; padding: 2px; color: #333;">
                    <strong style="font-size: 14px;">${name}</strong><br/>
                    <span style="font-size: 12px; color: #666;">Red Vial Nacional</span>
                  </div>
                `);
              }
            }}
          />
        )}

        {showLocRur && locRur && (
          <GeoJSON 
            key="locrur" 
            data={locRur} 
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 4,
                fillColor: "#FFB300", // Gold/Amber circle
                color: "#FFFFFF",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.9
              });
            }}
            onEachFeature={(feature, layer) => {
              if (feature.properties) {
                const { NOMGEO, NOM_MUN, POB1 } = feature.properties;
                layer.bindPopup(`
                  <div style="font-family: sans-serif; padding: 2px; color: #333;">
                    <strong style="font-size: 14px;">${NOMGEO}</strong><br/>
                    <span style="font-size: 12px; color: #666;">Municipio: ${NOM_MUN}</span><br/>
                    <span style="font-size: 12px; color: #666;">Población: ${POB1 !== undefined && POB1 >= 0 ? POB1 : 'N/D'}</span>
                  </div>
                `);
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapViewer;
