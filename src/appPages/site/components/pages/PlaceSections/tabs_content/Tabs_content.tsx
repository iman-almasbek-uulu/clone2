"use client";
import { useState } from "react";
import scss from "./Tabs_content.module.scss";
import Tab_place from "./tab_place/Tab_place";
import Tab_kitchen from "./tab_kitchen/Tab_kitchen";
import Tab_event from "./tab_event/Tab_event";
import Tab_attractions from "./tab_attractions/Tab_attractions";
import Tab_hotel from "./tab_hotel/Tab_hotel";
import { MdAttractions, MdEvent, MdHotel, MdPlace } from "react-icons/md";
import { IconToolsKitchen } from "@tabler/icons-react";
import useTranslate from "@/appPages/site/hooks/translate/translate";

const Tabs_content = () => {
  const {t} = useTranslate()
  const tabsButton = [
    { id: 0, name: t("Места", "أماكن", "Place"), img: <MdPlace size={18} /> },
    { id: 1, name: t("Отель", "فندق", "Hotel"), img: <MdHotel size={18} /> },
    { id: 2, name: t("Кухня", "مطبخ", "Kitchen"), img: <IconToolsKitchen size={18} /> },
    { id: 3, name: t("Событие", "حدث", "Event"), img: <MdEvent /> },
    { id: 4, name: t("Достопримечательности", "مناطق الجذب", "Attractions"), img: <MdAttractions size={18} /> },
  ];



  const [isTab, setIsTab] = useState<number>(() => {
    const storedTab = sessionStorage.getItem("tab");
    return storedTab !== null ? +storedTab : 0;
  });

  return (
    <section id={scss.Tabs_content}>
      <div className="container">
        <div className={scss.tabs}>
          {tabsButton.map((tab) => (
            <button
              style={
                isTab === tab.id
                  ? { background: "#004A60", color: "white" }
                  : { background: "transparent" }
              }
              key={tab.id}
              onClick={() => {
                sessionStorage.setItem("tab", tab.id.toString());
                setIsTab(tab.id);
              }}
              className={isTab === tab.id ? scss.active : ""}
            >
              {tab.img}
              {tab.name}
            </button>
          ))}
        </div>

        <div className={scss.content}>
          {isTab === 0 && <Tab_place isTab={isTab} />}
          {isTab === 1 && <Tab_hotel isTab={isTab} />}
          {isTab === 2 && <Tab_kitchen isTab={isTab} />}
          {isTab === 3 && <Tab_event />}
          {isTab === 4 && <Tab_attractions isTab={isTab} />}
        </div>
      </div>
    </section>
  );
};

export default Tabs_content;