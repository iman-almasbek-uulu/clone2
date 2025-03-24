import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import styles from "./Map.module.scss";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface MapProps {
  directions: google.maps.DirectionsResult | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
};

// Центр карты - Бишкек
const center = {
  lat: 42.8746,
  lng: 74.5698,
};

const mapOptions = {
  disableDefaultUI: true, // Отключаем все стандартные элементы управления
  zoomControl: true, // Включаем только контроллер масштабирования
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  scrollwheel: true,
  language: "ru" // Установка русского языка для элементов карты
};

export default function Map({ directions }: MapProps) {
  const { t } = useTranslate();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  // Загрузка Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    language: "ru", // Установка русского языка
    region: "KG" // Регион Кыргызстан
  });

  // Колбэк при загрузке карты
  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  // Подстраиваем карту под маршрут, когда получаем directions
  useEffect(() => {
    if (map && directions && directions.routes.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      directions.routes[0].legs.forEach(leg => {
        bounds.extend(leg.start_location);
        bounds.extend(leg.end_location);
      });
      map.fitBounds(bounds);
    }
  }, [map, directions]);

  if (loadError) {
    return <div className={styles.error}>{t("Ошибка загрузки карты", "خطأ في تحميل الخريطة", "Error loading map")}</div>;
  }

  if (!isLoaded) {
    return <div className={styles.loading}>{t("Загрузка карты...", "جاري تحميل الخريطة...", "Loading map...")}</div>;
  }

  return (
    <div className={styles.map}>
      <GoogleMap 
        
        mapContainerStyle={mapContainerStyle} 
        center={center} 
        zoom={7}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
}