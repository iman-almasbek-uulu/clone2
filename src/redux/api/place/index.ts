import { api as index } from "..";
import {PLACE} from "./types"
const api = index.injectEndpoints({
  endpoints: (builder) => ({
    getPlace: builder.query<PLACE.PlaceResponse, PLACE.PlaceRequest>({
      query: (_id) => ({
        url: `/popular_places/${_id}`,
        method: "GET",
      }),
      providesTags: ["place"],
    }),
    getKitchens: builder.query<PLACE.KitchenResponse, PLACE.KitchenRequest>({
      query: () => ({
        url: "/kitchen",
        method: "GET",
      }),
      providesTags: ["kitchens"],
    }),
    getKitchenID: builder.query<
      PLACE.kitchenIdResponse,
      PLACE.kitchenIdRequest
    >({
      query: (id) => ({
        url: `/kitchen/${id}`,
        method: "GET",
      }),
      providesTags: ["kitchenID"],
    }),
    getHotels: builder.query<PLACE.HotelsResponse, PLACE.HotelsRequest>({
      query: () => ({
        url: "/hotels/",
        method: "GET",
      }),
      providesTags: ["hotels"],
    }),
    getHotelID: builder.query<PLACE.HotelIDResponse, PLACE.HotelIDRequest>({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: "GET",
      }),
      providesTags: ["hotelID"],
    }),
    getAttractionID: builder.query<
      PLACE.AttractionIDResponse,
      PLACE.AttractionIDRequest
    >({
      query: (id) => ({
        url: `/attractions/${id}`,
        method: "GET",
      }),
      providesTags: ["attractionID"],
    }),
    getEventList: builder.query<PLACE.EventListResponse, PLACE.EventListRequest>({
      query: ({ category, date, search, ticket }) => {
        const params = new URLSearchParams();
    
        if (category) params.append("category", category);
        if (date) params.append("date", date);
        if (search) params.append("search", search);
        if (ticket) params.append("ticket", ticket)
        const queryString = params.toString();
        return {
          url: queryString ? `/event?${queryString}` : "/event",
          method: "GET",
        };
      },
      providesTags: ["EventList"],
    }),
    
    
  }),
});

export const {
  useGetPlaceQuery,
  useGetHotelsQuery,
  useGetKitchensQuery,
  useGetKitchenIDQuery,
  useGetHotelIDQuery,
  useGetAttractionIDQuery,
  useGetEventListQuery
} = api;
