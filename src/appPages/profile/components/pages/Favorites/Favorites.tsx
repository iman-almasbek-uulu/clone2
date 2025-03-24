"use client";
import React from "react";
import { useGetMeQuery } from "@/redux/api/auth";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "./Favorites.module.scss";
import Stars from "@/appPages/site/ui/stars/Stars";
import {
  useDeleteFavoriteMutation,
  useGetFavoriteQuery,
} from "@/redux/api/regions";
import { FaHeart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import SearchProfile from "../SearchProfile/SearchProfile";
import User from "../User/User";
import { Avatar, Space } from "antd";
import BurgerMenu from "@/appPages/site/ui/BurgerMenu/BurgerMenu";
import { UserOutlined } from "@ant-design/icons";
import Image from "next/image";

const Favorites = () => {
  const { t } = useTranslate();
  const { data } = useGetFavoriteQuery();
  const { data: user } = useGetMeQuery();
  const [deleteFavorite] = useDeleteFavoriteMutation();

  const handleDeleteFavorite = async (placeId: number) => {
    try {
      await deleteFavorite({ id: placeId });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Функция для обработки ошибок загрузки изображений
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://placehold.co/600x400/e0e0e0/969696?text=Image+Not+Found";
    target.alt = "Image not available";
  };

  // Функция для безопасного отображения изображений
  const getImageUrl = (src: string | undefined): string => {
    return (
      src || "https://placehold.co/600x400/e0e0e0/969696?text=Image+Not+Found"
    );
  };

  return (
    <section id={scss.Favorites}>
      {user?.map((el) => (
        <div className={scss.headerMobile} key={el.id}>
          <h1 className={scss.logo}>LOGO</h1>
          <Space direction="vertical" size={16}>
            <Space wrap size={16}>
              <Avatar
                className={scss.avatar}
                icon={
                  el.user_picture ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={getImageUrl(el.user_picture)}
                        alt="avatar"
                        width={120}
                        height={120}
                        style={{ objectFit: "cover" }}
                        onError={handleImageError}
                      />
                    </div>
                  ) : (
                    <UserOutlined />
                  )
                }
              />
            </Space>
          </Space>
          <div className={scss.burgerMenu}>
            <BurgerMenu />
          </div>
        </div>
      ))}
      <div className={scss.content}>
        <div className={scss.headerUser}>
          <SearchProfile />
          <User />
        </div>
        <h2>Favorites</h2>
        <div className={scss.list}>
          {data &&
            data.map((item, i) => (
              <React.Fragment key={i}>
                {item.popular_place && (
                  <div className={scss.item}>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                      }}
                    >
                      <Image
                        src={getImageUrl(item.popular_place.popular_image)}
                        alt="gallery place"
                        fill
                        style={{ objectFit: "cover" }}
                        onError={handleImageError}
                      />
                    </div>
                    <div className={scss.block}>
                      <h6>{item.popular_place.popular_name}</h6>
                      <div>
                        <span className={scss.grade}>
                          {item.popular_place.avg_rating}
                        </span>
                        <Stars
                          rating={item.popular_place.avg_rating}
                          width={9}
                          height={9}
                        />
                        <span className={scss.review}>
                          {item.popular_place.rating_count}{" "}
                          {t("Отзывы", "مراجعات", "reviews")}
                        </span>
                      </div>
                      <span className={scss.metka}>
                        <FaLocationDot className={scss.locationDot} />
                        <span>{item.popular_place.region}</span>
                      </span>
                    </div>
                    <div className={scss.heart}>
                      <FaHeart
                        onClick={() => handleDeleteFavorite(item.id)}
                        className={scss.heartIconRed}
                      />
                    </div>
                  </div>
                )}
                {item.hotels && (
                  <div className={scss.item}>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        borderRadius: "8px 8px 0 0",
                      }}
                    >
                      <Image
                        src={getImageUrl(item.hotels.main_image)}
                        alt="gallery place"
                        fill
                        style={{ objectFit: "cover" }}
                        onError={handleImageError}
                      />
                    </div>
                    <div className={scss.block}>
                      <h6>{item.hotels.name}</h6>
                      <div>
                        <span className={scss.grade}>
                          {item.hotels.avg_rating}
                        </span>
                        <Stars
                          rating={item.hotels.avg_rating}
                          width={9}
                          height={9}
                        />
                        <span className={scss.review}>
                          {item.hotels.rating_count}{" "}
                          {t("Отзывы", "مراجعات", "reviews")}
                        </span>
                      </div>
                      <span className={scss.metka}>
                        <FaLocationDot className={scss.locationDot} />
                        <span>{item.hotels.region}</span>
                      </span>
                    </div>
                    <div className={scss.heart}>
                      <FaHeart
                        onClick={() => handleDeleteFavorite(item.id)}
                        className={scss.heartIconRed}
                      />
                    </div>
                  </div>
                )}
                {item.kitchen && (
                  <div className={scss.kitchen}>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                      }}
                    >
                      <Image
                        src={getImageUrl(item.kitchen.main_image)}
                        alt="gallery place"
                        fill
                        style={{ objectFit: "cover" }}
                        onError={handleImageError}
                      />
                    </div>
                    <div className={scss.block}>
                      <h6>{item.kitchen.kitchen_name}</h6>
                      <div>
                        <span className={scss.grade}>
                          {item.kitchen.average_rating}
                        </span>
                        <Stars
                          rating={item.kitchen.average_rating}
                          width={9}
                          height={9}
                        />
                        <span className={scss.review}>
                          {item.kitchen.rating_count}{" "}
                          {t("Отзывы", "مراجعات", "reviews")}
                        </span>
                      </div>
                      <span className={scss.metka}>
                        <FaLocationDot className={scss.locationDot} />
                        <span>{item.kitchen.kitchen_region}</span>
                      </span>
                    </div>
                    <div className={scss.heart}>
                      <FaHeart
                        onClick={() => handleDeleteFavorite(item.id)}
                        className={scss.heartIconRed}
                      />
                    </div>
                  </div>
                )}
                {item.attractions && (
                  <div className={scss.kitchen}>
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "200px",
                      }}
                    >
                      <Image
                        src={getImageUrl(item.attractions.main_image)}
                        alt="gallery place"
                        fill
                        style={{ objectFit: "cover" }}
                        onError={handleImageError}
                      />
                    </div>
                    <div className={scss.block}>
                      <h6>{item.attractions.attraction_name}</h6>
                      <div>
                        <span className={scss.grade}>
                          {item.attractions.avg_rating}
                        </span>
                        <Stars
                          rating={item.attractions.avg_rating}
                          width={9}
                          height={9}
                        />
                        <span className={scss.review}>
                          {item.attractions.rating_count}{" "}
                          {t("Отзывы", "مراجعات", "reviews")}
                        </span>
                      </div>
                      <span className={scss.metka}>
                        <FaLocationDot className={scss.locationDot} />
                        <span>{item.attractions.region_category}</span>
                      </span>
                    </div>
                    <div className={scss.heart}>
                      <FaHeart
                        onClick={() => handleDeleteFavorite(item.id)}
                        className={scss.heartIconRed}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Favorites;
