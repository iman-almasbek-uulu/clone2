// Header.tsx
"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { RootState } from "@/redux/store";
import { useGetMeQuery } from "@/redux/api/auth";
import { useWindowSize } from "react-use";
import Link from "next/link";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import scss from "./Header.module.scss";
import { DesktopNavigation } from "./components/desktopNavigation/DesktopNavigation";
import { LanguageSelector } from "./components/LanguageSelector";
import { UserProfile } from "./components/userProfile/UserProfile";
import { MobileNavigation } from "./components/mobileNavigation/MobileNavigation";

// Типы
interface NavItem {
  name: {
    ru: string;
    ar: string;
    en: string;
  };
  path: string;
}

interface Region {
  name: string[];
  path: string;
}

// Тип для данных пользователя, соответствующий возвращаемому значению API
interface UserData {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  user_picture: string | null;
  from_user: string;
  cover_photo: string | null;
  birth_date: string;
  [key: string]: unknown; // Для других возможных полей
}

// Экспортируем тип для повторного использования в компонентах
export type UserDataType = UserData | UserData[] | null;

// Константы
const REGIONS: Region[] = [
  { name: ["Чуй", "شوي", "Chui"], path: "/chui" },
  { name: ["Ош", "أوش", "Osh"], path: "/osh" },
  { name: ["Джалал-Абад", "جلال أباد", "Jalal-Abad"], path: "/jalal-abad" },
  { name: ["Нарын", "نارين", "Naryn"], path: "/naryn" },
  { name: ["Талас", "تالاس", "Talas"], path: "/talas" },
  { name: ["Баткен", "باتكين", "Batken"], path: "/batken" },
  { name: ["Иссык-Куль", "إيسيك كول", "Issyk-Kul"], path: "/issyk-kul" },
];

const NAV_ITEMS: NavItem[] = [
  { name: { ru: "Главная", ar: "الرئيسية", en: "Home" }, path: "/" },
  { name: { ru: "Регионы", ar: "المناطق", en: "Regions" }, path: "" },
  { name: { ru: "Культура", ar: "الثقافة", en: "Culture" }, path: "/culture" },
  { name: { ru: "Галерея", ar: "معرض", en: "Gallery" }, path: "/gallery" },
  { name: { ru: "Маршруты", ar: "الطرق", en: "Routes" }, path: "/routes" },
];

// Главный компонент
const Header = () => {
  const { data: userData, status } = useGetMeQuery(); // Данные пользователя
  const { width } = useWindowSize(); // Ширина окна
  const { t } = useTranslate(); // Функция перевода
  const lang = useSelector<RootState, string>(
    (state) => state.translate.currentLang
  );
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Состояние мобильного меню
  const [isRegionOpen, setIsRegionOpen] = useState(false); // Состояние выпадающего списка регионов
  const [isLangRotate, setIsLangRotate] = useState(false); // Поворот стрелки языков

  // Закрытие меню при смене пути
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsRegionOpen(false);
  }, [pathname]);

  // Проверка активного пути
  const isActive = (path: string) =>
    path === "/" ? pathname === path : pathname.startsWith(path);

  return (
    <header className={scss.Header}>
      <div className="container">
        <div className={scss.content}>
          <Link href="/" className={scss.logo}>
            ЛОГО
          </Link>

          {width > 834 ? (
            <div className={scss.desktopLayout}>
              <DesktopNavigation
                navItems={NAV_ITEMS}
                regions={REGIONS}
                isActive={isActive}
                isRegionOpen={isRegionOpen}
                setIsRegionOpen={setIsRegionOpen}
                t={t}
              />
              <div className={scss.actions}>
                <LanguageSelector
                  lang={lang}
                  isRotate={isLangRotate}
                  setIsRotate={setIsLangRotate}
                />
                <UserProfile 
                  userData={userData as UserDataType} 
                  status={status} 
                />
              </div>
            </div>
          ) : (
            <MobileNavigation
              navItems={NAV_ITEMS}
              isOpen={isMobileMenuOpen}
              setIsOpen={setIsMobileMenuOpen}
              isActive={isActive}
              t={t}
              lang={lang}
              userData={userData as UserDataType}
              status={status}
              regions={REGIONS}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;