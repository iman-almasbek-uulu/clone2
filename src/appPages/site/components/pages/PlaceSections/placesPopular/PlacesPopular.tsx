"use client";
import scss from "./Places.module.scss";
import imgRight from "@/assets/images/regions/Arrow_alt_lright.png";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetRegionListQuery } from "@/redux/api/regions";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import Stars from "@/appPages/site/ui/stars/Stars";
import LikePost from "../../regionSections/places/LikePost";
import { REGION_LIST } from "@/redux/api/regions/types";

type TabsDataType = Record<number, REGION_LIST.PopularResponse>;

const PlacesPopular = () => {
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState(1);
  const pathName = usePathname();
  const routeName = pathName.split("/")[1];
  const routeID = pathName.split("/")[2];
  const { data } = useGetRegionListQuery();
  const findRegion = data?.find(
    (region) =>
      region.region_category.toLowerCase().replaceAll(" ", "") ===
      routeName.toLowerCase().replaceAll(" ", "")
  )?.popular_places;
  const popular_places = findRegion?.filter((el) => +el.id !== +routeID);

  const CARDS_PER_TAB = 3;
  const tabsData: TabsDataType = useMemo(() => {
    if (!findRegion || !popular_places) {
      return {};
    }

    const result: TabsDataType = {};
    const totalTabs = Math.ceil(popular_places.length / CARDS_PER_TAB);

    for (let i = 0; i < totalTabs; i++) {
      const startIndex = i * CARDS_PER_TAB;
      result[i + 1] = popular_places.slice(
        startIndex,
        startIndex + CARDS_PER_TAB
      );
    }

    return result;
  }, [findRegion, popular_places]);

  const totalTabs = Object.keys(tabsData).length;
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://placehold.co/600x400/e0e0e0/969696?text=Image+Not+Found";
    target.alt = "Image not available";
  };
  return (
    <>
      <section id={scss.Places}>
        <div className="container">
          <h2>{t("", "", "Popular places")}</h2>
          <div className={scss.list}>
            {tabsData[activeTab]?.map((item) => (
              <div key={item.id} className={scss.item}>
                {/* Используем компонент Image вместо img */}
                <Image 
                  src={item.popular_image} 
                  alt={item.popular_name || ""}
                  width={340}
                  height={271}
                  style={{ objectFit: "cover" }}
                  onError={handleImageError}
                />
                <div className={scss.block}>
                  <h6>{item.popular_name}</h6>
                  <div>
                    <span className={scss.grade}>{item.avg_rating}</span>
                    <Stars rating={item.avg_rating} width={9} height={9} />
                    <span className={scss.review}>
                      {item.rating_count} reviews
                    </span>
                  </div>
                </div>
                <LikePost postId={item.id} />
                <Link href={`/${routeName}/${item.id}`}>
                  {/* Заменяем img на Image для иконки стрелки */}
                  <Image 
                    className={scss.right} 
                    src={imgRight.src} 
                    alt="Открыть"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            ))}
          </div>
          {!tabsData[activeTab] && ""}
          {totalTabs > 1 && (
            <div className={scss.tabs}>
              {Array.from({ length: totalTabs }, (_, i) => i + 1).map(
                (el) => (
                  <button
                    style={{
                      background: activeTab === el ? "#3C5F63" : "transparent",
                    }}
                    key={el}
                    onClick={() => setActiveTab(el)}
                  >
                    {" "}
                    {el}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PlacesPopular;