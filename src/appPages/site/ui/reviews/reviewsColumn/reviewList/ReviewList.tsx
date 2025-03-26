import { FC, useState } from "react";
import styles from "./ReviewList.module.scss";
import { REVIEWS } from "@/redux/api/reviews/types";
import ReviewCard from "../reviewCard/ReviewCard";

interface ReviewListProps {
  reviews: REVIEWS.Review[];
  onReplyClick: (reviewId: number) => void;
}

const REPLIES_TO_SHOW = 3;

const ReviewList: FC<ReviewListProps> = ({ reviews, onReplyClick }) => {
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  const toggleReplies = (reviewId: number) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  return (
    <div className={styles.reviewList}>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onReplyClick={onReplyClick}
          expandedReplies={expandedReplies[review.id] || false}
          toggleReplies={toggleReplies}
          repliesToShow={REPLIES_TO_SHOW}
        />
      ))}
    </div>
  );
};

export default ReviewList;