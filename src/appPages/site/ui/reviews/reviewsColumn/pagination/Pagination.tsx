import { FC } from "react";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pageNumbers = [];
  if (currentPage > 1) {
    pageNumbers.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        className={styles.paginationArrow}
      >
        &lt;
      </button>
    );
  }

  if (startPage > 1) {
    pageNumbers.push(
      <button key="start-ellipsis" className={styles.paginationEllipsis} disabled>
        ...
      </button>
    );
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`${styles.paginationNumber} ${currentPage === i ? styles.active : ""}`}
      >
        {i}
      </button>
    );
  }

  if (endPage < totalPages) {
    pageNumbers.push(
      <button key="end-ellipsis" className={styles.paginationEllipsis} disabled>
        ...
      </button>
    );
  }

  if (currentPage < totalPages) {
    pageNumbers.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        className={styles.paginationArrow}
      >
        &gt;
      </button>
    );
  }

  return <div className={styles.pagination}>{pageNumbers}</div>;
};

export default Pagination;