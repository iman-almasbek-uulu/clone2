import React from "react";
import styles from "./Route.module.scss";
import { BsPersonWalking } from "react-icons/bs";
import { FaCar } from "react-icons/fa";
import { IoSubway } from "react-icons/io5";
import { TiLocation } from "react-icons/ti";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { GiAirplaneDeparture } from "react-icons/gi";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface RouteInfoProps {
  walkData?: { distance: string; duration: string };
  walkError?: FetchBaseQueryError | SerializedError;
  carData?: { distance: string; duration: string };
  carError?: FetchBaseQueryError | SerializedError;
  trainData?: { distance: string; duration: string };
  trainError?: FetchBaseQueryError | SerializedError;
  isSearched: boolean;
  setModalWindow?: (boolean: boolean) => void
}

export default function RouteInfo({
  walkData,
  walkError,
  carData,
  carError,
  trainData,
  isSearched,
  setModalWindow
}: RouteInfoProps) {
  const { t } = useTranslate();
  
  const getErrorText = (error?: FetchBaseQueryError | SerializedError) => {
    if (!error) return t("Нет данных", "لا توجد بيانات", "No data");
    if ("status" in error) {
      return `${error.status}: ${
        typeof error.data === "string" ? error.data : t("Ошибка", "خطأ", "Error")
      }`;
    }
    return t("Ошибка", "خطأ", "Error");
  };

  return (
    <div className={styles.routeInfo}>
      <div className={styles.routeItem}>
        <TiLocation className={styles.icon} />
        <p>
          {isSearched ? walkData?.distance || getErrorText(walkError) : "-"}
        </p>
      </div>
      <div className={styles.routeItem}>
        <BsPersonWalking className={styles.icon} />
        <p>
          {isSearched ? walkData?.duration || getErrorText(walkError) : "-"}
        </p>
      </div>
      <div className={styles.routeItem}>
        <FaCar className={styles.icon} />
        <p>{isSearched ? carData?.duration || getErrorText(carError) : "-"}</p>
      </div>
      <div className={styles.routeItem}>
        <IoSubway className={styles.icon} />
        <p>
          {isSearched ? trainData?.duration || t("Нет маршрута", "لا يوجد طريق", "No route") : "-"}
        </p>
      </div>
      <div style={{cursor: "pointer"}} onClick={() => setModalWindow && setModalWindow(true)} className={styles.routeItem}>
        <GiAirplaneDeparture className={styles.icon} />
        <p>{t("авиакомпании", "شركات الطيران", "airlines")}</p>
      </div>
    </div>
  );
}