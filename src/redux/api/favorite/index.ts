import { api as index } from "..";
import { FAVORITE } from "./types";

const api = index.injectEndpoints({
  endpoints: (build) => ({
    postFavorite: build.mutation<
      FAVORITE.FavoriteResponse,
      FAVORITE.FavoriteRequest
    >({
      query: (body) => ({
        url: `favorites/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["favorite"],
    }),
    GetFavorite: build.query<
      FAVORITE.GetFavoriteResponse,
      FAVORITE.GetFavoriteRequest
    >({
      query: () => ({
        url: "/favorites/list/",
        method: "GET",
      }),
      providesTags: ["favorite"],
    }),
    DeleteFavorite: build.mutation<
      FAVORITE.DeleteFavoriteResponse,
      FAVORITE.DeleteFavoriteRequest // Исправлено с DeleteteFavoriteRequest на DeleteFavoriteRequest
    >({
      query: (data) => ({
        url: `/favorites/${data.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["favorite"],
    }),
  }),
});
export const {
  useDeleteFavoriteMutation,
  useGetFavoriteQuery,
  usePostFavoriteMutation,
} = api;