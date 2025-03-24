import scss from './Place.module.scss';
import Places from './place/Places';
import PlacesPopular from './placesPopular/PlacesPopular';
import Tabs_content from './tabs_content/Tabs_content';

const Place = () => {
    return (
        <div id={scss.Place}>
            <Places />
            <Tabs_content />
            <PlacesPopular/>
        </div>
    );
};

export default Place;