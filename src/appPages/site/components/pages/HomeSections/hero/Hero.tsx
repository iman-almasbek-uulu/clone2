import { FC, useState, useEffect, useRef } from "react";
import scss from "./Hero.module.scss";
import imgFC from "@/assets/images/homeImages/fc.png";
import imgMail from "@/assets/images/homeImages/mail.png";
import imgVk from "@/assets/images/homeImages/vk.png";
import imgInst from "@/assets/images/homeImages/inst.png";
import imgVrc from "@/assets/images/homeImages/vec.svg";
import Image from "next/image";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { useGetRegionListQuery } from "@/redux/api/regions";
import Link from "next/link";

interface SocialIcon {
  src: string;
  alt: string;
  className: string;
  shareUrl: string;
}

export const Hero: FC = () => {
  const { t } = useTranslate();
  const [isFilter, setIsFilter] = useState<string>("");
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const { data } = useGetRegionListQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Function to get the current website URL
  const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
      return encodeURIComponent(window.location.href);
    }
    return "";
  };

  // Function to get the website title
  const getShareTitle = () => {
    return encodeURIComponent(
      t(
        "Добро пожаловать в удивительный Кыргызстан!",
        "مرحبًا بكم في قيرغيزستان المذهلة!",
        "Welcome to the amazing Kyrgyzstan!"
      )
    );
  };

  // Define social network icons with sharing URLs
  const socialIcons: SocialIcon[] = [
    {
      src: imgInst.src,
      alt: "Instagram",
      className: scss.ins,
      // Instagram doesn't have a direct sharing API, usually opens the app
      shareUrl: "https://www.instagram.com/",
    },
    {
      src: imgFC.src,
      alt: "Facebook",
      className: scss.facebook,
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${getCurrentUrl()}`,
    },
    {
      src: imgVk.src,
      alt: "VKontakte",
      className: scss.vk,
      shareUrl: `https://vk.com/share.php?url=${getCurrentUrl()}&title=${getShareTitle()}`,
    },
    {
      src: imgMail.src,
      alt: "Mail",
      className: scss.mail,
      shareUrl: `mailto:?subject=${getShareTitle()}&body=${getCurrentUrl()}`,
    },
  ];

  // Function to handle clicks on social network icons
  const handleSocialShare = (url: string, alt: string) => {
    // For Instagram, show an alert since direct sharing is not available
    if (alt === "Instagram") {
      alert("For Instagram: copy the link and share it on Instagram");
      navigator.clipboard.writeText(window.location.href);
      return;
    }

    // Open sharing window for other social networks
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFilter(e.target.value);
    setIsDropdownVisible(!!e.target.value);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section id={scss.Hero}>
      <div className={`container ${scss.container}`}>
        <div className={scss.Hero}>
          <div className={scss.iconsblock}>
            <h1 className={scss.pages}>
              {t(
                "Добро пожаловать в удивительный Кыргызстан!",
                "مرحبًا بكم في قيرغيزستان المذهلة!",
                "Welcome to the amazing Kyrgyzstan!"
              )}
            </h1>

            <div className={scss.icons1}>
              {socialIcons.map((icon, index) => (
                <div
                  key={index}
                  onClick={() => handleSocialShare(icon.shareUrl, icon.alt)}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    className={icon.className}
                    src={icon.src}
                    alt={icon.alt}
                    width={24}
                    height={24}
                    aria-label={icon.alt}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={scss.pageblock}>
            <div className={scss.input_container} ref={inputRef}>
              <input
                ref={inputRef}
                onChange={handleFilter}
                className={scss.homeinput}
                type="text"
                placeholder={t(
                  "Куда поехать?",
                  "إلى أين تذهب؟",
                  "Where to go?"
                )}
                aria-label="Search destination"
                value={isFilter}
                onFocus={() => setIsDropdownVisible(!!isFilter)}
              />
              {isDropdownVisible && (
                <div
                  className={`${scss.filter} ${scss.visible}`}
                  ref={dropdownRef}
                >
                  {data
                    ?.filter((region) =>
                      region.region_name
                        .toLowerCase()
                        .includes(isFilter.toLowerCase())
                    )
                    .map((region) => (
                      <Link
                        href={`/${region.region_category}`}
                        key={region.id}
                        className={scss.filterItem}
                      >
                        {region.region_name}
                      </Link>
                    ))}
                </div>
              )}
            </div>
            <button className={scss.homebtn} aria-label="Search">
              <Image
                src={imgVrc.src}
                alt="Search icon"
                width={20}
                height={20}
              />
            </button>
          </div>

          <p className={scss.hometext}>
            {t(
              `Вы готовы отправиться в захватывающее путешествие по удивительной стране Центральной Азии? Мы готовы помочь вам спланировать идеальное путешествие в Кыргызстан.`,
              `هل أنت مستعد للانطلاق في رحلة مثيرة عبر البلد الرائع في آسيا الوسطى؟ نحن جاهزون لمساعدتك في التخطيط للرحلة المثالية إلى قيرغيزستان.`,
              `Are you ready to embark on an exciting journey through the stunning country of Central Asia? We are ready to help you plan the perfect trip to Kyrgyzstan.`
            )}
          </p>
        </div>
      </div>
      <div className={scss.heroTwo}>
        <div className={`container ${scss.heroTwoContainer}`}>
          <h3 className={scss.twoText}>
            {t(`Кыргызстан`, `قيرغيزستان`, `Kyrgyzstan`)}
          </h3>
          <p className={scss.twoTitle}>
            {t(
              `Киргизская Республика — это страна, не имеющая выхода к морю, расположенная в самом сердце Центральной Азии. Столица — Бишкек. Горный регион Тянь-Шань покрывает более 80% территории страны. Кыргызстан иногда называют "Швейцарией Центральной Азии". Страна разделена на семь областей: Баткенская, Чуйская, Джалал-Абадская, Иссык-Кульская, Нарынская, Ошская и Таласская.`,
              `جمهورية قيرغيزستان هي دولة غير ساحلية تقع في قلب آسيا الوسطى. العاصمة هي بيشكيك. يغطي إقليم جبال تيان شان أكثر من 80% من البلاد. يشار أحيانًا إلى قيرغيزستان باسم "سويسرا آسيا الوسطى". تنقسم البلاد إلى سبع مقاطعات، وهي باتكين، تشوي، جلال آباد، إيسيك كول، نارين، أوش وتالاس.`,
              `Kyrgyz Republic is a landlocked country located in the heart of Central Asia. The capital is Bishkek. The mountainous region of the Tian Shan covers over 80% of the country. Kyrgyzstan is occasionally referred to as "the Switzerland of Central Asia". The country is divided into seven provinces, which are Batken, Chuy, Jalal-Abad, Issyk-Kul, Naryn, Osh, and Talas.`
            )}
          </p>
        </div>
      </div>
    </section>
  );
};
