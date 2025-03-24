"use client";

import React, { useState, useRef } from "react";
import styles from "./SearchBar.module.scss";
import { useRouter } from "next/navigation";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface SearchBarProps {
  pointA: string;
  pointB: string;
  setPointA: (value: string) => void;
  setPointB: (value: string) => void;
  pointACoords: { lat: number; lng: number } | null;
  pointBCoords: { lat: number; lng: number } | null;
  setPointACoords: (coords: { lat: number; lng: number } | null) => void;
  setPointBCoords: (coords: { lat: number; lng: number } | null) => void;
  onSearch: () => void;

  setModalWindowTime?: (boolean: boolean) => void;
  fromMap?: boolean;
  navigateToRoutes?: boolean;
  
}

const kyrgyzstanBounds = {
  north: 43.265,
  south: 39.172,
  east: 80.226,
  west: 69.264,
};

export default function SearchBar({
  pointA,
  pointB,
  setPointA,
  setPointB,
  pointACoords,
  pointBCoords,
  setPointACoords,
  setPointBCoords,
  onSearch,

  setModalWindowTime,
  fromMap = false,
  navigateToRoutes = false,
}: SearchBarProps) {
  const router = useRouter();
  const { t } = useTranslate();

  const [pointAError, setPointAError] = useState<string | null>(null);
  const [pointBError, setPointBError] = useState<string | null>(null);
  const [suggestionsA, setSuggestionsA] = useState<string[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<string[]>([]);
  const [showSuggestionsA, setShowSuggestionsA] = useState(false);
  const [showSuggestionsB, setShowSuggestionsB] = useState(false);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  const navigateToRoutesPage = () => {
    if (!validateInputs()) return;
    if (!pointACoords || !pointBCoords) return;

    const queryParams = new URLSearchParams({
      pointA: pointA,
      pointB: pointB,
      pointALat: pointACoords.lat.toString(),
      pointALng: pointACoords.lng.toString(),
      pointBLat: pointBCoords.lat.toString(),
      pointBLng: pointBCoords.lng.toString(),
    }).toString();

    router.push(`/routes?${queryParams}`);
  };

  const validateInputs = () => {
    let isValid = true;
    setPointAError(null);
    setPointBError(null);

    if (!pointA.trim()) {
      setPointAError(t("Укажите пункт отправления", "الرجاء تحديد نقطة المغادرة", "Please specify departure point"));
      isValid = false;
    }

    if (!pointB.trim()) {
      setPointBError(t("Укажите пункт назначения", "الرجاء تحديد الوجهة", "Please specify destination"));
      isValid = false;
    }

    return isValid;
  };

  const handleSearch = () => {
    if (!validateInputs()) return;
    onSearch();
    if (setModalWindowTime) {
      setModalWindowTime(true);
    }
  };

  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);

  // Инициализация сервисов Google Maps
  if (typeof window !== "undefined" && !autocompleteService.current) {
    autocompleteService.current = new google.maps.places.AutocompleteService();
    placesService.current = new google.maps.places.PlacesService(document.createElement("div"));
  }

  // Функция для удаления "Кыргызстан" или "Kyrgyzstan" из строки
  const removeCountry = (text: string): string => {
    return text
      .replace(/,\s*Кыргызстан/gi, "")
      .replace(/,\s*Kyrgyzstan/gi, "")
      .trim();
  };

  // Получение подсказок для Point A
  const fetchSuggestionsA = (value: string) => {
    if (!autocompleteService.current || !value) {
      setSuggestionsA([]);
      setShowSuggestionsA(false);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(kyrgyzstanBounds.south, kyrgyzstanBounds.west),
          new google.maps.LatLng(kyrgyzstanBounds.north, kyrgyzstanBounds.east)
        ),
        componentRestrictions: { country: "kg" },
        types: ["establishment", "geocode"],
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const cleanedSuggestions = predictions.map((prediction) =>
            removeCountry(prediction.description)
          );
          setSuggestionsA(cleanedSuggestions);
          setShowSuggestionsA(true);
        } else {
          setSuggestionsA([]);
          setShowSuggestionsA(false);
        }
      }
    );
  };

  // Получение подсказок для Point B
  const fetchSuggestionsB = (value: string) => {
    if (!autocompleteService.current || !value) {
      setSuggestionsB([]);
      setShowSuggestionsB(false);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(kyrgyzstanBounds.south, kyrgyzstanBounds.west),
          new google.maps.LatLng(kyrgyzstanBounds.north, kyrgyzstanBounds.east)
        ),
        componentRestrictions: { country: "kg" },
        types: ["establishment", "geocode"],
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const cleanedSuggestions = predictions.map((prediction) =>
            removeCountry(prediction.description)
          );
          setSuggestionsB(cleanedSuggestions);
          setShowSuggestionsB(true);
        } else {
          setSuggestionsB([]);
          setShowSuggestionsB(false);
        }
      }
    );
  };

  // Выбор подсказки для Point A
  const handleSelectA = (suggestion: string) => {
    setPointA(suggestion);
    setShowSuggestionsA(false);
    if (placesService.current) {
      placesService.current.textSearch(
        { query: suggestion, bounds: kyrgyzstanBounds },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
            const location = results[0].geometry?.location;
            if (location) {
              setPointACoords({
                lat: location.lat(),
                lng: location.lng(),
              });
            }
          }
        }
      );
    }
    setPointAError(null);
  };

  // Выбор подсказки для Point B
  const handleSelectB = (suggestion: string) => {
    setPointB(suggestion);
    setShowSuggestionsB(false);
    if (placesService.current) {
      placesService.current.textSearch(
        { query: suggestion, bounds: kyrgyzstanBounds },
        (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
            const location = results[0].geometry?.location;
            if (location) {
              setPointBCoords({
                lat: location.lat(),
                lng: location.lng(),
              });
            }
          }
        }
      );
    }
    setPointBError(null);
  };

  const handlePointAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPointA(value);
    if (value.trim()) {
      setPointAError(null);
      fetchSuggestionsA(value);
    } else {
      setSuggestionsA([]);
      setShowSuggestionsA(false);
    }
  };

  const handlePointBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPointB(value);
    if (value.trim()) {
      setPointBError(null);
      fetchSuggestionsB(value);
    } else {
      setSuggestionsB([]);
      setShowSuggestionsB(false);
    }
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchContainer}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputARef}
            type="text"
            value={pointA}
            onChange={handlePointAChange}
            placeholder={t("Откуда?", "من أين؟", "From where?")}
            className={`${styles.input} ${pointA ? styles.inputFocused : ""} ${pointAError ? styles.inputError : ""}`}
            onBlur={() => setTimeout(() => setShowSuggestionsA(false), 200)}
            onFocus={() => pointA && fetchSuggestionsA(pointA)}
          />
          {showSuggestionsA && suggestionsA.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestionsA.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectA(suggestion)}
                  className={styles.suggestionItem}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {pointAError && <div className={styles.errorMessage}>{pointAError}</div>}
        </div>

        <div className={styles.inputWrapper}>
          <input
            ref={inputBRef}
            type="text"
            value={pointB}
            onChange={handlePointBChange}
            placeholder={t("Куда?", "إلى أين؟", "Where to?")}
            className={`${styles.input} ${pointBError ? styles.inputError : ""}`}
            onBlur={() => setTimeout(() => setShowSuggestionsB(false), 200)}
            onFocus={() => pointB && fetchSuggestionsB(pointB)}
          />
          {showSuggestionsB && suggestionsB.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestionsB.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectB(suggestion)}
                  className={styles.suggestionItem}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          {pointBError && <div className={styles.errorMessage}>{pointBError}</div>}
        </div>

        <button
          onClick={() => {
            if (fromMap && navigateToRoutes) {
              navigateToRoutesPage();
            } else {
              handleSearch();
            }
          }}
          className={styles.btnGo}
        >
          {t("Поехали", "انطلق", "Go")}
        </button>
      </div>
    </div>
  );
}