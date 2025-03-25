import { api as index } from "..";
import { REGION_LIST } from "./types";
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
  }),
});

export const { useGetRegionListQuery, useGetPopularPlacesQuery } = api;
