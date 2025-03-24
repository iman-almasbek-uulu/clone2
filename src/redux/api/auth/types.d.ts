/* eslint-disable @typescript-eslint/no-unused-vars */
namespace AUTH {
  type GetResponse = {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number;
    user_picture: string | null;
    from_user: string;
    cover_photo: string | null;
    birth_date: string;
  }[];

  type GetRequest = void;

  type PatchMeResponse = {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    user_picture?: string | null;
    from_user?: string;
    cover_photo?: string | null;
    birth_date?: string;
  };

  type PatchMeRequest = {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    user_picture?: string | null;
    from_user?: string;
    cover_photo?: string | null;
    birth_date?: string;
  };

  type PostLoginResponse = {
    access: string;
    refresh: string;
  };

  type PostLoginRequest = {
    email: string;
    password: string;
  };

  type PostRegistrationResponse = {
    access: string;
    refresh: string;
  };

  type PostRegistrationRequest = {
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    birth_date: string;
  };

  type PostLogoutResponse = Record<string, unknown>; // Исправлено с `{}`
  type PostLogoutRequest = void;

  type PatchRefreshResponse = {
    refresh: string;
    access: string;
  };

  type PatchRefreshRequest = {
    refresh: string;
  };

  type PostForgotPasswordResponse = {
    status: string;
  };

  type PostForgotPasswordRequest = {
    email: string;
  };

  type PostResetPasswordResponse = {
    message: string;
  };

  type PostResetPasswordRequest = {
    email: string;
    reset_code: string;
    new_password: string;
  };

  type Attraction = {
    id: number;
    attraction_name: string;
    region_category: string;
    main_image: string;
    description: string;
    popular_places: string[];
    avg_rating: number;
    rating_count: number;
  };

  type PopularRegion = {
    id: number;
    popular_name: string;
    popular_image: string;
    region: string;
    avg_rating: number;
    rating_count: number;
    address?: string;
  };

  type Gallery = {
    id: number;
    gallery_name: string;
    gallery_image: string;
    address: string;
    avg_rating: number;
    rating_count: number;
  };

  type Kitchen = {
    id: number;
    kitchen_name: string;
    price: string;
    popular_places: string[];
    kitchen_region: string;
    type_of_cafe: string;
    average_rating: number;
    rating_count: number;
    main_image: string;
  };

  type Hotel = { // Исправлено с `Hote`
    id: number;
    name: string;
    main_image: string;
    avg_rating: number;
    rating_count: number;
    region: string;
    popular_places: string[];
    latitude?: number;
    longitude?: number;
  };

  type FavoriteItem = {
    id: number;
    user?: number;
    attractions?: Attraction;
    popular_region?: PopularRegion;
    gallery?: Gallery;
    hotels?: Hotel; // Исправлено с `Hote`
    kitchen?: Kitchen;
    like?: boolean;
    created_date?: string;
  };
}