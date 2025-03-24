// Tab_hotel.tsx
import React, { useState } from "react";
import scss from "./Tab_hotel.module.scss";
import Hotel_list from "./hotel_list/Hotel_list";
import Hotel_info from "./hotel_info/Hotel_info";
import Reviews from "@/appPages/site/ui/reviews/Reviews";
import { useGetStaticReviewsQuery } from "@/redux/api/reviews";

interface TabHotelProps {
  isTab: number;
}

const Tab_hotel: React.FC<TabHotelProps> = ({ isTab }) => {
  const [isCurrent, setIsCurrent] = useState<number | null>(null);
  const { data: hotelStatic } = useGetStaticReviewsQuery({ entityType: "hotels" });
  const hotelStaticInfo = hotelStatic?.find((hotel) => hotel.id === isCurrent);

  return (
    <>
      <div className={scss.hotel}>
        <Hotel_list isCurrent={isCurrent} setIsCurrent={setIsCurrent} />
        <Hotel_info isCurrent={isCurrent} />
      </div>
      <Reviews isTab={isTab} isCurrent={isCurrent} reviewStatic={hotelStaticInfo} />
    </>
  );
};

export default Tab_hotel;