import React, { useEffect } from 'react';
import { MapContainer, TileLayer, ScaleControl, GeoJSON, useMap } from 'react-leaflet';

/* Helper para mover la cámara automáticamente al cargar una capa */
const MapFlyTo = ({ capaActiva }) => {
  const map = useMap();
  useEffect(() => {
    if (capaActiva) {
      map.flyTo([19.83, -90.54], 14, { duration: 1.5 });
    } else {
      map.flyTo([19.3, -90.5], 8, { duration: 1.5 });
    }
  }, [capaActiva, map]);
  return null;
};

const CAMPECHE_BOUNDS = [[13.5, -97.0], [25.0, -83.0]];

const AdminMap = ({ capaActiva, datosGeoJSON }) => {
  return (
    <MapContainer 
      center={[19.3, -90.5]} 
      zoom={8} 
      minZoom={7} 
      maxBounds={CAMPECHE_BOUNDS} 
      zoomControl={false} 
      className="admin-leaflet-map" 
      preferCanvas={true}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      
      <MapFlyTo capaActiva={capaActiva} />

      {/* Dibuja la geometría de la capa seleccionada en color ámbar de revisión */}
      {capaActiva && datosGeoJSON && (
        <GeoJSON 
          key={capaActiva} 
          data={datosGeoJSON} 
          pathOptions={{ 
            color: '#F59E0B', 
            weight: 4,
            fillColor: '#F59E0B',
            fillOpacity: 0.3
          }} 
        />
      )}
      
      <ScaleControl position="bottomleft" imperial={false} />
    </MapContainer>
  );
};

export default AdminMap;