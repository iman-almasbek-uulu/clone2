"use client";
import { useState } from "react";
import styles from "../culture/Culture.module.scss";
import Image from "next/image";
import { useGetCultureListQuery } from "@/redux/api/home";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { ArrowRightIcon, ImageOff, Loader, History } from "lucide-react";
import Link from "next/link";

const Culture: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imgError, setImgError] = useState(false);
  const { t } = useTranslate();
  const { data: slides = [], isError, isLoading } = useGetCultureListQuery();
  const handleNext = () => {
    if (slides.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      setImgError(false); // Reset image error when changing slides
    }
  };

  const handlePrev = () => {
    if (slides.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      );
      setImgError(false); // Reset image error when changing slides
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div id={styles.Sliders}>
        <div className="container">
          <div className={styles.loadingContainer}>
            <Loader size={48} className={styles.loadingSpinner} />
            <p>{t("Загрузка...", "جار التحميل...", "Loading...")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div id={styles.Sliders}>
        <div className="container">
          <div className={styles.errorContainer}>
            <ImageOff size={48} />
            <p>{t("Ошибка загрузки данных", "خطأ في تحميل البيانات", "Error loading data")}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty data state
  if (!slides || slides.length === 0) {
    return (
      <div id={styles.Sliders}>
        <div className="container">
          <div className={styles.emptyContainer}>
            <History size={48} />
            <p>{t("Нет данных о культуре", "لا توجد بيانات ثقافية", "No culture data available")}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <>
      <div id={styles.Sliders}>
        <div className="container">
          <div className={styles.slider}>
            <div
              className={styles.slide}
              aria-live="polite"
              aria-label={`Slide ${currentIndex + 1} of ${slides.length}`}
            >
              {(currentSlide.culture_image && !imgError) ? (
                <Image
                  className={styles.image}
                  src={currentSlide.culture_image}
                  alt={currentSlide.culture_name}
                  width={805}
                  height={546}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <ImageOff size={64} />
                  <p>{t("Изображение недоступно", "الصورة غير متوفرة", "Image not available")}</p>
                </div>
              )}
            </div>

            <div className={styles.content}>
              <h2>{currentSlide.culture_name}</h2>
              <p>
                {currentSlide.culture_description || 
                  t("Описание отсутствует", "الوصف غير متوفر", "No description available")}
              </p>

              <Link href={`/culture/${currentSlide.culture.replaceAll(" ", "_").toLowerCase()}`} className={styles.butt}>
                {t("Подробнее", "المزيد", "More")}{" "}
                <ArrowRightIcon className={styles.icon} size={16} />
              </Link>
            </div>
          </div>
          
          {slides.length > 1 && (
            <div className={styles.arrowBlock}>
              <div className={styles.arrowbtn}>
                <button
                  className={styles.prev}
                  onClick={handlePrev}
                  aria-label="Previous slide"
                >
                  ❮
                </button>
                {slides.map((el, index) => (
                  <span
                    style={currentIndex === index ? {background: "#3c5f63"} : {}}
                    key={el.id}
                    className={currentIndex === index ? styles.active : ""}
                    onClick={() => {
                      setCurrentIndex(index);
                      setImgError(false); // Reset image error when changing slides
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index + 1}
                  </span>
                ))}
                <button
                  className={styles.next}
                  onClick={handleNext}
                  aria-label="Next slide"
                >
                  ❯
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Culture;