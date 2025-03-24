interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  user_picture: string | null;
  from_user: string;
  cover_photo: string | null;
  birth_date: string;
}

interface Client {
  id: number
  first_name: string
  last_name: string
  user_picture: string
  from_user: string
}

interface Tickets {
  id: number;
  ticket: number;
  directions: string;
}

interface ReviewImage {
  id: number;
  image: string;
}

interface UserComment {
  id: number;
  comment: string;
  rating: number;
  created_date?: string; // Для отзывов об отелях
  created_at?: string;   // Для отзывов о кухне
  client_hotel?: Client;
  client_kitchen?: Client;
  hotel?: string;
  kitchen_region?: string;
  hotel_review_image?: ReviewImage[];
  kitchen_review_image?: ReviewImage[];
  atmosphere_rating?: number | null;
  nutrition_rating?: number | null;
  price_rating?: number | null;
  service_rating?: number | null;
}