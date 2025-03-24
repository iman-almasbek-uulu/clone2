"use client";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "./Try.module.scss";
import { useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import { REGION_LIST } from "@/redux/api/regions/types";

interface TryProps {
  region: REGION_LIST.RegionResponse;
}

const Try: React.FC<TryProps> = ({ region }) => {
  const { t } = useTranslate();
  const [currentContent, setCurrentContent] = useState<number>(0);

  return (
    <section id={scss.Try}>
      <div className="container">
        <h2>
          {t("Что попробовать в ", "ماذا تحاول في ", `What to try in `)}
          {region.region_name}?
        </h2>
        <div className={scss.content}>
          <div className={scss.item}>
            <h4>{region.What_to_try[currentContent]?.to_name}</h4>
            <p>{region?.What_to_try[currentContent]?.first_description}</p>
          </div>
          <div className={scss.imgs}>
            <Image 
              src={region?.What_to_try[currentContent]?.image} 
              alt={region?.What_to_try[currentContent]?.to_name || "Dish image"} 
              width={500}
              height={350}
              style={{ objectFit: "cover" }}
            />
            <div>
              <div className={scss.bg}>
                <Image 
                  src={region?.What_to_try[currentContent]?.image} 
                  alt={region?.What_to_try[currentContent]?.to_name || "Dish image"} 
                  width={250}
                  height={175}
                  style={{ objectFit: "cover" }}
                />
              </div>
              {region?.What_to_try.map((el, i) =>
                i !== currentContent ? (
                  <div key={i} className={scss.bg}>
                    <div></div>
                    <Image 
                      src={el.image} 
                      alt={el.to_name || "Dish image"} 
                      width={250}
                      height={175}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : null
              )}
            </div>
          </div>
          <div className={scss.item}>
            <h4>
              {t(
                "Что входит в состав блюда",
                "ما الذي يحتويه الطبق",
                "What is included in the dish"
              )}
            </h4>
            <p>{region?.What_to_try[currentContent]?.second_description}</p>
          </div>
        </div>
        <div className={scss.tabs}>
          <button
            disabled={currentContent === 0}
            onClick={() => setCurrentContent(currentContent - 1)}
          >
            <LeftOutlined style={{fontSize: "12px", fontWeight: "bold"} }/>
            
          </button>
          <div className={scss.index}>
            {region?.What_to_try.map((el, i) => (
              <button
                key={i}
                style={
                  i === currentContent
                    ? {
                        background: "#004A60",
                        borderRadius: "30px",
                        color: "white",
                      }
                    : undefined
                }
                onClick={() => setCurrentContent(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            disabled={currentContent === (region?.What_to_try ?? []).length - 1}
            onClick={() => setCurrentContent(currentContent + 1)}
          >
            <RightOutlined style={{fontSize: "12px"}}/>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Try;