"use client";
import React from "react";
import styles from "./MainCulture.module.scss";
import Link from "next/link";
import Arrow from "@/assets/images/regions/Arrow_alt_lright.png";
import Background from "@/assets/images/cultureImages/main-culture.jpg";
import useTranslate from "@/appPages/site/hooks/translate/translate";

const MainCulture = () => {
  const { t } = useTranslate();

  const cultureNav = [
    { name: t("Игры", "ألعاب", "Games"), href: "/culture/games" },
    {
      name: t("Национальная одежда", "ملابس وطنية", "National clothes"),
      href: "/culture/national_clothes",
    },
    {
      name: t("Ручные поделки", "الحرف اليدوية", "Hand crafts"),
      href: "/culture/hand_crafts",
    },
    { name: t("Валюта", "العملة", "Currency"), href: "/culture/currency" },
    {
      name: t(
        "Национальные инструменты",
        "الآلات الموسيقية الوطنية",
        "National instruments"
      ),
      href: "/culture/national_instruments",
    },
    {
      name: t("Кухня", "المطبخ", "Kitchen"),
      href: "/culture/kitchen",
    },
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.main}>
          <img className={styles.background} src={Background.src} alt="" />
          <div className={styles["main-text"]}>
            <h1 className={styles.heading}>
              {t("Культура", "ثقافة", "Culture")}
            </h1>
            <p className={styles.descr}>
              {t(
                "Культура Кыргызстана формировалась под сильным влиянием кочевого образа жизни. Кроме того, на нее оказали влияние культуры России, Персии и Турции, и все же она осталась весьма самобытной и неповторимой. Связь кыргызской культуры с природой прослеживается во всем: от дизайна до музыки. Одним из самых известных образцов кыргызской культуры является эпос «Манас» — невероятно длинная поэма, которая передавалась устно из поколения в поколение.",
                "تشكلت ثقافة قيرغيزستان تحت تأثير قوي من الحياة البدوية. إضافةً إلى ذلك، تأثرت بثقافات روسيا وبلاد فارس وتركيا، ومع ذلك حافظت على طابعها الأصيل وتميزها. ويمكن تتبع ارتباط الثقافة القيرغيزية بالطبيعة في كل مكان: من التصميم إلى الموسيقى. ومن أشهر الأمثلة على الثقافة القيرغيزية ملحمة ماناس، وهي قصيدة طويلة جدًا تناقلتها الأجيال شفويًا.",
                "The culture of Kyrgyzstan was formed under the strong influence of nomadic life. In addition, it was influenced by the cultures of Russia, Persia and Turkey, and yet it remained quite original and unique. The connection of Kyrgyz culture with nature can be traced everywhere: from design to music. One of the most famous examples of Kyrgyz culture is the Manas epic, an incredibly long poem that was passed down orally from one generation to the next."
              )}
            </p>
            <ul className={styles.link}>
              {cultureNav.map((el, idx) => (
                <Link key={idx} href={el.href}>
                  <li className={styles.li}>
                    {el.name} <img src={Arrow.src} alt="->" />
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCulture;
