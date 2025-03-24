"use client";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "./Places.module.scss";
import imgRight from "@/assets/images/regions/Arrow_alt_lright.png";
import Link from "next/link";
import { useGetRegionListQuery } from "@/redux/api/regions";
import { usePathname } from "next/navigation";
import Stars from "@/appPages/site/ui/stars/Stars";
import LikePost from "./LikePost";
import Image from "next/image";

const Places = () => {
  const { t } = useTranslate();
  const { data } = useGetRegionListQuery();
  const pathName = usePathname();
  const routeName = pathName.split("/")[1];

  const popularPlacesInRegion = data?.find(
    (place) =>
      place.region_category.trim().toLocaleLowerCase() ===
      routeName.trim().toLocaleLowerCase()
  );

  return (
    <section id={scss.Places}>
      <div className="container">
        <h2>{t("Популярные места", "أماكن مشهورة", "Popular places")}</h2>
        <div className={scss.list}>
          {popularPlacesInRegion?.popular_places?.map((place, i) => {
            return (
              <div key={i} className={scss.item}>
                <Image 
                  src={place.popular_image} 
                  alt={place.popular_name || "Popular place"}
                  width={400}
                  height={300}
                  style={{ objectFit: "cover" }}
                />
                <div className={scss.block}>
                  <h6>{place.popular_name}</h6>
                  <div>
                    <span className={scss.grade}>{place.avg_rating}</span>
                    <div className={scss.stars}>
                      <Stars rating={place.avg_rating} width={9} height={9} />
                    </div>
                    <span className={scss.review}>
                      {place.rating_count} {t("Отзывы", "مراجعات", "reviews")}
                    </span>
                  </div>
                </div>
                <LikePost postId={place.id} />
                <Link href={`/${routeName}/${place.id}`}>
                  <Image 
                    className={scss.right} 
                    src={imgRight.src} 
                    alt={t("Подробнее", "المزيد", "More details")}
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Places;