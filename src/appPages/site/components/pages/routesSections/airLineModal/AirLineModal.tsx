import React, { useEffect, ReactNode } from 'react';
import styles from './AirLineModal.module.scss';
import { Globe, Plane, X } from 'lucide-react';
import { useGetAirTicketsQuery } from '@/redux/api/routes';
import useTranslate from "@/appPages/site/hooks/translate/translate";
import Image from 'next/image';

// Типы данных
interface AirlineTicket {
  id: number;
  ticket: number;
  directions: string;
}

interface AirlineData {
  id: number;
  name: string;
  description: string;
  website: string;
  logo: string | null;
  airline_tickets: AirlineTicket[];
}

interface AirlineCardProps {
  airline: AirlineData;
}

interface AirlineModalProps {
  setModalWindow: (isOpen: boolean) => void;
}

// Определяем тип для события ошибки загрузки изображения
interface ImageErrorEvent extends React.SyntheticEvent<HTMLImageElement> {
  currentTarget: HTMLImageElement;
}

// Стили для заглушки логотипа
const logoFallbackStyles = `
  .logoFallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-weight: bold;
    font-size: 1.5rem;
    color: white;
  }
`;

/**
 * Компонент карточки авиакомпании
 */
const AirlineCard: React.FC<AirlineCardProps> = ({ airline }) => {
  const { t } = useTranslate();

  /**
   * Возвращает класс логотипа на основе ID авиакомпании
   */
  const getLogoClass = (id: number): string => {
    const classes = ['logoRed', 'logoGreen', 'logoBlue', 'logoPurple'];
    return classes[id % classes.length];
  };

  /**
   * Генерирует текст для заглушки логотипа
   */
  const getLogoText = (name: string): string => {
    const words = name.split(' ');
    if (words.length > 1) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  };

  /**
   * Рендерит заглушку логотипа с инициалами
   */
  const renderLogoFallback = (name: string): ReactNode => {
    const logoText = getLogoText(name);
    return (
      <div className={styles.logoFallback}>
        {logoText}
      </div>
    );
  };

  /**
   * Обработчик ошибки загрузки изображения
   */
  const handleImageError = (e: ImageErrorEvent): void => {
    e.currentTarget.style.display = 'none';
    const parent = e.currentTarget.parentElement;
    if (parent) {
      parent.appendChild(document.createTextNode(getLogoText(airline.name)));
    }
  };

  return (
    <div className={styles.airlineCard}>
      {/* Блок с логотипом */}
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <span className={`${styles.logoText} ${styles[getLogoClass(airline.id)]}`}>
            {airline.logo ? (
              <Image 
                src={airline.logo} 
                alt={airline.name} 
                width={100}
                height={40}
                style={{ objectFit: 'contain' }}
                onError={handleImageError}
                unoptimized={true}
              />
            ) : renderLogoFallback(airline.name)}
          </span>
        </div>
      </div>
      
      {/* Основная информация */}
      <div className={styles.contentRow}>
        {/* Название авиакомпании */}
        <div className={styles.nameColumn}>
          <h2 className={styles.airlineName}>
            {airline.name}
          </h2>
        </div>
        
        {/* Описание авиакомпании */}
        <div className={styles.descriptionColumn}>
          <p className={styles.description}>
            {airline.description}
          </p>
        </div>
        
        {/* Направления */}
        <div className={styles.destinationsColumn}>
          <h3 className={styles.destinationsTitle}>
            <Plane className={styles.planeIcon} />
            {t("Направления:", "الاتجاهات:", "Destinations:")}
          </h3>
          <div className={styles.destinationsList}>
            {airline.airline_tickets && airline.airline_tickets.map((ticket) => (
              <div key={ticket.id} className={styles.destinationTag}>
                <Globe className={styles.destinationIcon} />
                <span>{ticket.directions}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Кнопка "Подробнее" */}
      <div className={styles.buttonContainer}>
        <a 
          href={airline.website} 
          className={styles.button} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {t("Подробнее", "المزيد", "More Details")}
        </a>
      </div>
    </div>
  );
};

/**
 * Модальное окно со списком авиакомпаний
 */
const AirlineModal: React.FC<AirlineModalProps> = ({ setModalWindow }) => {
  const { t } = useTranslate();
  const { data } = useGetAirTicketsQuery();
  
  // Добавляем стили для заглушки логотипа при монтировании
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = logoFallbackStyles;
    document.head.appendChild(styleElement);
    
    // Удаляем стили при размонтировании компонента
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Обработчик закрытия модального окна
  const handleClose = (): void => {
    setModalWindow(false);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Шапка модального окна */}
        <div className={styles.modalHeader}>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
          >
            <X />
          </button>
        </div>
        
        {/* Основной контент */}
        <div className={styles.modalContent}>
          <h1 className={styles.modalTitle}>
            {t("Каталог авиакомпаний", "كتالوج شركات الطيران", "Airline Catalog")}
          </h1>
          
          {/* Список авиакомпаний */}
          <div className={styles.airlinesList}>
            {data && Array.isArray(data) && data.map((airline: AirlineData) => (
              <AirlineCard 
                key={airline.id} 
                airline={airline} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirlineModal;