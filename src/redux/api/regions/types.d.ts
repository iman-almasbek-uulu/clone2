namespace REGION_LIST {
  export type WhatToTryItemResponse = {
    to_name: string;
    first_description: string;
    second_description: string;
    image: string;
  }[];

  export type WhatToTryItemRequest = void;

  export type FavoriteResponse = {
    id: number;
    attractions?: number;
    popular_place?: number;
    kitchen?: number;
    hotels?: number;
    like: boolean;
    created_date: string;
  };

  export type FavoriteRequest = {
    attractions?: number;
    popular_place?: number;
    kitchen?: number;
    hotels?: number;
    like: boolean;
  };

  export type AttractionList = {
    id: number;
    attraction_name: string;
    region_category: string;
    main_image?: string;
    description: string;
    popular_places?: string;
    avg_rating?: number;
    rating_count?: number;
  };

  export type PopularPlacesList = {
    id: number;
    popular_name: string;
    popular_image?: string;
    region: string;
    avg_rating?: number;
    rating_count?: number;
    address?: string;
  };

  export type KitchenList = {
    id: number;
    kitchen_name: string;
    price: number;
    popular_places?: string;
    kitchen_region: string;
    type_of_cafe: string;
    average_rating?: number;
    rating_count?: number;
    main_image?: string;
  };

  export type HotelsList = {
    id: number;
    name: string;
    main_image?: string;
    avg_rating?: number;
    rating_count?: number;
    region: string;
    popular_places: string;
    latitude?: number;
    longitude?: number;
  };

  export type GetFavoriteResponse = {
    id: number;
    user: number;
    attractions?: AttractionList;
    popular_place?: PopularPlacesList;
    kitchen?: KitchenList;
    hotels?: HotelsList;
    like?: boolean;
    created_date?: string;
  }[];

  export type GetFavoriteRequest = void;

  export type DeleteFavoriteResponse = void;
  export type DeleteteFavoriteRequest = {
    id: number;
  };

  export type PopularResponse = {
    id: number;
    popular_name: string;
    popular_image: string;
    avg_rating: number;
    rating_count: number;
    region: string;
  }[];
  
  export type PopularRequest = void;

  export type RegionResponse = {
    id: number;
    region_name: string;
    region_image: string;
    region_description: string;
    What_to_try: WhatToTryItemResponse;
    popular_places: PopularResponse;
    region_category: string;
    latitude: string;
    longitude: string;
  };

  export type RegionRequest = void;

  export type PopularItem = {
    popular_name: string;
    popular_image: string;
    description: string;
    popular_reviews: unknown[]; // Заменил any на unknown
  };
}

// Экспортируем namespace для использования в других файлах
export { REGION_LIST };