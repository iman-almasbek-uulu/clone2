"use client";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "./Hotel_info.module.scss";
import { useGetHotelIDQuery } from "@/redux/api/place";
import { FC } from "react";
import { LuShare2 } from "react-icons/lu";
import safety from "@/assets/images/placeImages/safety.png";
import GalleryImages from "@/appPages/site/ui/galleryImages/GalleryImages";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BathIcon, Bed, CarFront } from "lucide-react";
import { MdOutlinePets } from "react-icons/md";
import Image from "next/image";
import LikeHotel from "../hotel_list/LikeHotel";

interface propsType {
  isCurrent: number | null;
}

const Hotel_info: FC<propsType> = ({ isCurrent }) => {
  const { t } = useTranslate();
  const { data, isError } = useGetHotelIDQuery(isCurrent);
  const images = data?.hotel_image ?? [];
  console.log("🚀 ~ data:", data);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Мой сайт",
          text: "Посмотрите этот сайт!",
          url: window.location.href,
        });
        toast.success("Ссылка успешно отправлена!");
      } catch {
        toast.error("Ошибка при попытке поделиться.");
      }
    } else {
      toast.info('Ваш браузер не поддерживает функцию "Поделиться".');
    }
  };

  if (isError) {
    return null;
  }

  return (
    <div className={scss.hotel_item}>
      <h4>{data?.name ? t(data.name, data.name, data.name) : ""}</h4>
      <GalleryImages images={images} />

      <div className={scss.info}>
        <div className={scss.left}>
          <div className={scss.titles}>
            <div className={scss.title}>
              <p>{data?.address}</p>
            </div>
            <div className={scss.links}>
            {data?.id !== undefined && <LikeHotel postId={data?.id} hotel={true} />}{" "}
            <LuShare2 onClick={handleShare} className={scss.iconShare} />
            </div>
          </div>
          <div className={scss.list}>
            <div>
              <Bed size={40} />
              <span>
                {data?.bedroom} {t("Спальни", "غرف نوم", "Bedrooms")}
              </span>
            </div>
            <div>
              <BathIcon size={40} />
              <span>
                {data?.bathroom} {t("Ванные", "الحمامات", "Bathrooms")}
              </span>
            </div>
            <div>
              <CarFront size={40} />
              <span>
                {data?.cars} {t("машины", "سيارات", "cars")} / {data?.bikes}{" "}
                {t("велосипеды", "دراجات", "bikes")}
              </span>
            </div>
            <div>
              <MdOutlinePets size={40} />
              <span>
                {data?.pets
                  ? t(
                      "Домашние животные разрешены",
                      "الحيوانات الأليفة مسموح بها",
                      "Pets Allowed"
                    )
                  : t(
                      "Домашние животные запрещены",
                      "الحيوانات الأليفة غير مسموح بها",
                      "No Pets Allowed"
                    )}
              </span>
            </div>
          </div>
          <div className={scss.descr}>
            <h6>
              {t("Описание апартаментов", "وصف الشقة", "Apartment Description")}
            </h6>
            <p>{data?.description}</p>
          </div>
          <div className={scss.amen}>
            <h6>
              {t(
                "Предлагаемые удобства",
                "وسائل الراحة المقدمة",
                "Offered Amenities"
              )}
            </h6>
            <div className={scss.amenities}>
              {data?.amenities &&
                data.amenities.map((item) => (
                  <div key={item.id}>
                    <Image
                      src={item.icon}
                      alt={item.amenity}
                      width={24}
                      height={24}
                    />
                    <span>
                      {typeof item.amenity === "string"
                        ? item.amenity
                        : JSON.stringify(item.amenity)}
                    </span>
                  </div>
                ))}
            </div>
            {/* <button>{t("Показать все 10 удобств", "عرض جميع وسائل الراحة 10", "Show All 10 Amenities")}</button> */}
          </div>
          <div className={scss.safe}>
            <h6>
              {t(
                "Безопасность и гигиена",
                "السلامة والنظافة",
                "Safety and Hygiene"
              )}
            </h6>
            <div className={scss.safe_list}>
              {data?.safety_and_hygiene &&
                data.safety_and_hygiene.map((item) => (
                  <div key={item.id}>
                    <Image
                      src={safety.src}
                      alt={t("Безопасность", "سلامة", "Safety")}
                      width={24}
                      height={24}
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="">
          <div className={scss.right}>
            <div className={scss.price}>
              $ {data?.price_short_period} - $ {data?.price_long_period}
            </div>
            <ul>
              <li>
                {t("Короткий период: $ ", "فترة قصيرة: $ ", "Short Period: $ ")}{" "}
                {data?.price_short_period}
              </li>
              <li>
                {t(
                  "Средний период: $ ",
                  "فترة متوسطة: $ ",
                  "Medium Period: $ "
                )}
                {data?.price_medium_period}
              </li>
              <li>
                {t(
                  "Длительный период: $ ",
                  "فترة طويلة: $ ",
                  "Long Period: $ "
                )}
                {data?.price_long_period}
              </li>
            </ul>
            <button> {t("Позвонить сейчас", "اتصل الآن", "Call Now")}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel_info;
