// Tab_kitchen.tsx
import React, { useEffect, useState } from "react";
import scss from "./Tab_kitchen.module.scss";
import Cafes from "./cafes/Cafes";
import Cafe_item from "./cafe_item/Cafe_item";
import Reviews from "@/appPages/site/ui/reviews/Reviews";
import { useGetStaticReviewsQuery } from "@/redux/api/reviews";

interface TabKitchenProps {
  isTab: number;
}

const Tab_kitchen: React.FC<TabKitchenProps> = ({ isTab }) => {
  const [currentId, setCurrentId] = useState<number | null>(() => {
    const kitchen_id = sessionStorage.getItem("currentKitchenId")
    return kitchen_id !== null ? +kitchen_id : null
  });

  useEffect(() => {
    if (currentId !== null) {
      sessionStorage.setItem("currentKitchenId", currentId?.toString())
    }
  }, [currentId])

  const { data } = useGetStaticReviewsQuery({ entityType: "kitchen" });
  const kitchenStaticInfo = data?.find((kitchen) => kitchen.id === currentId);

  return (
    <>
      <div className={scss.kitchen}>
        <Cafes isCurrent={currentId} setIsCurrent={setCurrentId} />
        <Cafe_item isCurrent={currentId} />
      </div>
      <Reviews isTab={isTab} isCurrent={currentId} reviewStatic={kitchenStaticInfo} />
    </>
  );
};

export default Tab_kitchen;