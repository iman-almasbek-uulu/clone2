import { api as index } from "..";
import {REVIEWS} from "./types"
const api = index.injectEndpoints({
  endpoints: (builder) => ({
    // Статистика
    getStaticReviews: builder.query<
      REVIEWS.StaticReview[],
      { entityType: string }
    >({
      query: ({ entityType }) => ({
        url: `/${entityType}${entityType === "popular_places" ? "_static" : "_review_static"}`,
        method: "GET",
      }),
      providesTags: (result, error, { entityType }) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "StaticReviews" as const,
                id: `${entityType}-${id}`,
              })),
              { type: "StaticReviews", id: entityType },
            ]
          : [{ type: "StaticReviews", id: entityType }],
      // transformResponse: (response: unknown[]): REVIEWS.StaticReview[] => {
      //   return (response as any[]).map((item) => ({
      //     id: item.id,
      //     name:
      //       item.kitchen_name ||
      //       item.popular_name ||
      //       item.name ||
      //       item.attraction_name,
      //     avgRating: item.avg_rating || item.average_rating || 0,
      //     ratingCount: item.rating_count || 0,
      //     excellent: item.excellent || 0,
      //     good: item.good || 0,
      //     notBad: item.not_bad || 0,
      //     bad: item.bad || 0,
      //     terribly: item.terribly || 0,
      //   }));
      // },
      transformResponse: (response: REVIEWS.RawStaticReviewResponse[]): REVIEWS.StaticReview[] => {
        return response.map((item) => ({
          id: item.id,
          name:
            item.kitchen_name ||
            item.popular_name ||
            item.name ||
            item.attraction_name,
          avgRating: item.avg_rating || item.average_rating || 0,
          ratingCount: item.rating_count || 0,
          excellent: item.excellent || 0,
          good: item.good || 0,
          notBad: item.not_bad || 0,
          bad: item.bad || 0,
          terribly: item.terribly || 0,
        }));
      },
    }),

    getReviews: builder.query<
      REVIEWS.Review[],
      { entityType: string; rating?: string; month?: string; search: string }
    >({
      query: ({ entityType, rating, month, search }) => ({
        url: `/${entityType}${entityType === "popular_places" ? "_review" : "_review_list"}`,
        method: "GET",
        params: { rating, month, search },
      }),
      providesTags: (result, error, { entityType }) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Reviews" as const,
                id: `${entityType}-${id}`,
              })),
              { type: "Reviews", id: entityType },
            ]
          : [{ type: "Reviews", id: entityType }],
      // transformResponse: (response: unknown[]): REVIEWS.Review[] => {
      //   return (response as any[]).map((item) => ({
      //     id: item.id,
      //     entityId:
      //       item.hotel || item.kitchen || item.attractions || item.popular_place || "unknown",
      //     client: item.client,
      //     comment: item.comment || item.comment,
      //     rating: item.rating,
      //     nutrition_rating: item.nutrition_rating,
      //     service_rating: item.service_rating,
      //     price_rating: item.price_rating,
      //     atmosphere_rating: item.atmosphere_rating,
      //     count_like: item.count_like || 0,
      //     reviewImages:
      //       item.hotel_review_image ||
      //       item.kitchen_review_image ||
      //       item.review_image ||
      //       item.attraction_review_image ||
      //       [],
      //     createdAt: item.created_at || item.created_date,
      //     replyReviews:
      //       item.reply_hotel_reviews?.map((reply: any) => ({
      //         id: reply.id,
      //         user: reply.user,
      //         comment: reply.comment,
      //         created_date: reply.created_date
      //       })) ||
      //       item.reply_attraction_reviews?.map((reply: any) => ({
      //         id: reply.id,
      //         user: reply.user,
      //         comment: reply.comment,
      //         created_date: reply.created_date
      //       })) ||
      //       item.reply_kitchen_reviews?.map((reply: any) => ({
      //         id: reply.id,
      //         user: reply.user,
      //         comment: reply.comment,
      //         created_date: reply.created_date
      //       })) ||
      //       item.reply_popular_places?.map((reply: any) => ({
      //         id: reply.id,
      //         user: reply.user,
      //         comment: reply.comment,
      //         created_date: reply.created_date
      //       })) ||
      //       [],
      //   }));
      // },
      transformResponse: (response: REVIEWS.RawReviewResponse[]): REVIEWS.Review[] => {
        return response.map((item) => ({
          id: item.id,
          entityId:
            item.hotel || item.kitchen || item.attractions || item.popular_place || "unknown",
          client: item.client,
          comment: item.comment || "",
          rating: item.rating,
          nutrition_rating: item.nutrition_rating,
          service_rating: item.service_rating,
          price_rating: item.price_rating,
          atmosphere_rating: item.atmosphere_rating,
          count_like: item.count_like || 0,
          reviewImages:
            item.hotel_review_image ||
            item.kitchen_review_image ||
            item.review_image ||
            item.attraction_review_image ||
            [],
          createdAt: item.created_at || item.created_date || "",
          replyReviews:
            item.reply_hotel_reviews?.map((reply) => ({
              id: reply.id,
              user: reply.user,
              comment: reply.comment,
              created_date: reply.created_date,
            })) ||
            item.reply_attraction_reviews?.map((reply) => ({
              id: reply.id,
              user: reply.user,
              comment: reply.comment,
              created_date: reply.created_date,
            })) ||
            item.reply_kitchen_reviews?.map((reply) => ({
              id: reply.id,
              user: reply.user,
              comment: reply.comment,
              created_date: reply.created_date,
            })) ||
            item.reply_popular_places?.map((reply) => ({
              id: reply.id,
              user: reply.user,
              comment: reply.comment,
              created_date: reply.created_date,
            })) ||
            [],
        }));
      },
    }),
    postRewiewHotel: builder.mutation<REVIEWS.RewiewHotelResponse, FormData>({
      query: (formData) => ({
        url: "/hotels_review_create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reviews"],
    }),
    postRewiewKitchen: builder.mutation<
      REVIEWS.ReviewKitchenResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/kitchen_review_create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reviews"],
    }),
    postRewiewAttraction: builder.mutation<
      REVIEWS.ReviewAttractionResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/attraction_review_create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reviews"],
    }),
    postRewiewPlaces: builder.mutation<REVIEWS.ReviewPlacesResponse, FormData>({
      query: (formData) => ({
        url: "/popular_places_review_create/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reviews"],
    }),
    postReplyAttraction: builder.mutation<
      REVIEWS.ReplyAttractionResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/reply_attraction_review/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reviews"],
    }),
    postReplyHotel: builder.mutation<REVIEWS.ReplyHotelResponse, FormData>({
      query: (formData) => ({
        url: "/reply_hotel_reviews/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reviews"],
    }),
    postReplyKitchen: builder.mutation<REVIEWS.ReplyKitchenResponse, FormData>({
      query: (formData) => ({
        url: "/reply_kitchen_reviews/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reviews"],
    }),
    postReplyPlace: builder.mutation<REVIEWS.ReplyPlaceResponse, FormData>({
      query: (formData) => ({
        url: "/reply_popular_places/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetStaticReviewsQuery,
  useGetReviewsQuery,
  usePostRewiewHotelMutation,
  usePostRewiewKitchenMutation,
  usePostRewiewAttractionMutation,
  usePostRewiewPlacesMutation,
  usePostReplyAttractionMutation,
  usePostReplyHotelMutation,
  usePostReplyKitchenMutation,
  usePostReplyPlaceMutation,
} = api;
