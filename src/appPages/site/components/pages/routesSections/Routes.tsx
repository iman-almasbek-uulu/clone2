import React, { useEffect, useRef, useState, useCallback } from "react";
import scss from "./Routes.module.scss";
import Talas from "../../../../../assets/images/routesImages/Talas.png";
import Chui from "../../../../../assets/images/routesImages/Chui.png";
import Kyl from "../../../../../assets/images/routesImages/kyl.png";
import JalalAbad from "../../../../../assets/images/routesImages/JalalAbad.png";
import Naryn from "../../../../../assets/images/routesImages/Naryn.png";
import Osh from "../../../../../assets/images/routesImages/Osh.png";
import Batken from "../../../../../assets/images/routesImages/Batken.png";
import "react-datepicker/dist/react-datepicker.css";
import AirlineList from "./airLineModal/AirLineModal";
import { useGetDirectionsQuery } from "@/redux/googleMapsApi";
import SearchBar from "@/appPages/site/ui/searchBar/SearchBar";
import RouteInfo from "@/appPages/site/ui/route/Route";
import Map from "@/appPages/site/ui/map/Map";
import { useSearchParams } from "next/navigation";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import Image from "next/image";

// Определяем интерфейс для параметров направлений
interface DirectionsParams {
  origin: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  mode: "WALKING" | "DRIVING" | "TRAIN";
}

