import { FC, useEffect, useState } from "react";
import Stars from "@/appPages/site/ui/stars/Stars";
import { useGetHotelsQuery } from "@/redux/api/place";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import imgRight from "@/assets/images/placeImages/Arrow_alt_lright.png";
import scss from "./Hotel_list.module.scss";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Hotel_map from "../hotel_map/Hotel_map";
import LikeHotel from "./LikeHotel";
import { ImageOff, Hotel, Loader } from "lucide-react";

interface HotelListProps {
  setIsCurrent: (id: number) => void;
  isCurrent: number | null;
}

interface Hotel {
  id: number;
  name: string;
  main_image: string;
  avg_rating: number;
  rating_count: number;
  latitude: number | null;
  longitude: number | null;
  popular_places: number;
  region?: string;
}

const ITEMS_PER_PAGE = 6;

const HotelList: FC<HotelListProps> = ({ setIsCurrent, isCurrent }) => {
  const { t } = useTranslate();
  const [isLimit, setIsLimit] = useState<number>(1);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const { data: hotels = [], isLoading, error } = useGetHotelsQuery();
  const placeID = usePathname().split("/")[2];

  const hotelsInPlace = hotels.filter(
    (el) => el.popular_places === Number(placeID)
  );

  useEffect(() => {
    if (hotelsInPlace.length > 0 && isCurrent === null) {
      setIsCurrent(hotelsInPlace[0].id);
    }
  }, [hotelsInPlace, isCurrent, setIsCurrent]);

  const handleImageError = (id: string) => {
    setImageError((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  if (isLoading) {
    return (
      <div className={scss.hotelListContainer}>
        <div className={scss.head}>
          <h4>{t("Отели", "فنادق", "Hotels")}</h4>
        </div>
        <div className={scss.noHotelsContainer}>
          <div className={scss.loadingSpinner}>
            <Loader size={40} className={scss.spinnerIcon} />
          </div>
          <p>
            {t(
              "Загрузка отелей...",
              "جار تحميل الفنادق...",
              "Loading hotels..."
            )}
          </p>
        </div>
      </div>
    );
  }

  // Обработка ошибок
  if (error) {
    return (
      <div className={scss.hotelListContainer}>
        <div className={scss.head}>
          <h4>{t("Отели", "فنادق", "Hotels")}</h4>
        </div>
        <div className={scss.noHotelsContainer}>
          <ImageOff size={48} />
          <p>
            {t(
              "Ошибка при загрузке отелей",
              "خطأ في تحميل الفنادق",
              "Error loading hotels"
            )}
          </p>
        </div>
      </div>
    );
  }

  // Проверка на отсутствие отелей
  if (hotelsInPlace.length === 0) {
    return (
      <div className={scss.hotelListContainer}>
        <div className={scss.head}>
          <h4>{t("Отели", "فنادق", "Hotels")}</h4>
        </div>
        <div className={scss.noHotelsContainer}>
          <Hotel size={48} />
          <p>
            {t(
              "В этом месте пока нет отелей",
              "لا توجد فنادق في هذا المكان حتى الآن",
              "No hotels in this place yet"
            )}
          </p>
        </div>
      </div>
    );
  }

  const renderHotelItem = (hotel: Hotel) => (
    <div
      onClick={() => setIsCurrent(hotel.id)}
      key={hotel.id}
      className={scss.item}
    >
      {imageError[`hotel-${hotel.id}`] ? (
        <div className={scss.imageFallback}>
          <span>
            {t(
              "Изображение не найдено",
              "الصورة غير موجودة",
              "Image not found"
            )}
          </span>
        </div>
      ) : (
        <Image
          src={hotel.main_image}
          alt={hotel.name}
          width={341}
          height={270}
          onError={() => handleImageError(`hotel-${hotel.id}`)}
        />
      )}
      <div className={scss.block}>
        <h6>{hotel.name}</h6>
        <div>
          <Stars rating={hotel.avg_rating} width={21} height={21} />
          <span className={scss.review}>
            {hotel.rating_count} {t("отзывов", "تقييمات", "reviews")}
          </span>
        </div>
      </div>
      <LikeHotel postId={hotel.id} />
      <button onClick={() => setIsCurrent(hotel.id)}>
        {imageError[`right-${hotel.id}`] ? (
          <div className={scss.rightFallback}>→</div>
        ) : (
          <Image
            className={scss.right}
            src={imgRight.src}
            alt={t("Выбрать", "اختر", "Select")}
            width={24}
            height={24}
            onError={() => handleImageError(`right-${hotel.id}`)}
          />
        )}
      </button>
    </div>
  );

  const hotelGroups = hotelsInPlace.reduce<Hotel[][]>((acc, hotel, index) => {
    const groupIndex = Math.floor(index / ITEMS_PER_PAGE);
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(hotel);
    return acc;
  }, []);
  const isAllItemsShown = isLimit >= hotelGroups.length;

  // Находим текущий отель по id
  const currentHotel = isCurrent !== null 
    ? hotelsInPlace.find(hotel => hotel.id === isCurrent) 
    : null;
    const lat = currentHotel && currentHotel.latitude !== null ? currentHotel.latitude : 0;
    const lon = currentHotel && currentHotel.longitude !== null ? currentHotel.longitude : 0;
  return (
    <div className={scss.hotelContainer}>
      <Hotel_map 
        lat={+lat} 
        lon={+lon} 
      />

      <div className={scss.head}>
        <h4>
          {t(
            "Лучшие отели поблизости",
            "أفضل الفنادق القريبة",
            "The best hotels nearby"
          )}
        </h4>
        {hotels.length > ITEMS_PER_PAGE && !isAllItemsShown && (
          <button onClick={() => setIsLimit(hotelGroups.length)}>
            {t("Показать все", "عرض الكل", "Show all")}
          </button>
        )}
      </div>
      {hotelGroups.length > 0 &&
        hotelGroups.slice(0, isLimit).map((group, groupIndex) => (
          <div key={groupIndex} className={scss.list}>
            {group.map(renderHotelItem)}
          </div>
        ))}
    </div>
  );
};

export default HotelList;