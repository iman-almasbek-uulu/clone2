import { FC } from "react";
import scss from "./Stars.module.scss";

interface StarsProps {
  rating?: number;
  width?: number;
  height?: number;
}

const Stars: FC<StarsProps> = ({ rating = 0, width = 16, height = 16 }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <div className={scss.stars} style={ width < 10 ? { gap: '3px' } : {}}>
      {stars.map((star) => (
        <div key={star} style={{ width, height }} className={scss.starContainer}>
          <div
            className={scss.starFill}
            style={{
              width: `${
                star <= rating
                  ? 100
                  : star - rating < 1
                  ? (rating - (star - 1)) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Stars;
