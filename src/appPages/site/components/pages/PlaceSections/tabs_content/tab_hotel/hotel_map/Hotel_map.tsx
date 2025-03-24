import React, { FC } from "react";
import scss from "./Hotel_map.module.scss";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface Hotel_mapProps {
  lat: number | null;
  lon: number | null;
}

// Объявление стилей для карты
const mapContainerStyle = {
  width: '100%',
  height: 'clamp(126px, 30vw, 300px)',  // Адаптивная высота
  borderRadius: '8px',
  marginBottom: 'clamp(20px, 5vw, 60px)'
};

// Центр карты по умолчанию (Кыргызстан)
const defaultCenter = {
  lat: 41.2044,
  lng: 74.7661
};

const Hotel_map: FC<Hotel_mapProps> = ({
  lat = 41.2044,
  lon = 74.7661,
}) => {
  
  const markerPosition = lat && lon ? { lat: lat, lng: lon } : null;

  return (
    <div className={scss.mapWrapper}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={markerPosition ? 15 : 10} // Увеличиваем зум, если есть маркер
        center={markerPosition || defaultCenter}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
};

export default Hotel_map;