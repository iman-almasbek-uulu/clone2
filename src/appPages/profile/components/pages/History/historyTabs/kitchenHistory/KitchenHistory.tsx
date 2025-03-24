// appPages/profile/components/pages/History/historyTabs/kitchenHistory/KitchenHistory.tsx
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import scss from "./KitchenHistory.module.scss";
import Image from "next/image";
import Stars from "@/appPages/site/ui/stars/Stars";
import { Coffee, ImageOff } from "lucide-react";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { useGetMeReviewsQuery } from "@/redux/api/profileHistory";
import { MY_REVIEWS } from "@/redux/api/profileHistory/types";
import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

const KitchenHistory = () => {
  const { t } = useTranslate();
  const { data: reviewsResponse, isLoading, error } = useGetMeReviewsQuery();

  // Состояние для хранения ID выбранного ресторана
  const [selectedKitchenId, setSelectedKitchenId] = useState<number | null>(
    null
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Функция для формирования правильного URL изображения
  const getImageUrl = useCallback((url: string | null | undefined) => {
    if (!url) return "/default-image.png"; // Запасное изображение по умолчанию
    
    return url.startsWith('http') 
      ? url 
      : `${process.env.NEXT_PUBLIC_API_URL || ''}${url.startsWith('/') ? url : `/${url}`}`;
  }, []);

  // Фильтруем только отзывы о ресторанах
  const kitchenReviews = useMemo(() => {
    // Проверяем, что ответ API содержит поле data и это массив
    if (!reviewsResponse?.data || !Array.isArray(reviewsResponse.data)) {
      return [];
    }

    // Фильтруем массив, оставляя только отзывы о ресторанах
    return reviewsResponse.data.filter(
      (review) => review && typeof review === "object" && "kitchen" in review
    ) as MY_REVIEWS.KitchenReview[];
  }, [reviewsResponse]);

  // Фильтруем отзывы для выбранного ресторана
  const filteredReviews = useMemo(() => {
    if (!selectedKitchenId) return kitchenReviews;

    return kitchenReviews.filter(
      (review) => review.kitchen.id === selectedKitchenId
    );
  }, [kitchenReviews, selectedKitchenId]);

  // Получаем список уникальных ресторанов из отзывов
  const uniqueKitchens = useMemo(() => {
    if (!kitchenReviews.length) return [];

    // Создаем Map для хранения уникальных ресторанов по ID
    const kitchensMap = new Map<number, MY_REVIEWS.Kitchen>();

    // Добавляем каждый ресторан в Map, что автоматически исключит дубликаты
    kitchenReviews.forEach((review) => {
      if (!kitchensMap.has(review.kitchen.id)) {
        kitchensMap.set(review.kitchen.id, review.kitchen);
      }
    });

    // Преобразуем Map обратно в массив
    return Array.from(kitchensMap.values());
  }, [kitchenReviews]);

  // При первой загрузке выбираем первый ресторан
  useEffect(() => {
    if (uniqueKitchens.length > 0 && !selectedKitchenId) {
      setSelectedKitchenId(uniqueKitchens[0].id);
    }
  }, [uniqueKitchens, selectedKitchenId]);

  // Функция для обработки ошибок загрузки изображений
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.src = "https://placehold.co/600x400/e0e0e0/969696?text=No+Image";
      target.alt = "Image not available";
      target.style.objectFit = "contain";
      target.style.backgroundColor = "#f5f5f5";
    },
    []
  );

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    if (scrollWidth - (scrollLeft + clientWidth) < 200) {
      // Здесь можно добавить логику подгрузки при необходимости
    }
  }, []);

  // Добавляем слушатель события скролла
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Рендер состояний ошибки и загрузки
  if (error) {
    return (
      <div className={scss.cafes}>
        <div className={scss.noCafesContainer}>
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

  if (isLoading) {
    return (
      <div className={scss.cafes}>
        <div className={scss.noCafesContainer}>
          <div className={scss.loadingSpinner}></div>
          <p>{t("Загрузка...", "جار التحميل...", "Loading...")}</p>
        </div>
      </div>
    );
  }

  if (!uniqueKitchens.length) {
    return (
      <div className={scss.cafes}>
        <div className={scss.noCafesContainer}>
          <Coffee size={48} />
          <p>
            {t(
              "Вы еще не оставили отзывов о ресторанах",
              "لم تترك بعد أي مراجعات للمطاعم",
              "You haven't reviewed any restaurants yet"
            )}
          </p>
        </div>
      </div>
    );
  }

  // Рендер списка ресторанов и отзывов
  return (
    <div className={scss.kitchenHistory}>
      {/* Список ресторанов */}
      <div className={scss.cafes}>
        <div className={scss.list} ref={scrollContainerRef}>
          {uniqueKitchens.map((kitchen) => {
            const kitchenImageUrl = getImageUrl(kitchen.main_image);
            
            
            return (
              <div
                onClick={() => setSelectedKitchenId(kitchen.id)}
                key={kitchen.id}
                className={`${scss.item} ${
                  selectedKitchenId === kitchen.id ? scss.selectedItem : ""
                }`}
              >
                <Image
                  src={kitchenImageUrl}
                  alt={kitchen.kitchen_name}
                  width={280}
                  height={152}
                  unoptimized
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "152px",
                  }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => handleImageError(e)}
                />
                <div className={scss.info}>
                  <h6>{kitchen.kitchen_name}</h6>
                  <div className={scss.stars_review}>
                    <Stars
                      rating={kitchen.average_rating}
                      width={12}
                      height={12}
                    />
                    <p>Reviews: {kitchen.rating_count}</p>
                  </div>
                  <div className={scss.prices}>
                    {kitchen.type_of_cafe && kitchen.type_of_cafe.length > 0 
                      ? kitchen.type_of_cafe.slice(0, 3).join(", ")
                      : "Restaurant"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Отзывы о выбранном ресторане */}
      <div className={scss.comentary}>
        {!filteredReviews || filteredReviews.length === 0 ? (
          <div className={scss.noReviews}>
            <p>
              {t(
                "Нет отзывов для этого ресторана",
                "لا توجد مراجعات لهذا المطعم",
                "No reviews for this restaurant"
              )}
            </p>
          </div>
        ) : (
          <div className={scss.people}>
            {filteredReviews.map((review) => {
              const userPictureUrl = getImageUrl(review.client.user_picture);
              
              return (
                <div key={review.id} className={scss.person}>
                  <div className={scss.person_image}>
                    <Space direction="vertical" size={20}>
                      <Space wrap size={20}>
                        <Avatar
                          size={47}
                          icon={
                            review.client.user_picture ? (
                              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                                <Image
                                  src={userPictureUrl}
                                  alt="avatar"
                                  width={47}
                                  height={47}
                                  style={{
                                    objectFit: "cover",
                                  }}
                                  unoptimized={true}
                                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => handleImageError(e)}
                                />
                              </div>
                            ) : (
                              <UserOutlined />
                            )
                          }
                        />
                      </Space>
                    </Space>
                    <div className={scss.person_text}>
                      <h3>{`${review.client.first_name} ${review.client.last_name}`}</h3>
                      <p>{review.client.from_user || ""}</p>
                    </div>
                  </div>

                  <div className={scss.text}>
                    <p>{new Date(review.created_date).toLocaleDateString()}</p>
                    <h5>{review.kitchen.kitchen_name}</h5>
                    <span>{review.comment}</span>

                    {/* Изображения в отзыве */}
                    {review.kitchen_review_image && review.kitchen_review_image.length > 0 && (
                      <div className={scss.imagess_2}>
                        {review.kitchen_review_image.map((img, index) => {
                          const reviewImageUrl = getImageUrl(img.image);
                          return (
                            <Image
                              key={index}
                              src={reviewImageUrl}
                              alt={`review-image-${index}`}
                              width={100}
                              height={100}
                              className={scss.images_1}
                              onError={(e: React.SyntheticEvent<HTMLImageElement>) => handleImageError(e)}
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

export default KitchenHistory;