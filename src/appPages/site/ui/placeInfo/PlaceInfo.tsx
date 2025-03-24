"use client";
import scss from "./PlaceInfo.module.scss";
import groupPng from "@/assets/images/regions/Group.png";
import { useGetWeatherQuery } from "@/redux/weatherApi";
import Image from "next/image";

interface CommonData {
  name: string;
  image: string;
  description: string;
}

interface RegionProps {
  data: CommonData | null;
  lat?: string;
  lon?: string;
}

const PlaceInfo: React.FC<RegionProps> = ({ 
  data, 
  lat = "42.8746", 
  lon = "74.5698" 
}) => {
  // Хук должен быть вызван на верхнем уровне компонента, независимо от условий
  const { data: weatherData } = useGetWeatherQuery({ lat, lon });
  
  // Затем можно использовать условную логику для рендеринга
  if (!data) return null;
  
  return (
    <section id={scss.Places}>
      <div className="container">
        <div className={scss.region}>
          <div className={scss.img}>
            <Image src={data.image} alt={data.name} width={590} height={423} />
            <div className={scss.temperature}>
              <Image
                src={groupPng.src}
                alt="temperature"
                width={24}
                height={24}
              />
              <span>{weatherData?.main?.temp}°C</span>
            </div>
          </div>
          <div className={scss.block}>
            <h2>{data.name}</h2>
            <p>{data.description.slice(0, 470)}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaceInfo;