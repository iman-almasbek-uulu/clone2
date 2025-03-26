"use client";
import { FC, useState, useEffect, useRef } from "react";
import styles from "./ReviewsColumn.module.scss";
import { FilterModal } from "./filterModal/FilterModal";
import { useGetReviewsQuery } from "@/redux/api/reviews";
import { REVIEWS } from "@/redux/api/reviews/types";
import ReviewModal from "../statisticColumn/reviewModal/ReviewModal";
import { useGetMeQuery } from "@/redux/api/auth";
import { useRouter } from "next/navigation";
import ReviewSearchBar from "./reviewSearchBar/ReviewSearchBar";
import ReviewList from "./reviewList/ReviewList";
import Pagination from "./pagination/Pagination";

interface ReviewsColumnProps {
  entityType: string;
  isCurrent: number | null;
  reviewStatic?: REVIEWS.StaticReview;
  isTab: number;
}

const REVIEWS_PER_PAGE = 4;

const ReviewsColumn: FC<ReviewsColumnProps> = ({
  entityType,
  isCurrent,
  reviewStatic,
  isTab,
}) => {
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [dataReviews, setDataReviews] = useState<REVIEWS.Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<string | undefined>();
  const [monthFilter, setMonthFilter] = useState<string | undefined>();
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | undefined>();
  const reviewsColumnRef = useRef<HTMLDivElement>(null);
  const { data: reviewsData } = useGetReviewsQuery({
    entityType,
    rating: ratingFilter,
    month: monthFilter,
    search: searchFilter,
  });
  const { status } = useGetMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (reviewsData) {
      const filteredReviews = reviewsData.filter((review) =>
        String(review.entityId) === String(isCurrent)
      );
      const sortedReviews = filteredReviews.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setDataReviews(sortedReviews);
      setCurrentPage(1);
    } else {
      setDataReviews([]);
    }
  }, [reviewsData, isCurrent, entityType]);

  const applyFilters = (rating?: string, month?: string) => {
    setRatingFilter(rating);
    setMonthFilter(month);
  };

  const handleReplyClick = (reviewId: number) => {
    if (status === "rejected") {
      router.push("/auth/sign-in");
    } else if (status === "fulfilled") {
      setSelectedReviewId(reviewId);
      setShowReplyModal(true);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (reviewsColumnRef.current) {
      reviewsColumnRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const totalPages = Math.ceil(dataReviews.length / REVIEWS_PER_PAGE);
  const currentReviews = dataReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  return (
    <div className={styles.reviewsColumn} ref={reviewsColumnRef}>
      <ReviewSearchBar
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        setIsShowFilter={setIsShowFilter}
      />
      {isShowFilter && (
        <FilterModal
          reviewStatic={reviewStatic}
          setIsShow={setIsShowFilter}
          onApply={applyFilters}
        />
      )}
      <ReviewList
        reviews={currentReviews}
        onReplyClick={handleReplyClick}
      />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {showReplyModal && (
        <ReviewModal
          isCurrent={isCurrent}
          onClose={() => setShowReplyModal(false)}
          onSubmit={() => setShowReplyModal(false)}
          uploadedFiles={[]}
          isTab={isTab}
          isReply={true}
          reviewId={selectedReviewId}
        />
      )}
    </div>
  );
};

export default ReviewsColumn;