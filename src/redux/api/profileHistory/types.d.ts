// src/redux/api/profile/types.ts

// Определяем пространство имён для пользовательских отзывов
export namespace MY_REVIEWS {
  export type RawReviewResponse = (
    | AttractionReview
    | PopularPlaceReview
    | HotelReview
    | KitchenReview
  )[];
  // Общие типы
  export interface Client {
    id: number;
    first_name: string;
    last_name: string;
    user_picture: string;
    from_user: string;
  }

  // Модели данных
  export interface Attraction {
    id: number;
    attraction_name: string;
    region_category: string;
    main_image: string | null;
    description: string;
    popular_places: number;
    avg_rating: number;
    rating_count: number;
  }

  export interface PopularPlace {
    id: number;
    popular_name: string;
    popular_image: string;
    region: string;
    avg_rating: number;
    rating_count: number;
    address: string | null;
  }

  export interface Hotel {
    id: number;
    name: string;
    main_image: string;
    avg_rating: number;
    rating_count: number;
    region: string;
    popular_places: number;
    latitude: number | null;
    longitude: number | null;
  }

  export interface Kitchen {
    id: number;
    kitchen_name: string;
    price: number;
    popular_places: number;
    kitchen_region: string;
    type_of_cafe: string[];
    average_rating: number;
    rating_count: number;
    main_image: string;
  }

  // Типы изображений
  export interface AttractionReviewImage {
    id: number;
    image: string;
  }

  export interface PopularPlaceReviewImage {
    id: number;
    image: string;
  }

  export interface HotelReviewImage {
    id: number;
    image: string;
  }

  export interface KitchenReviewImage {
    id: number;
    image: string;
  }

  // Типы отзывов
  export interface AttractionReview {
    id: number;
    client: Client;
    attractions: Attraction;
    attraction_review_image: AttractionReviewImage[];
    comment: string;
    rating: number;
    created_date: string;
  }

  export interface PopularPlaceReview {
    id: number;
    client: Client;
    popular_place: PopularPlace;
    review_image: PopularPlaceReviewImage[];
    comment: string;
    rating: number;
    created_date: string;
  }

  export interface HotelReview {
    id: number;
    client: Client;
    hotel: Hotel;
    hotel_review_image: HotelReviewImage[];
    comment: string;
    rating: number;
    created_date: string;
  }

  export interface KitchenReview {
    id: number;
    client: Client;
    kitchen: Kitchen;
    kitchen_review_image: KitchenReviewImage[];
    comment: string;
    rating: number;
    nutrition_rating: number | null;
    service_rating: number | null;
    price_rating: number | null;
    atmosphere_rating: number | null;
    created_date: string;
  }

  // Тип, определяющий структуру ответа
  export namespace Responses {
    // Общий тип ответа для запроса пользовательских отзывов
    export interface GetReviews {
      // Совмещаем все типы отзывов в одном массиве
      // API возвращает массив, в котором могут быть разные типы отзывов
      data: (
        | AttractionReview
        | PopularPlaceReview
        | HotelReview
        | KitchenReview
      )[];
    }
  }

  // Утилиты для определения типа отзыва
  export namespace Utils {
    // Type guards для определения типа отзыва
    export function isAttractionReview(
      review: unknown
    ): review is AttractionReview {
      return (
        review !== null &&
        typeof review === "object" &&
        "attractions" in (review as Record<string, unknown>)
      );
    }

    export function isPopularPlaceReview(
      review: unknown
    ): review is PopularPlaceReview {
      return (
        review !== null &&
        typeof review === "object" &&
        "popular_place" in (review as Record<string, unknown>)
      );
    }

    export function isHotelReview(review: unknown): review is HotelReview {
      return (
        review !== null &&
        typeof review === "object" &&
        "hotel" in (review as Record<string, unknown>)
      );
    }

    export function isKitchenReview(review: unknown): review is KitchenReview {
      return (
        review !== null &&
        typeof review === "object" &&
        "kitchen" in (review as Record<string, unknown>)
      );
    }
  }
}
