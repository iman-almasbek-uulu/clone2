'use client'
import { FC, useState } from "react";
import styles from "../Reviews.module.scss";
import ReviewModal from "./reviewModal/ReviewModal";
import PhotoUploadModal from "./photoUploadModal/PhotoUploadModal";
import StatisticBlock from "./statisticBlock/StatisticBlock";
import { useGetMeQuery } from "@/redux/api/auth";
import { useRouter } from "next/navigation";
import { REVIEWS } from "@/redux/api/reviews/types";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface StatisticColumnProps {
  reviewStatic?: REVIEWS.StaticReview;
  isCurrent: number | null;
  isTab: number;
}

const StatisticColumn: FC<StatisticColumnProps> = ({ isCurrent, reviewStatic, isTab }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { status } = useGetMeQuery();
  const router = useRouter();
  const {t} = useTranslate()
  const handlePhotoUpload = (files: File[]) => {
    setUploadedFiles(files);
    setShowPhotoModal(false);
    setShowReviewModal(true);
  };

  if (status === "fulfilled") {
    return (
      <div className={`${styles.w377} ${styles.shrink0}`}>
        <div
          style={{ width: "100%" }}
          className={`${styles.flex} ${styles.gap2} ${styles.mb8}`}
        >
          <button
            onClick={() => setShowPhotoModal(true)}
            className={styles.buttonSecondary}
          >
            {t("Написать отзыв", "كتابة تقييم", "Write Review")}
          </button>
          {showReviewModal && (
            <ReviewModal
              isCurrent={isCurrent}
              onClose={() => setShowReviewModal(false)}
              onSubmit={() => setShowReviewModal(false)}
              uploadedFiles={uploadedFiles}
              isTab={isTab}
            />
          )}
          {showPhotoModal && (
            <PhotoUploadModal
              onClose={() => setShowPhotoModal(false)}
              onSend={handlePhotoUpload}
            />
          )}
        </div>
        <div className={styles.block}>
          <StatisticBlock reviewStatic={reviewStatic} />
        </div>
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div className={`${styles.w377} ${styles.shrink0}`}>
        <div
          style={{ width: "100%" }}
          className={`${styles.flex} ${styles.gap2} ${styles.mb8}`}
        >
          <button
            onClick={() => router.push('/auth/sign-in')}
            className={styles.buttonPrimary}
          >
            {t("Войти", "تسجيل الدخول", "Sign In")}
          </button>
        </div>
        <div className={styles.block}>
          <StatisticBlock reviewStatic={reviewStatic} />
        </div>
      </div>
    );
  }
};

export default StatisticColumn;