import { FC } from "react";
import styles from "../../Reviews.module.scss";
import Stars from "../../../stars/Stars";
import { REVIEWS } from "@/redux/api/reviews/types";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface StatisticBlockProps {
  reviewStatic?: REVIEWS.StaticReview;
}

const StatisticBlock: FC<StatisticBlockProps> = ({ reviewStatic }) => {
  const totalCount = reviewStatic?.ratingCount || 0;
  const {t} = useTranslate()
  const ratingStats = [
    { label: t("Отлично", "ممتاز", "Excellent"), count: reviewStatic?.excellent || 0 },
    { label: t("Хорошо", "جيد", "Good"), count: reviewStatic?.good || 0 },
    { label: t("Неплохо", "ليس سيئاً", "Not Bad"), count: reviewStatic?.notBad || 0 },
    { label: t("Плохо", "سيء", "Bad"), count: reviewStatic?.bad || 0 },
    { label: t("Ужасно", "سيء للغاية", "Terribly"), count: reviewStatic?.terribly || 0 },
  ];
  const ratingStatsWithPercentage = ratingStats.map((stat) => ({
    ...stat,
    percentage: totalCount ? (stat.count / totalCount) * 100 : 0,
  }));
  return (
    <div className={styles.statsContainer}>
      <div className={`${styles.flex} ${styles.itemsBaseline} ${styles.gap2}`}>
        <span className={styles.ratingValue}>
          {reviewStatic?.avgRating || 0}
        </span>
        <Stars rating={reviewStatic?.avgRating || 0} width={16} height={16} />
        <div className={styles.ratingCount}>{totalCount} {t("Отзывы", "التقييمات", "Reviews")}</div>
      </div>

      <div className={styles.ratingBarContainer}>
        {ratingStatsWithPercentage.map((stat) => (
          <div key={stat.label} className={styles.ratingBar}>
            <span className={styles.barLabel}>{stat.label}</span>
            <div className={styles.barWrapper}>
              <div
                className={styles.bar}
                style={{ width: `auto` }}
              >
                <div
                  className={styles.barFill}
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
              <span className={styles.barCount}>{stat.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticBlock;
