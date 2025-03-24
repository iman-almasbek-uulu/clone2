import scss from "./Cafe_item.module.scss";
import { FC } from "react";
import { useGetKitchenIDQuery } from "@/redux/api/place";
import GalleryImages from "@/appPages/site/ui/galleryImages/GalleryImages";
import Cafe_right from "./cafe_right/Cafe_right";
import Cafe_middle from "./cafe_middle/Cafe_middle";
import Cafe_left from "./cafe_left/Cafe_left";

interface propsType {
  isCurrent: number | null;
}

const Cafe_item: FC<propsType> = ({ isCurrent }) => {
  const { data, isLoading, isError } = useGetKitchenIDQuery(isCurrent);
  const images = data?.kitchen_image ?? [];

  if (isLoading) {
    return <div>loading</div>;
  }

  if (isError) {
    return null;
  }

  return (
    <div className={scss.cafe_item}>
      <h4>{data?.kitchen_name}</h4>
      <GalleryImages images={images} />
      <div className={scss.info}>
        <div>
          <Cafe_left data={data || null} />
        </div>
        <div>
          <Cafe_middle
            data={
              data || {
                price: 0,
                specialized_menu: "",
                meal_time: [],
              }
            }
          />
        </div>
        <div className={scss.container}>
          <Cafe_right cafeLocation={data?.kitchen || []} />{" "}
        </div>
      </div>
    </div>
  );
};

export default Cafe_item;