import React, { FC, useState, useEffect } from "react";
import scss from "./LikePost.module.scss";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  useDeleteFavoriteMutation,
  useGetFavoriteQuery,
  usePostFavoriteMutation,
} from "@/redux/api/regions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetMeQuery } from "@/redux/api/auth";

interface LikePostProps {
  postId: number;
}

const LikePost: FC<LikePostProps> = ({ postId }) => {
  const { data: user } = useGetMeQuery();
  const [postFavorite] = usePostFavoriteMutation();
  const [deleteFavorite] = useDeleteFavoriteMutation();
  const { data, refetch } = useGetFavoriteQuery();
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    setIsLiked(data?.some((el) => el.popular_place?.id === postId) ?? false);
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

      const favoriteItem = data.find((el) => el.popular_place?.id === postId);

      if (isLiked && favoriteItem) {
        await deleteFavorite({ id: favoriteItem.id }).unwrap();
      } else {
        await postFavorite({
          popular_place: postId,
          like: true,
        }).unwrap();
      }
      refetch();
    } catch (error) {
      console.error("❌ Ошибка при изменении избранного:", error);
    }
  };

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

export default LikePost;
