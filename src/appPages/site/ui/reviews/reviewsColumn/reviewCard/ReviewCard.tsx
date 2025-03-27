import { FC, useState, useEffect } from "react";
import styles from "./ReviewCard.module.scss";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import Image from "next/image";
import { REVIEWS } from "@/redux/api/reviews/types";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import Stars from "../../../stars/Stars";
import { ImageModal } from "../../../imageModal/ImageModal";

interface ReviewCardProps {
  review: REVIEWS.Review;
  onReplyClick: (reviewId: number) => void;
  expandedReplies: boolean;
  toggleReplies: (reviewId: number) => void;
  repliesToShow: number;
}

const ReviewCard: FC<ReviewCardProps> = ({
  review,
  onReplyClick,
  expandedReplies,
  toggleReplies,
  repliesToShow,
}) => {
  const { t } = useTranslate();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 480);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "https://placehold.co/600x400/e0e0e0/969696?text=Image+Not+Found";
    target.alt = "Image not available";
  };

  const handlePrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null && selectedImage < review.reviewImages.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          <Space direction="vertical" size={isMobile ? 15 : 20}>
            <Space wrap size={isMobile ? 15 : 20}>
              <Avatar
                size={isMobile ? 40 : 47}
                icon={
                  review.client.user_picture ? (
                    <div className={styles.avatarImageWrapper}>
                      <Image
                        src={review.client.user_picture}
                        alt="avatar"
                        width={isMobile ? 40 : 47}
                        height={isMobile ? 40 : 47}
                        style={{ objectFit: "cover", height: "100%" }}
                        unoptimized={true}
                      />
                    </div>
                  ) : (
                    <UserOutlined />
                  )
                }
              />
            </Space>
          </Space>
          <div>
            <div className={styles.authorName}>
              {review.client.first_name} {review.client.last_name}
            </div>
            <div className={styles.authorPlace}>{review.client.from_user}</div>
          </div>
        </div>
        <div className={styles.rating}>
          <Stars width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} rating={review.rating} />
          <span className={styles.reviewDate}>{review.createdAt}</span>
        </div>
      </div>
      <p className={styles.reviewText}>{review.comment}</p>
      {review.reviewImages.length > 0 && (
        <div className={styles.imageGrid}>
          {review.reviewImages.map((image, index) => (
            <div key={image.id} className={styles.reviewImageContainer}>
              <Image
                onClick={() => setSelectedImage(index)}
                src={image.image}
                alt={`Review image ${index + 1}`}
                className={styles.reviewImage}
                width={isMobile ? 150 : 150}
                height={120}
                style={{ objectFit: "cover" }}
                onError={handleImageError}
                unoptimized={true}
              />
            </div>
          ))}
        </div>
      )}
      {selectedImage !== null && (
        <ImageModal
          images={review.reviewImages}
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSelectImage={setSelectedImage}
        />
      )}
      <button
        className={styles.replyButton}
        onClick={() => onReplyClick(review.id)}
      >
        {t("Ответить", "الرد", "Reply")}
      </button>
      {review.replyReviews && review.replyReviews.length > 0 && (
        <div className={styles.replies}>
          {(expandedReplies ? review.replyReviews : review.replyReviews.slice(0, repliesToShow)).map((reply) => (
            <div key={reply.id} className={styles.replyCard}>
              <div className={styles.header}>
                <div className={styles.avatarContainer}>
                  <Space direction="vertical" size={isMobile ? 15 : 20}>
                    <Space wrap size={isMobile ? 15 : 20}>
                      <Avatar
                        size={isMobile ? 40 : 47}
                        icon={
                          reply.user.user_picture ? (
                            <div className={styles.avatarImageWrapper}>
                              <Image
                                src={reply.user.user_picture}
                                alt="avatar"
                                width={isMobile ? 40 : 47}
                                height={isMobile ? 40 : 47}
                                style={{ objectFit: "cover", height: "100%" }}
                                unoptimized={true}
                              />
                            </div>
                          ) : (
                            <UserOutlined />
                          )
                        }
                      />
                    </Space>
                  </Space>
                  <div>
                    <div className={styles.authorName}>
                      {reply.user.first_name} {reply.user.last_name}
                    </div>
                    <div className={styles.authorPlace}>{reply.user.from_user}</div>
                  </div>
                </div>
                <span className={styles.reviewDate}>{reply.created_date}</span>
              </div>
              <p className={styles.reviewText}>{reply.comment}</p>
            </div>
          ))}
          {review.replyReviews.length > repliesToShow && (
            <button
              className={styles.showRepliesButton}
              onClick={() => toggleReplies(review.id)}
            >
              {expandedReplies
                ? t("Скрыть ответы", "إخفاء الردود", "Hide replies")
                : t("Показать все ответы", "عرض كل الردود", "Show all replies") +
                  ` (${review.replyReviews.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;