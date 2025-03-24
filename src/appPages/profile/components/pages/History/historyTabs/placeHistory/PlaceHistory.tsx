// appPages/profile/components/pages/History/historyTabs/placeHistory/PlaceHistory.tsx
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import scss from "./PlaceHistory.module.scss";
import Image from "next/image";
import Stars from "@/appPages/site/ui/stars/Stars";
import imgHeart from "@/assets/images/placeImages/Vector.png";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { MY_REVIEWS } from "@/redux/api/profileHistory/types";
import { useGetMeReviewsQuery } from "@/redux/api/profileHistory";
import { ImageOff, MapPin, Loader } from "lucide-react";

const PlaceHistory = () => {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const { data: reviewsResponse, isLoading, error } = useGetMeReviewsQuery();
  const { t } = useTranslate();
  const [loadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Состояние для хранения ID выбранного места
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
  
  // Функция для формирования правильного URL изображения
  const getImageUrl = useCallback((url: string) => {
    if (!url) return "/default-image.png"; // Запасное изображение по умолчанию
    
    return url.startsWith('http') 
      ? url 
      : `${process.env.NEXT_PUBLIC_API_URL || ''}${url.startsWith('/') ? url : `/${url}`}`;
  }, []);

  // Фильтруем только отзывы о популярных местах
  const placeReviews = useMemo(() => {
    // Проверяем, что ответ API содержит поле data и это массив
    if (!reviewsResponse?.data || !Array.isArray(reviewsResponse.data)) {
      return [];
    }

    // Фильтруем массив, оставляя только отзывы о местах
    return reviewsResponse.data.filter(
      (review) =>
        review && typeof review === "object" && "popular_place" in review
    ) as MY_REVIEWS.PopularPlaceReview[];
  }, [reviewsResponse]);

  // Фильтруем отзывы для выбранного места
  const filteredReviews = useMemo(() => {
    if (!selectedPlaceId) return placeReviews;

    return placeReviews.filter(
      (review) => review.popular_place.id === selectedPlaceId
    );
  }, [placeReviews, selectedPlaceId]);

  // Получаем список уникальных мест из отзывов
  const uniquePlaces = useMemo(() => {
    if (!placeReviews.length) return [];

    // Создаем Map для хранения уникальных мест по ID
    const placesMap = new Map<number, MY_REVIEWS.PopularPlace>();

    // Добавляем каждое место в Map, что автоматически исключит дубликаты
    placeReviews.forEach((review) => {
      if (!placesMap.has(review.popular_place.id)) {
        placesMap.set(review.popular_place.id, review.popular_place);
      }
    });

    // Преобразуем Map обратно в массив
    return Array.from(placesMap.values());
  }, [placeReviews]);

  // При первой загрузке выбираем первое место
  useEffect(() => {
    if (uniquePlaces.length > 0 && !selectedPlaceId) {
      setSelectedPlaceId(uniquePlaces[0].id);
    }
  }, [uniquePlaces, selectedPlaceId]);

  // Обработчики событий
  const handleImageError = useCallback((id: string) => {
    console.error(`Ошибка загрузки изображения с ID: ${id}`);
    setImageError((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    if (scrollWidth - (scrollLeft + clientWidth) < 200 && !loadingMore) {
      // Здесь можно добавить логику подгрузки если нужно
    }
  }, [loadingMore]);

  // Добавляем слушатель события скролла
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Loading scenario
  if (isLoading) {
    return (
      <div className={scss.placeHistory}>
        <div className={scss.noPlacesContainer}>
          <Loader size={48} className={scss.loadingSpinner} />
          <p>{t("Загрузка...", "جار التحميل...", "Loading...")}</p>
        </div>
      </div>
    );
  }

  // Error scenario
  if (error) {
    return (
      <div className={scss.placeHistory}>
        <div className={scss.noPlacesContainer}>
          <ImageOff size={48} />
          <p>{t("Ошибка загрузки данных", "خطأ في تحميل البيانات", "Error loading data")}</p>
        </div>
      </div>
    );
  }

  // Если нет мест с отзывами
  if (!uniquePlaces || uniquePlaces.length === 0) {
    return (
      <div className={scss.placeHistory}>
        <div className={scss.noPlacesContainer}>
          <MapPin size={48} />
          <p>{t("Нет отзывов о местах", "لا توجد مراجعات للأماكن", "No place reviews")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={scss.placeHistory}>
      <div className={scss.list} ref={scrollContainerRef}>
        {uniquePlaces.map((place) => {
          const placeImageId = `place-${place.id}`;
          const placeImageUrl = getImageUrl(place.popular_image);
          const isSelected = selectedPlaceId === place.id;
          
          return (
            <div
              key={place.id}
              className={`${scss.item} ${isSelected ? scss.selectedItem : ""}`}
              onClick={() => setSelectedPlaceId(place.id)}
            >
              {imageError[placeImageId] ? (
                <div className={scss.imageFallback}>
                  <ImageOff size={32} />
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
                  src={placeImageUrl}
                  alt={place.popular_name}
                  width={341}
                  height={270}
                  onError={() => handleImageError(placeImageId)}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              )}
              <div className={scss.block}>
                <h6>{place.popular_name}</h6>
                <div>
                  <Stars rating={place.avg_rating} width={21} height={21} />
                  <span className={scss.review}>
                    {place.rating_count} {t("отзывов", "تقييمات", "reviews")}
                  </span>
                </div>
              </div>
              {imageError[`heart-${place.id}`] ? (
                <div className={scss.heartFallback}>♡</div>
              ) : (
                <Image
                  className={scss.heart}
                  src={imgHeart.src}
                  alt="favorite"
                  width={24}
                  height={24}
                  onError={() => handleImageError(`heart-${place.id}`)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Comments Section */}
      <div className={scss.comentary}>
        {!filteredReviews || filteredReviews.length === 0 ? (
          <div className={scss.noReviews}>
            <p>{t("Нет отзывов для этого места", "لا توجد مراجعات لهذا المكان", "No reviews for this place")}</p>
          </div>
        ) : (
          <div className={scss.people}>
            {filteredReviews.map((review) => {
              const userPictureUrl = getImageUrl(review.client.user_picture) || "/default-user.png";
              
              return (
                <div key={review.id} className={scss.person}>
                  <div className={scss.person_image}>
                    <Image
                      src={userPictureUrl}
                      alt="User"
                      width={42}
                      height={42}
                      className={scss.person_imagess}
                      onError={() => console.error(`Ошибка загрузки аватара пользователя: ${userPictureUrl}`)}
                    />
                    <div className={scss.person_text}>
                      <h3>{`${review.client.first_name} ${review.client.last_name}`}</h3>
                      <p>{review.client.from_user || ""}</p>
                    </div>
                  </div>

                  <div className={scss.text}>
                    <p>{new Date(review.created_date).toLocaleDateString()}</p>
                    <h5>{review.popular_place.popular_name}</h5>
                    <span>{review.comment}</span>
                    {review.review_image && review.review_image.length > 0 && (
                      <div className={scss.imagess_2}>
                        {review.review_image.map((img, index) => {
                          const reviewImageUrl = getImageUrl(img.image);
                          return (
                            <Image
                              key={index}
                              src={reviewImageUrl}
                              alt={`review-image-${index}`}
                              width={100}
                              height={100}
                              className={scss.images_1}
                              onError={() => console.error(`Ошибка загрузки изображения отзыва #${index}: ${reviewImageUrl}`)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceHistory;