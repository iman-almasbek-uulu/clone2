import { api as index } from "..";
import {REGION_LIST} from "./types"
const api = index.injectEndpoints({
  endpoints: (builder) => ({
    getRegionList: builder.query<
      REGION_LIST.RegionResponse[],
      REGION_LIST.RegionRequest
    >({
      query: () => ({
        url: `/region`,
        method: "GET",
      }),
      providesTags: ["region"],
    }),
    getPopularPlaces: builder.query<
      REGION_LIST.PopularResponse,
      REGION_LIST.PopularRequest
    >({
      query: () => ({
        url: `/popular_places`,
        method: "GET",
      }),
      providesTags: ["places"],
    }),
    postFavorite: builder.mutation<
      REGION_LIST.FavoriteResponse,
      REGION_LIST.FavoriteRequest
    >({
      query: (body) => ({
        url: `favorites/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["places"],
    }),
    GetFavorite: builder.query<
      REGION_LIST.GetFavoriteResponse,
      REGION_LIST.GetFavoriteRequest
    >({
      query: () => ({
        url: "/favorites/list/",
        method: "GET",
      }),
      providesTags: ["places"],
    }),
    DeleteFavorite: builder.mutation<
      REGION_LIST.DeleteFavoriteResponse,
      REGION_LIST.DeleteteFavoriteRequest
    >({
      query: (data) => ({
        url: `/favorites/${data.id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["places"],
    }),
  }),
});

export const {
  useGetRegionListQuery,
  useGetPopularPlacesQuery,
  usePostFavoriteMutation,
  useGetFavoriteQuery,
  useDeleteFavoriteMutation,
} = api;
