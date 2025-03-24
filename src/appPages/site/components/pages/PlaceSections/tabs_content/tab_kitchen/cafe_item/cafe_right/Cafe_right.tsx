import { FC } from "react";
import scss from "../Cafe_item.module.scss";
import MapWithMarker from "./MapWithMarker";
import { Laptop2, Mail, MapPin, PhoneIcon } from "lucide-react";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { PLACE } from "@/redux/api/place/types";

interface Cafe_rightProps {
  cafeLocation?: PLACE.KitchenLocationResponse[]; // Опциональный параметр
}

const Cafe_right: FC<Cafe_rightProps> = ({ cafeLocation }) => {
  const { t } = useTranslate();
  
  // Проверка на наличие данных о местоположении
  if (!cafeLocation || cafeLocation.length === 0) {
    return (
      <div className={scss.right}>
        <h5>
          {t(
            "Местоположение и контактные данные",
            "الموقع وتفاصيل الاتصال",
            "Location and contact details"
          )}
        </h5>
        <div className={scss.noData}>
          {t(
            "Информация о местоположении отсутствует",
            "معلومات الموقع غير متوفرة",
            "Location information not available"
          )}
        </div>
      </div>
    );
  }
  
  // Получаем первый элемент массива
  const locationData = cafeLocation[0];
  
  // Проверяем наличие необходимых полей
  const hasLatitude = typeof locationData.latitude !== 'undefined';
  const hasLongitude = typeof locationData.longitude !== 'undefined';
  const hasAddress = typeof locationData.address !== 'undefined';
  const hasWebsite = typeof locationData.Website !== 'undefined' && locationData.Website;
  const hasEmail = typeof locationData.email !== 'undefined' && locationData.email;
  const hasPhone = typeof locationData.phone_number !== 'undefined' && locationData.phone_number;
  
  return (
    <div className={scss.right}>
      <h5>
        {t(
          "Местоположение и контактные данные",
          "الموقع وتفاصيل الاتصال",
          "Location and contact details"
        )}
      </h5>
      
      {/* Отображаем карту только если есть координаты */}
      {hasLatitude && hasLongitude && (
        <div className={scss.mapContainer}>
          <MapWithMarker
            latitude={+locationData.latitude}
            longitude={+locationData.longitude}
          />
        </div>
      )}
      
      <div className={scss.contactInfo}>
        {/* Отображаем адрес только если он есть */}
        {hasAddress && (
          <p>
            <span>
              <MapPin color="white" style={{ fill: "black" }} />
            </span>{" "}
            {locationData.address}
          </p>
        )}
        
        {/* Отображаем ссылки на веб-сайт и email только если они есть */}
        {(hasWebsite || hasEmail) && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {hasWebsite && (
              <a
                href={locationData.Website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <Laptop2 />
                </span>{" "}
                {t("Веб-сайт", "موقع إلكتروني", "Website")} ↗
              </a>
            )}
            
            {hasEmail && (
              <a href={`mailto:${locationData.email}`}>
                <span>
                  <Mail />
                </span>{" "}
                 {t("Электронная почта", "البريد الإلكتروني", "Email")} ↗ 
              </a>
            )}
          </div>
        )}
        
        {/* Отображаем телефон только если он есть */}
        {hasPhone && (
          <p>
            <span>
              <PhoneIcon />
            </span>{" "}
            {locationData.phone_number}
          </p>
        )}
      </div>
    </div>
  );
};

export default Cafe_right;