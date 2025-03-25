namespace REGION_LIST {
  export type WhatToTryItemResponse = {
    to_name: string;
    first_description: string;
    second_description: string;
    image: string;
  }[];

  export type WhatToTryItemRequest = void;

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
