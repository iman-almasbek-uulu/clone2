namespace HOME {
  export type AttractionsResponse = {
    id: number;
    attraction_name: string;
    region_category: string;
    main_image: string; // Заменил any на string, предполагая что это URL изображения
    description: string;
    avg_rating: number;
    rating_count: number;
    popular_places: number;
  }[];

  export type AttractionsRequest = void;

  export type CultureListResponse = {
    id: number;
    culture_name: string;
    culture: string;
    culture_description: string;
    culture_image: string;
  }[];

  export type CultureListRequest = void;
}

// Экспортируем пространство имен для использования в других файлах
export { HOME };