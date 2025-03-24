import { api as index } from "..";
import CULTURE from "./types";
export const api = index.injectEndpoints({
  endpoints: (build) => ({
    getGames: build.query<CULTURE.GamesResponse, CULTURE.GamesRequest>({
      query: () => ({
        url: `/games`,
        method: "GET",
      }),
      providesTags: ["games"],
    }),
    getCultureKitchen: build.query<
      CULTURE.CultureKitchenResponse,
      CULTURE.CultureKitchenRequest
    >({
      query: () => ({
        url: `/culture_kitchen`,
        method: "GET",
      }),
      providesTags: ["culture-kitchen"],
    }),
    getCultureKitchenMain: build.query<
      CULTURE.CultureKitchenMainResponse,
      void
    >({
      query: () => ({
        url: `/culture_kitchen_main/`,
        method: "GET",
      }),
      providesTags: ["culture-kitchen"],
    }),

    getCultureNationalClothes: build.query<
      CULTURE.CultureNationalClothesResponse,
      CULTURE.CultureNationalClothesRequest
    >({
      query: () => ({
        url: `/national_clothes`,
        method: "GET",
      }),
      providesTags: ["culture-national-clothes"],
    }),
    getNationalInstrument: build.query<
      CULTURE.CultureNationalInstrumentsResponse,
      CULTURE.CultureNationalInstrumentsRequest
    >({
      query: () => ({
        url: `/instruments`,
        method: "GET",
      }),
      providesTags: ["national-instrument"],
    }),
    getHandCrafts: build.query<
      CULTURE.CultureHand_craftsResponse,
      CULTURE.CultureHand_craftsRequest
    >({
      query: () => ({
        url: `/handcrafts`,
        method: "GET",
      }),
      providesTags: ["hand-crafts"],
    }),
    getCurency: build.query<CULTURE.CurrencyResponse, CULTURE.CurrencyRequest>({
      query: () => ({
        url: `/currency`,
        method: "GET",
      }),
      providesTags: ["currency"],
    }),
  }),
});

export const {
  useGetGamesQuery,
  useGetCultureKitchenQuery,
  useGetCultureNationalClothesQuery,
  useGetNationalInstrumentQuery,
  useGetCurencyQuery,
  useGetHandCraftsQuery,
  useGetCultureKitchenMainQuery,
} = api;
