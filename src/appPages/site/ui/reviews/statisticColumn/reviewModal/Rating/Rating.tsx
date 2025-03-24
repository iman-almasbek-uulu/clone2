import React, { useState } from "react";
import styles from "./Rating.module.scss";

interface RatingCircleProps {
  value: number; // Текущее значение рейтинга
  onChange: (value: number) => void; // Функция для изменения рейтинга
}

const Rating: React.FC<RatingCircleProps> = ({ value, onChange }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null); // Состояние при наведении

  const handleClick = (newValue: number) => {
    onChange(newValue); // Устанавливаем новое значение рейтинга
  };

  const handleMouseEnter = (newValue: number) => {
    setHoverValue(newValue); // Устанавливаем значение при наведении
  };

  const handleMouseLeave = () => {
    setHoverValue(null); // Сбрасываем значение при уходе курсора
  };

  return (
    <div className={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((circleValue) => {
        const isActive = (hoverValue || value) >= circleValue; // Определяем, активен ли круг
        return (
          <button
            key={circleValue}
            className={`${styles.ratingCircle} ${
              isActive ? styles.active : ""
            }`}
            onClick={() => handleClick(circleValue)}
            onMouseEnter={() => handleMouseEnter(circleValue)}
            onMouseLeave={handleMouseLeave}
          >
          </button>
        );
      })}
    </div>
  );
};

export default Rating;