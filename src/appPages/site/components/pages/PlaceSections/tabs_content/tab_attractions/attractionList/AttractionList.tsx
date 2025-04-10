import React, { FC, useState } from "react";
import Image from "next/image";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "./AttractionList.module.scss";
import Stars from "@/appPages/site/ui/stars/Stars";
import { ImageOff } from "lucide-react";
import LikeAttraction from "./LikeAttraction";
import { HOME } from "@/redux/api/home/types";

interface AttractionsProps {
  isCurrent: number | null;
  setIsCurrent: (id: number | null) => void;
  attractionsInPlace: HOME.AttractionsResponse;
}

const ITEMS_PER_PAGE = 4;

const AttractionList: FC<AttractionsProps> = ({
  setIsCurrent,
  isCurrent,
  attractionsInPlace,
}) => {
  const { t } = useTranslate();
  const [isLimit, setIsLimit] = useState<number>(1);
  const [imgErrors, setImgErrors] = useState<{ [key: number]: boolean }>({});

  // Handle image error for specific attraction
  const handleImageError = (id: number) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Пагинация
  const paginateArray = <T,>(arr: T[], pageSize: number): T[][] => {
    return arr.reduce(
      (result, _, index) =>
        index % pageSize
          ? result
          : [...result, arr.slice(index, index + pageSize)],
      [] as T[][]
    );
  };

  const renderAttractionItem = attractionsInPlace.map((el, i) => (
    <div
      onClick={() => setIsCurrent(el.id)}
      key={i}
      className={`${scss.item} ${isCurrent === el.id ? scss.active : ""}`} // Добавляем активный класс
    >
      <div className={scss.imageContainer}>
        {imgErrors[el.id] || !el.main_image ? (
          <div className={scss.imgNotFound}>
            <ImageOff size={32} />
            <p>
              {t(
                "Изображение не найдено",
                "الصورة غير موجودة",
                "Image not found"
              )}
            </p>
          </div>
        ) : (
          <Image
            src={el.main_image}
            alt={el.attraction_name}
            width={281}
            height={152}
            unoptimized
            style={{
              objectFit: "cover",
              backgroundColor: "#f0f0f0",
            }}
            onError={() => handleImageError(el.id)}
          />
        )}
        <LikeAttraction postId={el.id} />
      </div>
      <div className={scss.info}>
        <h6 className={scss.title}>{el.attraction_name}</h6>
        <div className={scss.stars_review}>
          <Stars rating={el.avg_rating} />
          <p>Reviews: {el.rating_count}</p>
        </div>
      </div>
    </div>
  ));

  const dividedArray = paginateArray(renderAttractionItem, ITEMS_PER_PAGE);
  const isAllItemsShown = isLimit >= dividedArray.length;
  console.log("🚀 ~ dividedArray:", dividedArray);
  console.log("🚀 ~ isAllItemsShown:", isAllItemsShown);

  return (
    <div className={scss.attractions}>
      <div className={scss.attractions_title}>
        <h4>
          {t(
            "Лучшие достопримечательности поблизости",
            "أفضل المعالم القريبة",
            "The best attractions nearby"
          )}
        </h4>
        {attractionsInPlace.length > ITEMS_PER_PAGE && !isAllItemsShown && (
          <p onClick={() => setIsLimit(dividedArray.length)}>
            {t("Показать все", "عرض الكل", "Show all")}
          </p>
        )}
      </div>
      {dividedArray.slice(0, isLimit).map((item, index) => {
        const itemsInRow = item.length; // Количество элементов в текущем ряду
        const isLastRow = index === dividedArray.length - 1; // Проверяем, если это последний ряд

        // Стиль для грид-колонок в зависимости от количества элементов в последнем ряду
        const gridStyle: React.CSSProperties = {
          display: "grid",
          marginTop: "30px",
          gap: "30px",
          // Если это последний ряд, показываем столько колонок, сколько элементов
          gridTemplateColumns: isLastRow
            ? `repeat(${itemsInRow}, 280px)` // Количество колонок в последнем ряду
            : "repeat(4, 280px)", // В остальных рядах всегда 4 колонки
        };

        return (
          <div key={index} style={gridStyle} className={scss.list}>
            {item}
          </div>
        );
      })}
    </div>
  );
};

export default AttractionList;
