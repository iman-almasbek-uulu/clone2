"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import scss from "./SearchProfile.module.scss";
import { FC, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Search from "@/assets/icons/SearchBtn.svg";
import Image from "next/image";
import { useGetHotelsQuery, useGetKitchensQuery } from "@/redux/api/place";
import { useGetAttractionsQuery } from "@/redux/api/home";
import { useGetPopularPlacesQuery } from "@/redux/api/regions";
import useTranslate from "@/appPages/site/hooks/translate/translate";
interface PopularPlace {
  id: number;
  popular_name: string;
  popular_image: string;
  avg_rating: number;
  rating_count: number;
  region: string;
}

interface Hotel {
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

interface Kitchen {
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

interface Attraction {
  id: number;
  attraction_name: string;
  region_category: string;
  main_image: string;
  description: string;
  avg_rating: number;
  rating_count: number;
  popular_places: number;
}

interface SearchProps {
  search: string;
}

interface SearchResult {
  places: PopularPlace[];
  hotels: Hotel[];
  kitchens: Kitchen[];
  attractions: Attraction[];
}

const SearchProfile: FC = () => {
  const { t } = useTranslate();
  const { data: place } = useGetPopularPlacesQuery();
  const { data: hotel } = useGetHotelsQuery();
  const { data: kitchen } = useGetKitchensQuery();
  const { data: attraction } = useGetAttractionsQuery();
  
  const [searchResults, setSearchResults] = useState<SearchResult>({
    places: [],
    hotels: [],
    kitchens: [],
    attractions: []
  });
  const [showResults, setShowResults] = useState(false);

  const { register, handleSubmit, watch } = useForm<SearchProps>();
  const searchValue = watch("search");

  useEffect(() => {
    if (searchValue && place && hotel && kitchen && attraction) {
      const results = {
        places: place.filter(p => 
          p.popular_name.toLowerCase().includes(searchValue.toLowerCase())
        ),
        hotels: hotel.filter(h => 
          h.name.toLowerCase().includes(searchValue.toLowerCase())
        ),
        kitchens: kitchen.filter(k => 
          k.kitchen_name.toLowerCase().includes(searchValue.toLowerCase())
        ),
        attractions: attraction.filter(a => 
          a.attraction_name.toLowerCase().includes(searchValue.toLowerCase())
        )
      };
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchValue, place, hotel, kitchen, attraction]);

  const onSubmit: SubmitHandler<SearchProps> = () => {
    console.log("Search submitted:", searchValue);
  };

  return (
    <section className={scss.SearchProfile}>
      <div className={scss.content}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={scss.inputWrapper}>
            <FiSearch className={scss.icon} />
            <input 
              type="search" 
              placeholder={t("Поиск", "بحث", "Search")} 
              {...register("search")} 
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onFocus={() => searchValue && setShowResults(true)}
            />
          </div>
          <button type="submit">
            <Image src={Search} alt={t("Поиск", "بحث", "Search")} />
          </button>
        </form>

        {showResults && (
          <div className={scss.searchResults}>
            {searchResults.places.length > 0 && (
              <div className={scss.resultSection}>
                <h3>{t("Места", "أماكن", "Places")}</h3>
                <ul>
                  {searchResults.places.map(place => (
                    <li key={`place-${place.id}`}>{place.popular_name}</li>
                  ))}
                </ul>
              </div>
            )}

            {searchResults.hotels.length > 0 && (
              <div className={scss.resultSection}>
                <h3>{t("Отели", "فنادق", "Hotels")}</h3>
                <ul>
                  {searchResults.hotels.map(hotel => (
                    <li key={`hotel-${hotel.id}`}>{hotel.name}</li>
                  ))}
                </ul>
              </div>
            )}

            {searchResults.kitchens.length > 0 && (
              <div className={scss.resultSection}>
                <h3>{t("Кухни", "مطابخ", "Kitchens")}</h3>
                <ul>
                  {searchResults.kitchens.map(kitchen => (
                    <li key={`kitchen-${kitchen.id}`}>{kitchen.kitchen_name}</li>
                  ))}
                </ul>
              </div>
            )}

            {searchResults.attractions.length > 0 && (
              <div className={scss.resultSection}>
                <h3>{t("Достопримечательности", "معالم", "Attractions")}</h3>
                <ul>
                  {searchResults.attractions.map(attraction => (
                    <li key={`attraction-${attraction.id}`}>{attraction.attraction_name}</li>
                  ))}
                </ul>
              </div>
            )}

            {Object.values(searchResults).every(arr => arr.length === 0) && (
              <div className={scss.noResults}>
                {t("Ничего не найдено", "لا توجد نتائج", "No results found")}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchProfile;