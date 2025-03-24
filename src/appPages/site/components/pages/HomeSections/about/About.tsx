import React, { useState } from "react";
import scss from "../about/About.module.scss";
import Image from "next/image";
import imgNone from "@/assets/images/universalImage/none.png";
import img from "@/assets/images/homeImages/bishkek.jpg";
import useTranslate from "@/appPages/site/hooks/translate/translate";

const About = () => {
  const { t } = useTranslate();
  const [error, setError] = useState(false);

  return (
    <div id={scss.About}>
      <div className="container">
        <div className={scss.About}>
          <h2 className={`${scss.herotitle} ${scss.hidden}`}>
            {t("Бишкек", "عن بيشكيك", "Bishkek")}
          </h2>
          <Image
            src={error || !img ? imgNone : img}
            alt={"Bishkek"}
            width={400}
            height={300}
            className={scss.heroimg}
            onError={() => setError(true)}
          />
          <div className={scss.content}>
            <h1 className={scss.herotitle}>
              {t("Бишкек", "عن بيشكيك", "Bishkek")}
            </h1>
            <p className={scss.herotext}>
              {t(
                "Это столица живописной горной страны - Кыргызстан, откуда туристы отправляются на всемирно известное, кристально чистое озеро Иссык-Куль и другие природные достопримечательности Тянь-Шаня. Окруженный горами, город богат красивыми видами, монументальными памятниками, парками и музейными древностями.",
                "هذه هي عاصمة دولة جبلية خلابة - قيرغيزستان، حيث يقوم السياح برحلات إلى بحيرة إيسيك كول الشهيرة عالميًا والواضحة كالبلور وغيرها من المعالم الطبيعية لجبال تيان شان. محاطًا بالجبال، المدينة غنية بالمناظر الجميلة، النصب التذكارية، الحدائق والآثار المتحفية.",
                "This is the capital of a picturesque mountainous country - Kyrgyzstan, from where tourists make trips to the world-famous, crystal-clear Issyk-Kul and other natural attractions of the Tien Shan. Framed by mountains, the city is rich in beautiful views, monumental monuments, parks and museum antiquities."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;