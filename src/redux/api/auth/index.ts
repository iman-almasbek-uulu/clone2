import { api as index } from "..";

const api = index.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<AUTH.GetResponse, AUTH.GetRequest>({
      query: () => ({
        url: "/user_profile_list/",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
    patchMe: build.mutation<AUTH.PatchMeResponse, AUTH.PatchMeRequest>({
      query: (data) => ({
        url: "/user_profile_update/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    postLogin: build.mutation<AUTH.PostLoginResponse, AUTH.PostLoginRequest>({
      query: (data) => ({
        url: "/login/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    postRegistration: build.mutation<
      AUTH.PostRegistrationResponse,
      AUTH.PostRegistrationRequest
    >({
      query: (data) => ({
        url: "/register/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    postLogout: build.mutation<AUTH.PostLogoutResponse, AUTH.PostLogoutRequest>(
      {
        query: () => ({
          url: "/logout",
          method: "POST",
        }),
        invalidatesTags: ["auth"],
      }
    ),
    patchRefreshToken: build.mutation<
      AUTH.PatchRefreshResponse,
      AUTH.PatchRefreshRequest
    >({
      query: (data) => ({
        url: "/api/token/refresh/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    postForgotPassword: build.mutation<
      AUTH.PostForgotPasswordResponse,
      AUTH.PostForgotPasswordRequest
    >({
      query: (data) => ({
        url: "password_reset/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    postResetPassword: build.mutation<
      AUTH.PostResetPasswordResponse,
      AUTH.PostResetPasswordRequest
    >({
      query: (data) => ({
        url: "password_reset/verify_code/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    getFavoriteItems: build.query<AUTH.FavoriteItem[], void>({
      query: () => ({
        url: "/favorite_item/",
        method: "GET",
      }),
      providesTags: ["favorite"],
    })
  }),
});
export const {
  useGetMeQuery,
  usePatchMeMutation,
  usePostLoginMutation,
  usePostRegistrationMutation,
  usePostLogoutMutation,
  usePatchRefreshTokenMutation,
  usePostResetPasswordMutation,
  usePostForgotPasswordMutation,
  useGetFavoriteItemsQuery,
} = api;
