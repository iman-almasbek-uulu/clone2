"use client";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import styles from "./Currency.module.scss";

import Image from "next/image";
import { useMeasure } from "react-use";
import { useGetCurencyQuery } from "@/redux/api/culture";

const Currency = () => {
  const { t } = useTranslate();

  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const { data: currencyData, error, isLoading } = useGetCurencyQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading currency data</p>;

  const currency = currencyData?.[0];

  const images = currency?.currency_image || [];
  const descriptions = currency?.currency_description || [];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.top} ref={ref}>
          <div className={styles["muted-background"]}></div>
          <h1 className={styles["top-heading"]}>
            {t("Валюта", "العملة", "Currency")}
          </h1>
          <p className={styles["top-paragraph"]}>
            {t(
              "Национальной валютой Кыргызстана является сом (KGS). В обращении находятся банкноты различного номинала и монеты. Обмен валюты доступен в банках и обменных пунктах.",
              "عملة قيرغيزستان الوطنية هي السوم (KGS). تتداول الأوراق النقدية والعملات المعدنية من مختلف الفئات. يتوفر صرف العملات في البنوك ومكاتب الصرافة.",
              "The national currency of Kyrgyzstan is the som (KGS). Banknotes and coins of various denominations are in circulation. Currency exchange is available at banks and exchange offices."
            )}
          </p>
        </div>
        <div className={styles.bottom} style={{ top: height }}>
          <div className={styles.images}>
            {images.length > 0 ? (
              images.map((el, idx) => (
                <div key={idx} className={styles.image}>
                  {el.front_image && (
                    <div className={styles.img}>
                      <Image
                        src={el.front_image}
                        alt="currency"
                        width={199}
                        height={94}
                      />
                    </div>
                  )}
                  {el.back_image && (
                    <div className={styles.img}>
                      <Image
                        src={el.back_image}
                        alt="currency"
                        width={199}
                        height={94}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No currency images available</p>
            )}
          </div>
          <div className={styles.descrs}>
            <h1 className={styles.h1}>National currency of Kyrgyzstan</h1>{" "}
            {descriptions.length > 0 ? (
              descriptions.map((des, idx) => (
                <p className={styles.description} key={idx}>
                  {des.description}
                </p>
              ))
            ) : (
              <p>No currency description available</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Currency;
