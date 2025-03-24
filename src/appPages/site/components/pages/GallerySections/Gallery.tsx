"use client";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "./Gallery.module.scss";
import imgMetka from "@/assets/images/galleryImages/metka.png";
import { useGetPopularPlacesQuery } from "@/redux/api/regions";
import Stars from "@/appPages/site/ui/stars/Stars";
import LikePost from "../regionSections/places/LikePost";
import Image from "next/image";

const Gallery = () => {
  const { t } = useTranslate();
  const { data: popular } = useGetPopularPlacesQuery();

  return (
    <section id={scss.Gallery}>
      <div className="container">
        <div className={scss.list}>
          {popular?.map((el, i) => (
            <div key={i} className={scss.item}>
              {/* Используем div-обертку для сохранения стилей */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "271px",
                  borderRadius: "8px 8px 0 0",
                  overflow: "hidden",
                }}
              >
                {el.popular_image && (
                  <Image
                    src={el.popular_image}
                    alt="popular place"
                    fill
                    sizes="(max-width: 390px) 286px, (max-width: 490px) 180px, 271px"
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                )}
              </div>
              <div className={scss.block}>
                <h6>{el.popular_name}</h6>
                <div>
                  <span className={scss.grade}>{el.avg_rating}</span>
                  <Stars rating={el.avg_rating} width={9} height={9} />
                  <span className={scss.review}>
                    {el.rating_count} {t("Отзывы", "مراجعات", "reviews")}
                  </span>
                </div>
                <span className={scss.metka}>
                  {/* Для маленьких иконок изображения можно использовать обычный img с eslint-disable */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgMetka.src} alt="location" />
                  <span>{el.region}</span>
                </span>
              </div>
              <LikePost postId={el.id} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
