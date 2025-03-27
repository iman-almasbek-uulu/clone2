"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import scss from "./HotelHistory.module.scss";
import Image from "next/image";
import Stars from "@/appPages/site/ui/stars/Stars";
import imgHeart from "@/assets/images/placeImages/Vector.png";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { useGetMeReviewsQuery } from "@/redux/api/profileHistory";
import { MY_REVIEWS } from "@/redux/api/profileHistory/types";
import { ImageOff, Loader, Hotel } from "lucide-react";

const HotelHistory = () => {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const { data: reviewsResponse, isLoading, error } = useGetMeReviewsQuery();
  
  const { t } = useTranslate();
  const [loadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Состояние для хранения ID выбранного отеля
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  
  // Функция для формирования правильного URL изображения
  const getImageUrl = useCallback((url: string) => {
    if (!url) return "/default-image.png"; // Запасное изображение по умолчанию
    
    return url.startsWith('http') 
      ? url 
      : `${process.env.NEXT_PUBLIC_API_URL || ''}${url.startsWith('/') ? url : `/${url}`}`;
  }, []);
  
  // Фильтруем только отзывы об отелях
  const hotelReviews = useMemo(() => {
    // Проверяем, что ответ API содержит поле data и это массив
    if (!reviewsResponse?.data || !Array.isArray(reviewsResponse.data)) {
      return [];
    }
    
    // Фильтруем массив, оставляя только отзывы о отелях
    return reviewsResponse.data.filter(review => 
      review && typeof review === 'object' && 'hotel' in review
    ) as MY_REVIEWS.HotelReview[];
  }, [reviewsResponse]);
  
  // Фильтруем отзывы для выбранного отеля
  const filteredReviews = useMemo(() => {
    if (!selectedHotelId) return hotelReviews;
    
    return hotelReviews.filter(review => review.hotel.id === selectedHotelId);
  }, [hotelReviews, selectedHotelId]);
  
  // Получаем список уникальных отелей из отзывов
  const uniqueHotels = useMemo(() => {
    if (!hotelReviews.length) return [];
    
    // Создаем Map для хранения уникальных отелей по ID
    const hotelsMap = new Map<number, MY_REVIEWS.Hotel>();
    
    // Добавляем каждый отель в Map, что автоматически исключит дубликаты
    hotelReviews.forEach(review => {
      if (!hotelsMap.has(review.hotel.id)) {
        hotelsMap.set(review.hotel.id, review.hotel);
      }
    });
    
    // Преобразуем Map обратно в массив
    return Array.from(hotelsMap.values());
  }, [hotelReviews]);
  
  // При первой загрузке выбираем первый отель
  useEffect(() => {
    if (uniqueHotels.length > 0 && !selectedHotelId) {
      setSelectedHotelId(uniqueHotels[0].id);
    }
  }, [uniqueHotels, selectedHotelId]);
  
  // Обработчики событий
  const handleImageError = useCallback((id: string) => {
    console.error(`Ошибка загрузки изображения с ID: ${id}`);
    setImageError(prev => ({ ...prev, [id]: true }));
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
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Loading scenario
  if (isLoading) {
    return (
      <div className={scss.hotelHistory}>
        <div className={scss.noHotelsContainer}>
          <Loader size={48} className={scss.loadingSpinner} />
          <p>{t("Загрузка...", "جار التحميل...", "Loading...")}</p>
        </div>
      </div>
    );
  }

  // Error scenario
  if (error) {
    return (
      <div className={scss.hotelHistory}>
        <div className={scss.noHotelsContainer}>
          <ImageOff size={48} />
          <p>{t("Ошибка загрузки данных", "خطأ في تحميل البيانات", "Error loading data")}</p>
        </div>
      </div>
    );
  }

  // Если нет отелей с отзывами
  if (!uniqueHotels || uniqueHotels.length === 0) {
    return (
      <div className={scss.hotelHistory}>
        <div className={scss.noHotelsContainer}>
          <Hotel size={48} />
          <p>{t("Нет отзывов об отелях", "لا توجد مراجعات للفنادق", "No hotel reviews")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={scss.hotelHistory}>
      <div className={scss.list} ref={scrollContainerRef}>
        {uniqueHotels.map((hotel) => {
          const isSelected = selectedHotelId === hotel.id;
          const hotelImageId = `hotel-${hotel.id}`;
          const hotelImageUrl = getImageUrl(hotel.main_image);
          
          return (
            <div 
              key={hotel.id} 
              className={`${scss.item} ${isSelected ? scss.selectedItem : ''}`}
              onClick={() => setSelectedHotelId(hotel.id)}
            >
              {imageError[hotelImageId] ? (
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
                  src={hotelImageUrl}
                  alt={hotel.name}
                  width={341}
                  height={270}
                  onError={() => handleImageError(hotelImageId)}
                  
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
              {imageError[`heart-${hotel.id}`] ? (
                <div className={scss.heartFallback}>♡</div>
              ) : (
                <Image
                  className={scss.heart}
                  src={imgHeart.src}
                  alt="favorite"
                  width={24}
                  height={24}
                  onError={() => handleImageError(`heart-${hotel.id}`)}
                />
              )}
              
            </div>
          );
        })}
        {loadingMore && (
          <div className={scss.loadingItem}>
            <div className={scss.loadingSpinner}>
              <span className={scss.spinnerIcon}>⟳</span>
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className={scss.comentary}>
        {!filteredReviews || filteredReviews.length === 0 ? (
          <div className={scss.noReviews}>
            <p>{t("Нет отзывов для этого отеля", "لا توجد مراجعات لهذا الفندق", "No reviews for this hotel")}</p>
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
                    <h5>{review.hotel.name}</h5>
                    <span>{review.comment}</span>
                    {review.hotel_review_image && review.hotel_review_image.length > 0 && (
                      <div className={scss.imagess_2}>
                        {review.hotel_review_image.map((img, index) => {
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

export default HotelHistory;