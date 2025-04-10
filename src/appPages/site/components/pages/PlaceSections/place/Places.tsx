import PlaceInfo from "@/appPages/site/ui/placeInfo/PlaceInfo";
import { PLACE } from "@/redux/api/place/types";
import { FC } from "react";

interface CommonData {
  name: string;
  image: string;
  description: string;
}

interface PlacesProps {
  data: PLACE.PlaceResponse
}

const Places: FC<PlacesProps> = ({data}) => {


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
