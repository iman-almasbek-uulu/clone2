import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Coffee, ImageOff } from "lucide-react";

import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "./Cafes.module.scss";
import Stars from "@/appPages/site/ui/stars/Stars";
import { useGetKitchensQuery } from "@/redux/api/place";
import LikeKitchen from "./LikeKitchen";

interface CafeProps {
  isCurrent: number | null;
  setIsCurrent: (id: number) => void;
}

const ITEMS_PER_PAGE = 4;

const Cafes: FC<CafeProps> = ({ setIsCurrent, isCurrent }) => {
  const { t } = useTranslate();
  const [isLimit, setIsLimit] = useState<number>(1);
  const { data: cafes = [], isLoading, error } = useGetKitchensQuery();
  const pathName = usePathname();
  const routeID: number = Number(pathName.split("/")[2]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://placehold.co/600x400/e0e0e0/969696?text=No+Image";
    target.alt = "Image not available";
    target.style.objectFit = "contain";
    target.style.backgroundColor = "#f5f5f5";
  };

  const cafesInPlace = cafes.filter((el) => el.popular_places === routeID);

  useEffect(() => {
    if (!isCurrent && cafesInPlace.length) {
      setIsCurrent(cafesInPlace[0].id);
    }
  }, [cafesInPlace, isCurrent, setIsCurrent]);

  const paginateArray = <T,>(arr: T[], pageSize: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / pageSize) }, (_, i) =>
      arr.slice(i * pageSize, i * pageSize + pageSize)
    );

  if (error) {
    return (
      <div className={scss.cafes}>
        <div className={scss.cafes_title}><h4>{t("Рестораны", "مطاعم", "Restaurants")}</h4></div>
        <div className={scss.noCafesContainer}><ImageOff size={48} /><p>{t("Ошибка загрузки данных", "خطأ في تحميل البيانات", "Error loading data")}</p></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={scss.cafes}>
        <div className={scss.cafes_title}><h4>{t("Рестораны", "مطاعم", "Restaurants")}</h4></div>
        <div className={scss.noCafesContainer}><div className={scss.loadingSpinner}></div><p>{t("Загрузка...", "جار التحميل...", "Loading...")}</p></div>
      </div>
    );
  }

  if (!cafesInPlace.length) {
    return (
      <div className={scss.cafes}>
        <div className={scss.cafes_title}><h4>{t("Рестораны", "مطاعم", "Restaurants")}</h4></div>
        <div className={scss.noCafesContainer}><Coffee size={48} /><p>{t("В этом месте пока нет ресторанов", "لا توجد مطاعم في هذا المكان حتى الآن", "No restaurants in this place yet")}</p></div>
      </div>
    );
  }

  const renderCafeItem = cafesInPlace.map((el) => (
    <div onClick={() => setIsCurrent(el.id)} key={el.id} className={scss.item}>
      <div className={scss.imgLike}>
        <Image src={el.main_image} alt={el.kitchen_name} width={486} height={543} unoptimized style={{ objectFit: "cover", backgroundColor: "#f0f0f0" }} onError={handleImageError} />
        <LikeKitchen postId={el.id} />
      </div>
      <div className={scss.info}>
        <h6 className={scss.title}>{el.kitchen_name}</h6>
        <div className={scss.stars_review}><Stars rating={el.average_rating} width={16} height={16} /><p>Reviews: {el.rating_count}</p></div>
        <div className={scss.prices}>{`$${el.price} - $${el.price}, ${el.type_of_cafe.join(", ")}`}</div>
      </div>
    </div>
  ));

  const dividedArray = paginateArray(renderCafeItem, ITEMS_PER_PAGE);
  const visibleCafes = dividedArray.slice(0, isLimit);
  const isAllItemsShown = isLimit >= dividedArray.length;

  return (
    <div className={scss.cafes}>
      <div className={scss.cafes_title}>
        <h4>{t("Лучшие рестораны с разумными ценами", "أفضل المطاعم بأسعار معقولة", "The best restaurants with reasonable prices")}</h4>
        {cafes.length > ITEMS_PER_PAGE && !isAllItemsShown && (
          <p onClick={() => setIsLimit(dividedArray.length)}>{t("Показать все", "عرض الكل", "Show all")}</p>
        )}
      </div>
      {visibleCafes.map((item, index) => (
        <div key={index} className={scss.list} style={visibleCafes.length < 4 ? { gridTemplateColumns: `repeat(${visibleCafes.length}, 280px)` } : {}}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default Cafes;
