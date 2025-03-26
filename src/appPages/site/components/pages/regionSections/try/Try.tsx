"use client";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "./Try.module.scss";
import { useState, useRef, useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import { REGION_LIST } from "@/redux/api/regions/types";
import { ImageOff, Loader } from "lucide-react";

interface TryProps {
  region: REGION_LIST.RegionResponse | null;
  isLoading?: boolean;
  isError?: boolean;
}

const Try: React.FC<TryProps> = ({ region, isLoading, isError }) => {
  const { t } = useTranslate();
  const [currentContent, setCurrentContent] = useState<number>(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentContent]);

  const handleNext = () => {
    if (region?.What_to_try && currentContent < region.What_to_try.length - 1) {
      setCurrentContent(currentContent + 1);
    }
  };

  const handlePrev = () => {
    if (currentContent > 0) {
      setCurrentContent(currentContent - 1);
    }
  };

  if (isLoading) {
    return (
      <section id={scss.Try}>
        <div className="container">
          <div className={scss.loadingContainer}>
            <Loader size={48} className={scss.loadingSpinner} />
            <p>{t("Загрузка...", "جار التحميل...", "Loading...")}</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !region) {
    return (
      <section id={scss.Try}>
        <div className="container">
          <div className={scss.errorContainer}>
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
      </section>
    );
  }

  if (!region.What_to_try || region.What_to_try.length === 0) {
    return (
      <section id={scss.Try}>
        <div className="container">
          <div className={scss.emptyContainer}>
            <ImageOff size={48} />
            <p>
              {t(
                "Нет данных о блюдах",
                "لا توجد بيانات عن الأطباق",
                "No dishes data available"
              )}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentItem = region.What_to_try[currentContent];

  return (
    <section id={scss.Try}>
      <div className="container">
        <h2>
          {t("Что попробовать в ", "ماذا تحاول في ", "What to try in ")}
          {region.region_name}?
        </h2>
        <div className={scss.content}>
          <div className={scss.item}>
            <h4>{currentItem?.to_name}</h4>
            <div className={scss.contentWrapper} ref={contentRef}>
              <p>{currentItem?.first_description}</p>
            </div>
          </div>
          <div className={scss.imgs}>
            <div className={scss.mainImage}>
              {currentItem?.image && !imgError[currentContent] ? (
                <Image
                  src={currentItem.image}
                  alt={currentItem.to_name || "Dish image"}
                  width={500}
                  height={220}
                  style={{ objectFit: "cover" }}
                  onError={() =>
                    setImgError((prev) => ({ ...prev, [currentContent]: true }))
                  }
                />
              ) : (
                <div className={scss.imagePlaceholder}>
                  <ImageOff size={64} />
                  <p>
                    {t(
                      "Изображение недоступно",
                      "الصورة غير متوفرة",
                      "Image not available"
                    )}
                  </p>
                </div>
              )}
            </div>
            <div className={scss.thumbnails}>
              <div className={scss.bg}>
                {currentItem?.image && !imgError[currentContent] ? (
                  <Image
                    src={currentItem.image}
                    alt={currentItem.to_name || "Dish image"}
                    width={250}
                    height={85}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className={scss.imagePlaceholderSmall}>
                    <ImageOff size={32} />
                  </div>
                )}
              </div>
              {region.What_to_try.map((el, i) =>
                i !== currentContent ? (
                  <div key={i} className={scss.bg}>
                    <div className={scss.overlay}></div>
                    {el.image && !imgError[i] ? (
                      <Image
                        src={el.image}
                        alt={el.to_name || "Dish image"}
                        width={250}
                        height={85}
                        style={{ objectFit: "cover" }}
                        onError={() =>
                          setImgError((prev) => ({ ...prev, [i]: true }))
                        }
                      />
                    ) : (
                      <div className={scss.imagePlaceholderSmall}>
                        <ImageOff size={32} />
                      </div>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </div>
          <div className={scss.item}>
            <h4>
              {t(
                "Что входит в состав блюда",
                "ما الذي يحتويه الطبق",
                "What is included in the dish"
              )}
            </h4>
            <div className={scss.contentWrapper}>
              <p>{currentItem?.second_description}</p>
            </div>
          </div>
        </div>
        <div className={scss.tabs}>
          <button
            disabled={currentContent === 0}
            onClick={handlePrev}
            aria-label="Previous item"
          >
            <LeftOutlined style={{ fontSize: "12px", fontWeight: "bold" }} />
          </button>
          <div className={scss.index}>
            {region.What_to_try.map((_, i) => (
              <button
                key={i}
                style={
                  i === currentContent
                    ? {
                        background: "#004A60",
                        borderRadius: "30px",
                        color: "white",
                      }
                    : undefined
                }
                onClick={() => setCurrentContent(i)}
                aria-label={`Go to item ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            disabled={currentContent === region.What_to_try.length - 1}
            onClick={handleNext}
            aria-label="Next item"
          >
            <RightOutlined style={{ fontSize: "12px" }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Try;