import React, { FC, useState, useEffect } from "react";
import scss from "./LikeHotel.module.scss";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useGetMeQuery } from "@/redux/api/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import {
  useDeleteFavoriteMutation,
  useGetFavoriteQuery,
  usePostFavoriteMutation,
} from "@/redux/api/favorite";
interface LikePostProps {
  postId: number;
  hotel?: boolean;
}

const LikeHotel: FC<LikePostProps> = ({ postId, hotel = false }) => {
  const { data: user } = useGetMeQuery();
  const [postFavorite] = usePostFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const { data, refetch } = useGetFavoriteQuery();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setIsLiked(data.some((el) => el.hotels?.id === postId));
    }
  }, [data, postId]);

  const toggleLike = async () => {
    if (!user) {
      toast.warn("📌 Register or log in to add to favorites!", {
        className: scss["warning-toast"],
      });
      return;
    }
    try {
      if (!data || !Array.isArray(data)) return;
      const favoriteItem = data.find((el) => el.hotels?.id === postId);
      if (isLiked && favoriteItem) {
        await deleteFavorite({ id: favoriteItem.id }).unwrap();
      } else {
        await postFavorite({
          hotels: postId,
          like: true,
        }).unwrap();
      }
      refetch();
    } catch (error) {
      console.error("❌ Ошибка при изменении избранного:", error);
    }
  };

  if (hotel) {
    return (
      <>
        {isLiked ? (
          <HeartFilled
            onClick={toggleLike}
            style={{ color: "red", fontSize: "clamp(20px,3vw,35px)" }}
          />
        ) : (
          <HeartOutlined
            onClick={toggleLike}
            style={{ fontSize: "clamp(20px,3vw,35px)" }}
          />
        )}
      </>
    );
  }

  return (
    <div className={scss.heart} onClick={toggleLike}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        toastStyle={{ borderRadius: "8px", padding: "10px" }}
      />
      {isLiked ? (
        <FaHeart className={scss.heartIconRed} />
      ) : (
        <FaRegHeart className={scss.heartIcon} />
      )}
    </div>
  );
};

export default LikeHotel;
