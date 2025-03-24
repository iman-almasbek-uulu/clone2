import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "../Tab_event.module.scss";
import searchImg from "@/assets/images/placeImages/search.png";
import { FC } from "react";
import Image from "next/image";

interface Props {
  setIsSearch: (value: string) => void;
}

const Poster: FC<Props> = ({ setIsSearch }) => {
  const { t } = useTranslate();
  return (
    <div className={scss.poster}>
      <h2>{t("Афиша", "الملصق", "Poster")}</h2>
      <div className={scss.search}>
        <Image 
          src={searchImg.src} 
          alt={t("Поиск", "بحث", "Search")}
          width={20}
          height={20}
        />
        <input 
          onChange={(e) => setIsSearch(e.target.value)} 
          type="text" 
          placeholder={t("Поиск", "بحث", "Search")} 
        />
      </div>
    </div>
  );
};

export default Poster;