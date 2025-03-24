import { usePathname } from "next/navigation";
import { useGetPlaceQuery } from "@/redux/api/place";
import PlaceInfo from "@/appPages/site/ui/placeInfo/PlaceInfo";
interface CommonData {
    name: string;
    image: string;
    description: string;
  }
const Places = () => {
  const pathName = usePathname();
  const id: number = Number(pathName.split("/")[2]);
  const { data } = useGetPlaceQuery(id);

  if (!data) return null;

  const commonData: CommonData = {
    name: data.popular_name,
    image: data.popular_image,
    description: data.description,
  };

  return <PlaceInfo data={commonData} lat={data.latitude} lon={data.longitude} />;
};

export default Places;
