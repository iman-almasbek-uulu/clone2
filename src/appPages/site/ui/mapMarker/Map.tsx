"use client";
import { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// Интерфейс для результатов поиска мест
interface PlaceResult {
  place_id: string;
  name: string;
  geometry: {
    location: google.maps.LatLng;
  };
}

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 42.3135, lng: 72.2246 }; // Центр Кыргызстана

const Map = () => {
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Функция поиска достопримечательностей
  const fetchPlaces = () => {
    if (!mapRef.current) return;

    const service = new google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: center,
      radius: 50000, // 50 км
      type: "tourist_attraction",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaces(results as PlaceResult[]);
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""} libraries={["places"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={7}
        onLoad={(map) => {
          mapRef.current = map;
          fetchPlaces();
        }}
      >
        {places.map((place) => (
          <Marker key={place.place_id} position={place.geometry.location} title={place.name} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;