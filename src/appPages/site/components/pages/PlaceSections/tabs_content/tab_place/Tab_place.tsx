"use client";

import React, { useState } from "react";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { usePathname } from "next/navigation";
import { useGetStaticReviewsQuery } from "@/redux/api/reviews";
import { useGetDirectionsQuery } from "@/redux/googleMapsApi";
import SearchBar from "@/appPages/site/ui/searchBar/SearchBar";
import RouteInfo from "@/appPages/site/ui/route/Route";
import Map from "@/appPages/site/ui/map/Map";
import Reviews from "@/appPages/site/ui/reviews/Reviews";
import scss from "./Tab_place.module.scss";
import AirlineModal from "../../../routesSections/airLineModal/AirLineModal";

interface TabPlaceProps {
  isTab: number;
}

const Tab_place: React.FC<TabPlaceProps> = ({ isTab }) => {
  const { t } = useTranslate();
  const pathName = usePathname();
  const id: number = Number(pathName.split("/")[2]);
  const { data } = useGetStaticReviewsQuery({ entityType: "popular_places" });
  const placeStaticInfo = data?.find((place) => place.id === id);
  const [modalWindow, setModalWindow] = useState<boolean>(false);

  const [pointA, setPointA] = useState("");
  const [pointB, setPointB] = useState("");
  const [pointACoords, setPointACoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [pointBCoords, setPointBCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isSearched, setIsSearched] = useState(false);

  const {
    data: walkData,
    error: walkError,
    refetch: refetchWalk,
  } = useGetDirectionsQuery(
    pointACoords && pointBCoords
      ? { origin: pointACoords, destination: pointBCoords, mode: "WALKING" }
      : {
          origin: { lat: 0, lng: 0 },
          destination: { lat: 0, lng: 0 },
          mode: "WALKING",
        },
    { skip: !pointACoords || !pointBCoords, refetchOnMountOrArgChange: true }
  );

  const {
    data: carData,
    error: carError,
    refetch: refetchCar,
  } = useGetDirectionsQuery(
    pointACoords && pointBCoords
      ? { origin: pointACoords, destination: pointBCoords, mode: "DRIVING" }
      : {
          origin: { lat: 0, lng: 0 },
          destination: { lat: 0, lng: 0 },
          mode: "DRIVING",
        },
    { skip: !pointACoords || !pointBCoords, refetchOnMountOrArgChange: true }
  );

  const {
    data: trainData,
    error: trainError,
    refetch: refetchTrain,
  } = useGetDirectionsQuery(
    pointACoords && pointBCoords
      ? { origin: pointACoords, destination: pointBCoords, mode: "TRAIN" }
      : {
          origin: { lat: 0, lng: 0 },
          destination: { lat: 0, lng: 0 },
          mode: "TRAIN",
        },
    { skip: !pointACoords || !pointBCoords, refetchOnMountOrArgChange: true }
  );

  const handleSearch = () => {
    if (!pointACoords || !pointBCoords) return;

    setIsSearched(true);
    refetchWalk();
    refetchCar();
    refetchTrain();

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pointACoords,
        destination: pointBCoords,
        travelMode: google.maps.TravelMode.WALKING,
        region: "KG",
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          console.error("Failed to fetch directions:", status);
        }
      }
    );
  };

  return (
    <div className={scss.tab_place}>
      <p>{t("Куда пойти", "إلى أين تذهب", "Where to go")}</p>
      <div className={scss.SearchBar}>
        <SearchBar
          pointA={pointA}
          pointB={pointB}
          setPointA={setPointA}
          setPointB={setPointB}
          pointACoords={pointACoords}
          pointBCoords={pointBCoords}
          setPointACoords={setPointACoords}
          setPointBCoords={setPointBCoords}
          onSearch={handleSearch}

        />
      </div>
      <div className={scss.block}>
        <RouteInfo
          walkData={walkData}
          walkError={walkError}
          carData={carData}
          carError={carError}
          trainData={trainData}
          trainError={trainError}
          isSearched={isSearched}
          setModalWindow={setModalWindow}
        />
      </div>
      <div className={scss.map}>
        <Map directions={directions} />
      </div>
      <Reviews isTab={isTab} isCurrent={id} reviewStatic={placeStaticInfo} />
      {modalWindow && <AirlineModal setModalWindow={setModalWindow} />}
    </div>
  );
};

export default Tab_place;
