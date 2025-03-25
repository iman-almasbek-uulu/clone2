"use client";

import { useEffect, useState } from "react";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import styles from "./Kitchen.module.scss";
import {
  useGetCultureKitchenMainQuery,
  useGetCultureKitchenQuery,
} from "@/redux/api/culture";
import sanitizeHtml from "sanitize-html";
import Image from "next/image";
import horse1 from "../../../../../../assets/images/galleryImages/horse1.png";

const Kitchen = () => {
  const { t } = useTranslate();
  const { data, isError, isLoading } = useGetCultureKitchenQuery();
  const { data: main } = useGetCultureKitchenMainQuery();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading__container}>
        <div className={styles.horse}>
          <img src={horse1.src} alt="Horse 1" />
          <img src={horse1.src} alt="Horse 2" />
          <img src={horse1.src} alt="Horse 3" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles["muted-background"]}></div>
          <h1 className={styles["top-heading"]}>
            {t("Кухня", "المطبخ", "Kitchen")}
          </h1>
          <p className={styles["top-paragraph"]}>
            {t(
              "Кыргызстан - страна, где на перекрестке Великого Шелкового пути слились традиционная кочевая культура и оседлая культура. Отличительной особенностью кыргызских блюд является то, что все они готовятся исключительно из свежих продуктов и редко заготавливаются впрок, а рецепты их приготовления, хотя и кажутся достаточно простыми, на самом деле содержат множество тонкостей, которыми довольно сложно овладеть.",
              "قيرغيزستان هي بلد حيث في مفترق طرق طريق الحرير العظيم، اندمجت الثقافة البدوية التقليدية والثقافة المستقرة. السمة المميزة للأطباق القيرغيزية هي أنها جميعها تُحضر حصرياً من المنتجات الطازجة ونادراً ما يتم تخزينها للاستخدام المستقبلي، ووصفات إعدادها، على الرغم من أنها تبدو بسيطة للغاية، في الواقع تحتوي على العديد من التفاصيل الدقيقة التي يصعب إتقانها.",
              "Kyrgyzstan is a country where at the crossroads of the Great Silk Road, the traditional nomadic culture and the sedentary culture merged. A distinctive feature of Kyrgyz dishes is that they are all prepared exclusively from fresh products and are rarely stocked up for future use, and the recipes for their preparation, although they seem quite simple, in fact contain many subtleties that are rather difficult to master."
            )}
          </p>
        </div>

        {main?.map((el) => (
          <div key={el.id} className={styles.block}>
            <div className={styles.Images}>
              {el.image_1 && (
                <Image
                  src={el.image_1}
                  alt="Traditional Kyrgyz food"
                  className={styles.img1}
                  width={486}
                  height={324}
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
              <div className={styles.images2}>
                {el.image_2 && (
                  <Image
                    src={el.image_2}
                    alt="Traditional Kyrgyz food"
                    className={styles.img2}
                    width={237}
                    height={178}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}
                {el.image_3 && (
                  <Image
                    src={el.image_3}
                    alt="Traditional Kyrgyz food"
                    className={styles.img2}
                    width={237}
                    height={178}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
              {el.image_4 && (
                <Image
                  src={el.image_4}
                  alt="Traditional Kyrgyz food"
                  className={styles.img1}
                  width={486}
                  height={324}
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <div className={styles.text}>
              <h3>{el.title}</h3>
              <p
                className={styles.description1}
                dangerouslySetInnerHTML={{
                  __html: isClient ? sanitizeHtml(el.description) : "",
                }}
              />
            </div>
          </div>
        ))}

        {data.map((el, idx) => (
          <div key={idx} className={styles.main}>
            {el.culture_kitchen_image.map(
              (item) =>
                item.image && (
                  <Image
                    key={item.id}
                    src={item.image}
                    alt={`${el.kitchen_name} dish`}
                    width={486}
                    height={324}
                    style={{
                      objectFit: "cover",
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                )
            )}
            <div className={styles["main-text"]}>
              <h3 className={styles["main-heading"]}>{el.kitchen_name}</h3>
              <p className={styles["main-paragraph"]}>
                {el.kitchen_description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Kitchen;
