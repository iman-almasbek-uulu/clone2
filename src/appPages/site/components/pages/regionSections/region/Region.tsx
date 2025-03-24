import PlaceInfo from "@/appPages/site/ui/placeInfo/PlaceInfo";
import { REGION_LIST } from "@/redux/api/regions/types";

interface CommonData {
  name: string;
  image: string;
  description: string;
}

interface RegionProps {
  region: REGION_LIST.RegionResponse;
}

const Region: React.FC<RegionProps> = ({ region }) => {
  const commonData: CommonData = {
    name: region.region_name,
    image: region.region_image,
    description: region.region_description,
  };

  return <PlaceInfo lat={region.latitude} lon={region.longitude} data={commonData} />;
};

export default Region;