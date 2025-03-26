import { FC, useEffect, useState } from "react";
import styles from "./ReviewSearchBar.module.scss";
import { Search } from "lucide-react";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface ReviewSearchBarProps {
  searchFilter: string;
  setSearchFilter: (value: string) => void;
  setIsShowFilter: (value: boolean) => void;
}

const ReviewSearchBar: FC<ReviewSearchBarProps> = ({
  searchFilter,
  setSearchFilter,
  setIsShowFilter,
}) => {
  const { t } = useTranslate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 480);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchContainer}>
        <Search
          className={styles.searchIcon}
          size={isMobile ? 16 : 20}
          color="#5A5A5A"
        />
        <input
          onChange={(e) => setSearchFilter(e.target.value)}
          type="text"
          placeholder={t("Поиск", "بحث", "Search")}
          className={styles.searchInput}
          value={searchFilter}
        />
      </div>
      <button
        onClick={() => setIsShowFilter(true)}
        className={styles.buttonSecondary}
      >
        {t("Фильтры", "تصفية", "Filters")}
      </button>
    </div>
  );
};

export default ReviewSearchBar;