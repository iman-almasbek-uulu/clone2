import { usePathname } from 'next/navigation';
import scss from './Place.module.scss';
import Places from './place/Places';
import PlacesPopular from './placesPopular/PlacesPopular';
import Tabs_content from './tabs_content/Tabs_content';
import { useGetPlaceQuery } from '@/redux/api/place';
import horse1 from "../../../../../assets/images/galleryImages/horse1.png";

const Place = () => {
    const pathName = usePathname();
    const id: number = Number(pathName.split("/")[2]);
    const { data, isLoading } = useGetPlaceQuery(id);
    if (isLoading) {
      return (
        <div className={scss.loading__container}>
          <div className={scss.horse}>
            <img src={horse1.src} alt="Horse 1" />
            <img src={horse1.src} alt="Horse 2" />
            <img src={horse1.src} alt="Horse 3" />
          </div>
        </div>
      );
    }
    if (!data) return null;
    return (
        <div id={scss.Place}>
            <Places data={data} />
            <Tabs_content />
            <PlacesPopular/>
        </div>
    );
};

export default Place;