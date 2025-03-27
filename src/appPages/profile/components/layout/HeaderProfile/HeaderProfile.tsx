"use client";
import { usePathname } from "next/navigation";
import scss from "./HeaderProfile.module.scss";
import Link from "next/link";
import Image from "next/image";
import vectorWite from "@/assets/icons/ProfileVector.svg";
import vector from "@/assets/icons/vectorWite.svg";
import { usePostLogoutMutation } from "@/redux/api/auth";
import { FC } from "react";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface Tab {
  label: string;
  path: string;
  translation: {
    ru: string;
    ar: string;
    en: string;
  };
}

const HeaderProfile: FC = () => {
  const { t } = useTranslate();
  const pathname = usePathname();
  const [logoutMutation] = usePostLogoutMutation();

  const logout = async () => {
    await logoutMutation();
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");
    window.location.reload();
  };

  const tabs: Tab[] = [
    { 
      label: "main", 
      path: "/", 
      translation: { ru: "Главная", ar: "الرئيسية", en: "Home" } 
    },
    { 
      label: "profile", 
      path: "/profile", 
      translation: { ru: "Профиль", ar: "الملف الشخصي", en: "Profile" } 
    },
    { 
      label: "comments", 
      path: "/profile/history", 
      translation: { ru: "Комментарии", ar: "التعليقات", en: "Comments" } 
    },
    { 
      label: "favorites", 
      path: "/profile/favorite", 
      translation: { ru: "Избранные", ar: "المفضلة", en: "Favorites" } 
    },
    { 
      label: "logout", 
      path: "", 
      translation: { ru: "Выйти", ar: "تسجيل خروج", en: "Logout" } 
    },
  ];

  const tabsMobile: Tab[] = [
    { 
      label: "main", 
      path: "/", 
      translation: { ru: "Главная", ar: "الرئيسية", en: "Home" } 
    },
    { 
      label: "profile", 
      path: "/profile", 
      translation: { ru: "Профиль", ar: "الملف الشخصي", en: "Profile" } 
    },
    { 
      label: "comments", 
      path: "/profile/history", 
      translation: { ru: "Комментарии", ar: "التعليقات", en: "Comments" } 
    },
    { 
      label: "favorites", 
      path: "/profile/favorite", 
      translation: { ru: "Избранные", ar: "المفضلة", en: "Favorites" } 
    },
    { 
      label: "logout", 
      path: "/profile/logout", 
      translation: { ru: "Выйти", ar: "تسجيل خروج", en: "Logout" } 
    },
  ];

  const getTranslatedLabel = (tab: Tab) => {
    return t(tab.translation.ru, tab.translation.ar, tab.translation.en);
  };

  return (
    <header className={scss.HeaderProfile}>
      <div className={scss.content}>
        <div className={scss.nav}>
          <form>
            <ul>
              {tabs.map((tab, idx) => (
                <li key={idx}>
                  <Link href={tab.path}>
                    <button
                      onClick={() => {
                        if (tab.label === "logout") {
                          logout();
                        }
                      }}
                      className={pathname === tab.path ? scss.active : ""}
                      type="submit"
                    >
                      {getTranslatedLabel(tab)}
                      <Image
                        src={pathname === tab.path ? vectorWite : vector}
                        alt="vector"
                      />
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
            <ul>
              {tabsMobile.map((tab, idx) => (
                <li key={idx}>
                  <Link href={tab.path}>
                    <button
                      onClick={() => {
                        if (tab.label === "logout") {
                          logout();
                        }
                      }}
                      className={pathname === tab.path ? scss.active : ""}
                      type="submit"
                    >
                      {getTranslatedLabel(tab)}
                      <Image
                        src={pathname === tab.path ? vectorWite : vector}
                        alt="vector"
                      />
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          </form>
        </div>
      </div>
    </header>
  );
};

export default HeaderProfile;