import useTranslate from '@/appPages/site/hooks/translate/translate';
import scss from '../Cafe_item.module.scss';
import { FC } from 'react';

interface Props {
    data: {
        price: number;
        specialized_menu: string;
        meal_time: string[];
    }
}

const Cafe_middle: FC<Props> = ({data}) => {
    const {t} = useTranslate()
    return (
        <div className={scss.middle}>
            <h5>{t("Более подробно", "أكثر تفصيلاً", "More detailed")}</h5>
            <div>
              <p className={scss.title}>
                {t(" Диапазон цен", "نطاق السعر", "PRICE RANGE")}
              </p>
              <p
                className={scss.descr}
              >{`$${data?.price} - $${data?.price}`}</p>
            </div>
            <div>
              <p className={scss.title}>
                {t(
                  "Специализированное меню",
                  "قائمة متخصصة",
                  "Specialized menu"
                )}
              </p>
              <p className={scss.descr}>{data?.specialized_menu}</p>
            </div>
            <div>
              <p className={scss.title}>
                {t("Время приема пищи", "وقت الوجبة", "Meal time")}
              </p>
              <p className={scss.descr}>
                {data?.meal_time.map((item) => item + ", ")}
              </p>
            </div>
          </div>
    );
};

export default Cafe_middle;