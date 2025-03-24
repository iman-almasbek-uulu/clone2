"use client"; // Добавляем директиву для клиентского рендеринга
import { useState, useEffect } from "react"; // Добавляем useEffect
import AttractionList from "./attractionList/AttractionList";
import scss from "./Tab_attractions.module.scss";
import AttractionInfo from "./attractionInfo/AttractionInfo";
import { useGetStaticReviewsQuery } from "@/redux/api/reviews";
import Reviews from "@/appPages/site/ui/reviews/Reviews";
import { useGetAttractionsQuery } from "@/redux/api/home";
import { usePathname } from "next/navigation";
import { ImageOff, Loader, MapPin } from "lucide-react";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface AttractionsProps {
  isTab: number;
}

const Attractions: React.FC<AttractionsProps> = ({ isTab }) => {
  const { t } = useTranslate();
  const pathName = usePathname();
  const routeID: number = Number(pathName.split("/")[2]);
  const { data: attractions = [], isLoading, error } = useGetAttractionsQuery();
  const attractionsInPlace = attractions.filter(
    (el) => el.popular_places === routeID
  );
  // Инициализируем currentId из sessionStorage или null
  const [currentId, setCurrentId] = useState<number | null>(() => {
    const storedId = sessionStorage.getItem("currentAttractionId");
    return storedId !== null ? +storedId : null;
  });

  const { data } = useGetStaticReviewsQuery({ entityType: "attraction" });
  const attractionStaticInfo = data?.find(
    (attraction) => attraction.id === currentId
  );
  // Сохраняем currentId в sessionStorage при его изменении
  useEffect(() => {
    if (currentId !== null) {
      sessionStorage.setItem("currentAttractionId", currentId.toString());
    }
  }, [currentId]);

  useEffect(() => {
    if (attractionsInPlace.length > 0 && currentId === null) {
      const firstAttractionId = attractionsInPlace[0].id;
      setCurrentId(firstAttractionId);
    }
  }, [attractionsInPlace, currentId, setCurrentId]);

  // Loading scenario
  if (isLoading) {
    return (
      <div id={scss.Attractions}>
        <div className={scss.attractions_title}>
          <h4>
            {t(
              "Лучшие достопримечательности поблизости",
              "أفضل المعالم القريبة",
              "The best attractions nearby"
            )}
          </h4>
        </div>
        <div className={scss.noAttractionsContainer}>
          <Loader size={48} className={scss.loadingSpinner} />
          <p>{t("Загрузка...", "جار التحميل...", "Loading...")}</p>
        </div>
      </div>
    );
  }

  // Error scenario
  if (error) {
    return (
      <div id={scss.Attractions}>
        <div className={scss.attractions_title}>
          <h4>
            {t(
              "Лучшие достопримечательности поблизости",
              "أفضل المعالم القريبة",
              "The best attractions nearby"
            )}
          </h4>
        </div>
        <div className={scss.noAttractionsContainer}>
          <ImageOff size={48} />
          <p>
            {t(
              "Ошибка загрузки данных",
              "خطأ في تحميل البيانات",
              "Error loading data"
            )}
          </p>
        </div>
      </div>
    );
  }

  // Если нет достопримечательностей
  if (attractionsInPlace.length === 0) {
    return (
      <div id={scss.Attractions}>
        <div className={scss.attractions_title}>
          <h4>
            {t(
              "Лучшие достопримечательности поблизости",
              "أفضل المعالم القريبة",
              "The best attractions nearby"
            )}
          </h4>
        </div>
        <div className={scss.noAttractionsContainer}>
          <MapPin size={48} />
          <p>
            {t("Нет достопримечательностей", "لا توجد معالم", "No attractions")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id={scss.Attractions}>
        <AttractionList
          isCurrent={currentId}
          setIsCurrent={setCurrentId}
          attractionsInPlace={attractionsInPlace}
        />
        <AttractionInfo isCurrent={currentId} />
      </div>
      <Reviews
        isTab={isTab}
        isCurrent={currentId}
        reviewStatic={attractionStaticInfo}
      />
    </>
  );
};

export default Attractions;
