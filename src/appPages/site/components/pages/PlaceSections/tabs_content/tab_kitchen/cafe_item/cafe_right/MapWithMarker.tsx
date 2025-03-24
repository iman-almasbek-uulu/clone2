import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '138px',
};

const defaultCenter = {
  lat: 42.8746, // Широта по умолчанию (например, Бишкек)
  lng: 74.5698, // Долгота по умолчанию (например, Бишкек)
};

interface MapWithMarkerProps {
  latitude: number | null;
  longitude: number | null;
}

const MapWithMarker: React.FC<MapWithMarkerProps> = ({ latitude, longitude }) => {



  const markerPosition = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={markerPosition ? 15 : 10} // Увеличиваем зум, если есть маркер
      center={markerPosition || defaultCenter}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
};

export default MapWithMarker;