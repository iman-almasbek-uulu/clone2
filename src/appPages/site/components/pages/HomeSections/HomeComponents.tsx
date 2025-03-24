import React from 'react';
import {Hero} from './hero/Hero';
import About from './about/About';
import Map from './map/Map';
import Attractions from './attractions/Attractions';
import HomeCulture from './culture/HomeCulture';
const HomeSection = () => {
    return (
        <div>
            <Hero/>
            <About/>
            <Attractions/>
            <HomeCulture/>
            <Map/>
        </div>
    );
};

export default HomeSection;
