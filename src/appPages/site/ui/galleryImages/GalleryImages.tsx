import React, { useCallback, useEffect, useState } from 'react';
import styles from './GalleryImages.module.scss';
import { ImageModal } from '../imageModal/ImageModal';
import { MdPhotoCamera } from 'react-icons/md';
import Image from 'next/image';
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface ImageGridProps {
  images: {
    id: number;
    image: string;
  }[];
}

// Интерфейс для обработчика ошибок изображения Next.js
interface ImageErrorEvent extends React.SyntheticEvent<HTMLImageElement, Event> {
  currentTarget: HTMLImageElement;
}

const GalleryImages: React.FC<ImageGridProps> = ({ images }) => {
  const { t } = useTranslate();
  // Все хуки объявляем в самом начале компонента
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Используем useCallback для обработчика клавиш
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedImage === null) return;
    
    switch (e.key) {
      case 'Escape':
        setSelectedImage(null);
        break;
      case 'ArrowLeft':
        if (selectedImage > 0) {
          setSelectedImage(selectedImage - 1);
        }
        break;
      case 'ArrowRight':
        if (selectedImage < images.length - 1) {
          setSelectedImage(selectedImage + 1);
        }
        break;
    }
  }, [selectedImage, images.length]);

  // Добавляем и удаляем обработчик событий клавиатуры
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // Проверка наличия изображений
  const hasImages = images && images.length > 0;
  const largeImages = images.slice(0, 2);
  const smallImages = images.slice(2);
  
  // Функция для обработки ошибок загрузки изображений
  const handleImageError = (e: ImageErrorEvent) => {
    const target = e.currentTarget;
    target.src = "https://placehold.co/600x400/e0e0e0/969696?text=Image+Not+Found";
    target.alt = t("Изображение недоступно", "الصورة غير متوفرة", "Image not available");
  };

  const handlePrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  // Группируем маленькие изображения по 4
  const smallImageGroups = [];
  for (let i = 0; i < smallImages.length; i += 4) {
    smallImageGroups.push(smallImages.slice(i, i + 4));
  }

  return (
    <div className={styles.imageGrid}>
      {!hasImages ? (
        <div className={styles.noImagesContainer || ""}>
          <div className={styles.noImagesContent || ""}>
            <MdPhotoCamera size={50} color="#888" />
            <h3>{t("Изображения отсутствуют", "لا توجد صور", "No images available")}</h3>
            <p>{t("В данном разделе пока нет загруженных изображений", "لا توجد صور محملة في هذا القسم حتى الآن", "There are no uploaded images in this section yet")}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Крупные изображения */}
          {selectedImage !== null && (
            <ImageModal
              images={images}
              selectedImage={selectedImage}
              onClose={() => setSelectedImage(null)}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSelectImage={setSelectedImage}
            />
          )}
          {largeImages.map((img) => (
            <div key={img.id} className={`${styles.imageWrapper} ${styles.large}`}>
              <Image
                src={img.image}
                alt={t(`Изображение ${img.id}`, `صورة ${img.id}`, `Image ${img.id}`)}
                className={styles.image}
                width={600}
                height={400}
                style={{ objectFit: 'cover' }}
                loading="lazy"
                onClick={() => setSelectedImage(images.findIndex(el => el.id === img.id))}
                onError={handleImageError}
                unoptimized={true}
              />
            </div>
          ))}
          {images.length > 0 && (
            <button onClick={() => setSelectedImage(0)} className={styles.showImages}>
              <MdPhotoCamera color='#fff' /> {t("Показать все", "عرض الكل", "Show all")} ({images.length})
            </button>
          )}
          {/* Группы по 4 маленьких изображения */}
          {smallImageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className={styles.smallGroup}>
              {group.map((img) => (
                <div key={img.id} className={styles.smallImageWrapper}>
                  <Image
                    src={img.image}
                    alt={t(`Изображение ${img.id}`, `صورة ${img.id}`, `Image ${img.id}`)}
                    className={styles.image}
                    width={300}
                    height={200}
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                    onClick={() => {
                      setSelectedImage(images.findIndex(el => el.id === img.id));
                    }}
                    onError={handleImageError}
                    unoptimized={true}
                  />
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default GalleryImages;