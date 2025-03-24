"use client";
import React, { FC } from "react";
import styles from "./Reviews.module.scss";
import StatisticColumn from "./statisticColumn/StatisticColumn";
import ReviewsColumn from "./reviewsColumn/ReviewsColumn";
import { REVIEWS } from "@/redux/api/reviews/types";

interface ReviewsProps {
  isTab: number;
  isCurrent: number | null;
  reviewStatic?: REVIEWS.StaticReview;
}

const entityMap: Record<number, string> = {
  0: "popular_places",
  1: "hotels",
  2: "kitchen",
  4: "attraction",
};

const Reviews: FC<ReviewsProps> = ({ isTab, isCurrent, reviewStatic }) => {
  const entityType = entityMap[isTab] || "unknown";

  return (
    <div className={styles.content}>
      <h1 className={styles.heading}>Reviews</h1>
      <div className={`${styles.flex} ${styles.column} ${styles.gap6}`}>
        <StatisticColumn
          isCurrent={isCurrent}
          reviewStatic={reviewStatic}
          isTab={isTab}
        />
        <ReviewsColumn
          reviewStatic={reviewStatic}
          entityType={entityType}
          isCurrent={isCurrent}
          isTab={isTab}
        />
      </div>
    </div>
  );
};

export default Reviews;