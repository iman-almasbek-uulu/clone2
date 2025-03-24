import React from "react";
import Culture from "../culture/Culture";
import scss from "./Culture.module.scss";
import useTranslate from "@/appPages/site/hooks/translate/translate";
const HomeCulture: React.FC = () => {
  const { t } = useTranslate();
  return (
    <section id={scss.Culture}>
      <div className="container">
        <h2>{t("Культура", "الثقافة", "Culture")}</h2>
      </div>
      <Culture />
    </section>
  );
};

export default HomeCulture;