const Routes = () => {
  const searchParams = useSearchParams();
  const [modalWindowTime, setModalWindowTime] = useState<boolean>(false);
  const [modalWindow, setModalWindow] = useState<boolean>(false);
  const { t } = useTranslate();
  // Инициализируем состояние с параметрами из URL, если они есть
  const [pointA, setPointA] = useState(searchParams?.get("pointA") || "");
  const [pointB, setPointB] = useState(searchParams?.get("pointB") || "");
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

  // Флаг для отслеживания первого рендера
  const isFirstRender = useRef(true);

  const handleSearchWithoutRefetch = useCallback(() => {
    if (!pointACoords || !pointBCoords) return;

    setIsSearched(true);

    // Проверяем, что мы на клиенте и Google Maps API доступен
    if (typeof window !== 'undefined' && window.google) {
      try {
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
      } catch (error) {
        console.error("Error using Google Maps API:", error);
      }
    }
  }, [pointACoords, pointBCoords]); // Указываем зависимости

  // Инициализируем координаты из параметров URL
  useEffect(() => {
    if (searchParams) {
      const pointALat = searchParams.get("pointALat");
      const pointALng = searchParams.get("pointALng");
      const pointBLat = searchParams.get("pointBLat");
      const pointBLng = searchParams.get("pointBLng");

      if (pointALat && pointALng) {
        setPointACoords({
          lat: parseFloat(pointALat),
          lng: parseFloat(pointALng),
        });
      }

      if (pointBLat && pointBLng) {
        setPointBCoords({
          lat: parseFloat(pointBLat),
          lng: parseFloat(pointBLng),
        });
      }

      // Если есть параметры в URL, автоматически показываем маршрут
      if (pointALat && pointALng && pointBLat && pointBLng) {
        setModalWindowTime(true);
      }
    }
  }, [searchParams]);

  // Запросы для разных видов транспорта с параметром skip, который предотвращает автоматический запуск
  const {
    data: walkData,
    error: walkError,
    refetch: refetchWalk,
  } = useGetDirectionsQuery(
    pointACoords && pointBCoords
      ? ({
          origin: pointACoords,
          destination: pointBCoords,
          mode: "WALKING",
        } as DirectionsParams)
      : ({
          origin: { lat: 0, lng: 0 },
          destination: { lat: 0, lng: 0 },
          mode: "WALKING",
        } as DirectionsParams),
    {
      skip: !pointACoords || !pointBCoords,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: carData,
    error: carError,
    refetch: refetchCar,
  } = useGetDirectionsQuery(
    pointACoords && pointBCoords
      ? ({
          origin: pointACoords,
          destination: pointBCoords,
          mode: "DRIVING",
        } as DirectionsParams)
      : ({
          origin: { lat: 0, lng: 0 },
          destination: { lat: 0, lng: 0 },
          mode: "DRIVING",
        } as DirectionsParams),
    {
      skip: !pointACoords || !pointBCoords,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: trainData,
    error: trainError,
    refetch: refetchTrain,
  } = useGetDirectionsQuery(
    pointACoords && pointBCoords
      ? ({
          origin: pointACoords,
          destination: pointBCoords,
          mode: "TRAIN",
        } as DirectionsParams)
      : ({
          origin: { lat: 0, lng: 0 },
          destination: { lat: 0, lng: 0 },
          mode: "TRAIN",
        } as DirectionsParams),
    {
      skip: !pointACoords || !pointBCoords,
      refetchOnMountOrArgChange: true,
    }
  );

  // Отдельный эффект для обработки координат и инициации поиска маршрута
  useEffect(() => {
    // Проверяем, что координаты установлены и это не первый рендер
    if (pointACoords && pointBCoords) {
      // Если это первый рендер после загрузки координат из URL, помечаем, что рендер произошел
      if (isFirstRender.current) {
        isFirstRender.current = false;

        // Если у нас есть координаты из URL, запускаем поиск маршрута
        if (searchParams?.has("pointALat")) {
          // Откладываем выполнение, чтобы убедиться, что Google Maps API загружен
          setTimeout(() => {
            handleSearchWithoutRefetch();
          }, 100);
        }
      }
    }
  }, [pointACoords, pointBCoords, searchParams, handleSearchWithoutRefetch]);

  // Функция для поиска маршрута (вызывается при явном нажатии кнопки поиска)
  const handleSearch = useCallback(() => {
    if (!pointACoords || !pointBCoords) return;

    setIsSearched(true);

    // После первого рендера запросы уже будут инициализированы, и мы можем безопасно вызвать refetch
    if (!isFirstRender.current) {
      refetchWalk();
      refetchCar();
      refetchTrain();
    }

    // Проверяем, что мы на клиенте и Google Maps API доступен
    if (typeof window !== 'undefined' && window.google) {
      try {
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
      } catch (error) {
        console.error("Error using Google Maps API:", error);
      }
    }
  }, [pointACoords, pointBCoords, refetchWalk, refetchCar, refetchTrain]);

  return (
    <div className={scss.Routes}>
      <div className={scss.block1}>
        <div className={scss.blockInputs}>
          <div className={`${scss.container} container`}>
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
                setModalWindowTime={setModalWindowTime}
              />
            </div>
          </div>
          {!modalWindowTime && (
            <div className="container">
              <div className={scss.blockCitys}>
                <div className={scss.cityImgs}>
                  <Image
                    src={Talas.src}
                    alt="talas"
                    className={scss.imgTalas}
                    width={100}
                    height={100}
                  />
                  <Image
                    src={Chui.src}
                    alt="chui"
                    className={scss.imgChui}
                    width={100}
                    height={100}
                  />
                  <Image
                    src={Kyl.src}
                    alt="kyl"
                    className={scss.imgKyl}
                    width={100}
                    height={100}
                  />
                  <Image
                    src={JalalAbad.src}
                    alt="JalalAbad"
                    className={scss.imgJalalAbad}
                    width={100}
                    height={100}
                  />
                  <Image
                    src={Naryn.src}
                    alt="Naryn"
                    className={scss.imgNaryn}
                    width={100}
                    height={100}
                  />
                  <Image
                    src={Osh.src}
                    alt="Osh"
                    className={scss.imgOsh}
                    width={100}
                    height={100}
                  />
                  <Image
                    src={Batken.src}
                    alt="Batken"
                    className={scss.imgBatken}
                    width={100}
                    height={100}
                  />
                </div>
                <div className={scss.cityTitle}>
                  <h5>{t("Талас", "تالاس", "Talas")}</h5>
                  <h5>{t("Чуй", "تشوي", "Chui")}</h5>
                  <h5>{t("Иссык-Куль", "إيسيك كول", "Issyk-Kul")}</h5>
                  <h5>{t("Джалал-Абад", "جلال أباد", "Jalal-Abad")}</h5>
                  <h5>{t("Нарын", "نارين", "Naryn")}</h5>
                  <h5>{t("Ош", "أوش", "Osh")}</h5>
                  <h5>{t("Баткен", "باتكين", "Batken")}</h5>
                </div>
              </div>
            </div>
          )}
          {modalWindowTime && (
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
          )}
        </div>
        {modalWindow && (
          <>
            <AirlineList setModalWindow={setModalWindow} />
          </>
        )}

        {modalWindowTime && (
          <div className={scss.map}>
            <Map directions={directions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Routes;