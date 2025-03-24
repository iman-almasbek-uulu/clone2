import { useEffect, useState } from "react";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import styles from "./National_instruments.module.scss";
import { useGetNationalInstrumentQuery } from "@/redux/api/culture";
import Image from "next/image";

const National_instruments = () => {
  const { t } = useTranslate();
  const { data } = useGetNationalInstrumentQuery();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Не рендерить на сервере
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles["muted-background"]}></div>
          <h1 className={styles["top-heading"]}>
            {t(
              "Национальные инструменты",
              "الآلات الموسيقية الوطنية",
              "National instruments"
            )}
          </h1>
          <p className={styles["top-paragraph"]}>
            {t(
              "Кыргызская музыка примечательна тем, что она созвучна с природой и жизнью в горах. Тексты многих песен рассказывают о повседневной жизни кочевников, и даже в композициях, где нет слов, тонко передается соответствующее настроение. В Кыргызстане много музыкальных инструментов.",
              "تتميز الموسيقى القرغيزية بتناغمها مع الطبيعة والحياة في الجبال. تحكي نصوص العديد من الأغاني عن الحياة اليومية للبدو الرحل، وحتى في المقطوعات التي لا تحتوي على كلمات، يتم نقل المزاج المناسب بدقة. هناك العديد من الآلات الموسيقية في قيرغيزستان.",
              "Kyrgyz music is notable for being in tune with nature and life in the mountains. The texts of many songs tell about the everyday life of nomads, and even in compositions where there are no words, the corresponding mood is subtly conveyed. There are many musical instruments in Kyrgyzstan."
            )}
          </p>
        </div>
        {data?.map((el, idx) => (
          <div key={idx} className={styles.main}>
            {el.national_image && (
              <Image 
                src={el.national_image} 
                alt={el.national_name || "National instrument"} 
                width={574}
                height={392}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain"
                }}
              />
            )}
            <div className={styles["main-text"]}>
              <h3 className={styles["main-heading"]}>{el.national_name}</h3>
              <p className={styles["main-paragraph"]}>
                {el.national_description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default National_instruments;