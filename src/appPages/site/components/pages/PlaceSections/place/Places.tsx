import { usePathname } from "next/navigation";
import { useGetPlaceQuery } from "@/redux/api/place";
import PlaceInfo from "@/appPages/site/ui/placeInfo/PlaceInfo";
import styles from "./Places.module.scss";
import horse1 from "../../../../../../assets/images/galleryImages/horse1.png";

interface CommonData {
  name: string;
  image: string;
  description: string;
}
const Places = () => {
  const pathName = usePathname();
  const id: number = Number(pathName.split("/")[2]);
  const { data, isLoading } = useGetPlaceQuery(id);
  if (isLoading) {
    return (
      <div className={styles.loading__container}>
        <div className={styles.horse}>
          <img src={horse1.src} alt="Horse 1" />
          <img src={horse1.src} alt="Horse 2" />
          <img src={horse1.src} alt="Horse 3" />
        </div>
      </div>
    );
  }
  if (!data) return null;

  const commonData: CommonData = {
    name: data.popular_name,
    image: data.popular_image,
    description: data.description,
  };

  return (
    <PlaceInfo data={commonData} lat={data.latitude} lon={data.longitude} />
  );
};

export default Places;
