import Link from "next/link";
import scss from "../../Header.module.scss";
import { usePathname } from "next/navigation";
import React, { useRef, useEffect } from "react";

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

interface DesktopNavigationProps {
  navItems: NavItem[];
  regions: Region[];
  isActive: (path: string) => boolean;
  isRegionOpen: boolean;
  setIsRegionOpen: (value: boolean) => void;
  t: (ru: string, ar: string, en: string) => string;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navItems,
  regions,
  isActive,
  isRegionOpen,
  setIsRegionOpen,
  t,
}) => {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const regionLinkRef = useRef<HTMLDivElement>(null); // Новый реф для элемента "Регионы"

  // Обработчик клика вне дропдауна
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        regionLinkRef.current &&
        !regionLinkRef.current.contains(target) // Исключаем клик на "Регионы"
      ) {
        setIsRegionOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsRegionOpen]);

  // Проверка, находится ли пользователь на странице одного из регионов
  const isRegionActive = regions.some((region) => pathname.startsWith(region.path));

  // Обработчик клика на "Регионы"
  const handleToggleRegions = () => {
    if (isRegionOpen) {
      setIsRegionOpen(false); // Закрываем, если уже открыт
    } else {
      setIsRegionOpen(true); // Открываем, если закрыт
    }
  };

  return (
    <nav className={scss.desktopNav}>
      <ul className={scss.navList}>
        {navItems.map((item) => (
          <li key={item.path} className={scss.navItem}>
            {item.path ? (
              <Link
                href={item.path}
                className={`${scss.navLink} ${isActive(item.path) ? scss.active : ""}`}
              >
                {t(item.name.ru, item.name.ar, item.name.en)}
              </Link>
            ) : (
              <div
                ref={regionLinkRef} // Привязываем реф к элементу "Регионы"
                className={`${scss.navLink} ${isRegionOpen || isRegionActive ? scss.active : ""}`}
                onClick={handleToggleRegions} // Используем новый обработчик
              >
                {t(item.name.ru, item.name.ar, item.name.en)}
                {isRegionOpen && (
                  <div className={scss.regionDropdownWrapper} ref={dropdownRef}>
                    <ul className={scss.regionList}>
                      {regions.map((region) => (
                        <li key={region.path} className={scss.regionItem}>
                          <Link
                            href={region.path}
                            onClick={() => setIsRegionOpen(false)} // Закрываем после выбора
                          >
                            {t(region.name[0], region.name[1], region.name[2])}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};