import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import scss from './AttractionHistory.module.scss';
import { ImageOff, MapPin, Loader } from "lucide-react";
import Stars from "@/appPages/site/ui/stars/Stars";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { useGetMeReviewsQuery } from "@/redux/api/profileHistory";
import { MY_REVIEWS } from "@/redux/api/profileHistory/types";

const AttractionHistory = () => {
  const { t } = useTranslate();
  const { data: reviewsResponse, isLoading, error } = useGetMeReviewsQuery();
  const [imgErrors, setImgErrors] = useState<{[key: number]: boolean}>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Состояние для хранения ID выбранной достопримечательности
  const [selectedAttractionId, setSelectedAttractionId] = useState<number | null>(null);
  
  // Функция для формирования правильного URL изображения
  const getImageUrl = useCallback((url: string | null | undefined) => {
    if (!url) return "/default-image.png"; // Запасное изображение по умолчанию
    
    return url.startsWith('http') 
      ? url 
      : `${process.env.NEXT_PUBLIC_API_URL || ''}${url.startsWith('/') ? url : `/${url}`}`;
  }, []);
  
  // Фильтруем только отзывы о достопримечательностях
  const attractionReviews = useMemo(() => {
    // Проверяем, что ответ API содержит поле data и это массив
    if (!reviewsResponse?.data || !Array.isArray(reviewsResponse.data)) {
      return [];
    }
    
    // Фильтруем массив, оставляя только отзывы о достопримечательностях
    return reviewsResponse.data.filter(review => 
      review && typeof review === 'object' && 'attractions' in review
    ) as MY_REVIEWS.AttractionReview[];
  }, [reviewsResponse]);
  
  // Фильтруем отзывы для выбранной достопримечательности
  const filteredReviews = useMemo(() => {
    if (!selectedAttractionId) return attractionReviews;
    
    return attractionReviews.filter(review => review.attractions.id === selectedAttractionId);
  }, [attractionReviews, selectedAttractionId]);
  
  // Получаем список уникальных достопримечательностей из отзывов
  const uniqueAttractions = useMemo(() => {
    if (!attractionReviews.length) return [];
    
    // Создаем Map для хранения уникальных достопримечательностей по ID
    const attractionsMap = new Map<number, MY_REVIEWS.Attraction>();
    
    // Добавляем каждую достопримечательность в Map, что автоматически исключит дубликаты
    attractionReviews.forEach(review => {
      if (!attractionsMap.has(review.attractions.id)) {
        attractionsMap.set(review.attractions.id, review.attractions);
      }
    });
    
    // Преобразуем Map обратно в массив
    return Array.from(attractionsMap.values());
  }, [attractionReviews]);
  
  // При первой загрузке выбираем первую достопримечательность
  useEffect(() => {
    if (uniqueAttractions.length > 0 && !selectedAttractionId) {
      setSelectedAttractionId(uniqueAttractions[0].id);
    }
  }, [uniqueAttractions, selectedAttractionId]);

  // Обработка ошибок загрузки изображений
  const handleImageError = useCallback((id: number) => {
    console.error(`Ошибка загрузки изображения для достопримечательности ${id}`);
    setImgErrors(prev => ({...prev, [id]: true}));
  }, []);

  // Функция для горизонтального скролла
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    // Если мы близко к концу скролла
    if (scrollWidth - (scrollLeft + clientWidth) < 200) {
      // Здесь можно добавить логику подгрузки если нужно
    }
  }, []);

  // Добавляем слушатель события скролла
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Loading scenario
  if (isLoading) {
    return (
      <div className={scss.attractions}>
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
      <div className={scss.attractions}>
        <div className={scss.noAttractionsContainer}>
          <ImageOff size={48} />
          <p>{t("Ошибка загрузки данных", "خطأ في تحميل البيانات", "Error loading data")}</p>
        </div>
      </div>
    );
  }

  // Если нет достопримечательностей с отзывами
  if (!uniqueAttractions || uniqueAttractions.length === 0) {
    return (
      <div className={scss.attractions}>
        <div className={scss.noAttractionsContainer}>
          <MapPin size={48} />
          <p>{t("Нет отзывов о достопримечательностях", "لا توجد مراجعات للمعالم السياحية", "No attraction reviews")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={scss.attractionHistory}>
      {/* Список достопримечательностей */}
      <div className={scss.attractions}>
        <div className={scss.list} ref={scrollContainerRef}>
          {uniqueAttractions.map((attraction) => {
            const attractionImageUrl = getImageUrl(attraction.main_image);
            
            return (
              <div 
                key={attraction.id} 
                className={`${scss.item} ${selectedAttractionId === attraction.id ? scss.selectedItem : ''}`}
                onClick={() => setSelectedAttractionId(attraction.id)}
              >
                <div className={scss.imageContainer}>
                  {imgErrors[attraction.id] || !attraction.main_image ? (
                    <div className={scss.imgNotFound}>
                      <ImageOff size={32} />
                      <p>{t("Изображение не найдено", "الصورة غير موجودة", "Image not found")}</p>
                    </div>
                  ) : (
                    <Image
                      src={attractionImageUrl}
                      alt={attraction.attraction_name}
                      width={281}
                      height={152}
                      unoptimized
                      style={{
                        objectFit: "cover",
                        backgroundColor: "#f0f0f0",
                      }}
                      onError={() => handleImageError(attraction.id)}
                    />
                  )}
                </div>
                <div className={scss.info}>
                  <h6 className={scss.title}>{attraction.attraction_name}</h6>
                  <div className={scss.stars_review}>
                    <Stars rating={attraction.avg_rating} width={16} height={16} />
                    <p>Reviews: {attraction.rating_count}</p>
                  </div>
                  <div className={scss.prices}>
                    {attraction.region_category || "Local Sights"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Отзывы о выбранной достопримечательности */}
      <div className={scss.comentary}>
        {filteredReviews.length === 0 ? (
          <div className={scss.noReviews}>
            <p>{t("Нет отзывов для этой достопримечательности", "لا توجد مراجعات لهذا المعلم", "No reviews for this attraction")}</p>
          </div>
        ) : (
          <div className={scss.people}>
            {filteredReviews.map(review => {
              const userPictureUrl = getImageUrl(review.client.user_picture);
              
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
                    <h5>{review.attractions.attraction_name}</h5>
                    <span>{review.comment}</span>
                    
                    {/* Изображения в отзыве */}
                    {review.attraction_review_image && review.attraction_review_image.length > 0 && (
                      <div className={scss.imagess_2}>
                        {review.attraction_review_image.map((img, index) => {
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

export default AttractionHistory;