import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import scss from "../../Header.module.scss";
import { Menu, X, ChevronDown } from "lucide-react";
import { UserProfile } from "../userProfile/UserProfile";
import { UserDataType } from "../../Header";

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

interface MobileNavigationProps {
  navItems: NavItem[];
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isActive: (path: string) => boolean;
  t: (ru: string, ar: string, en: string) => string;
  lang: string;
  userData: UserDataType;
  status: string;
  regions: Region[];
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  navItems,
  isOpen,
  setIsOpen,
  isActive,
  t,
  lang,
  userData,
  status,
  regions,
}) => {
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [localLang, setLocalLang] = useState(lang);
  const mobileMenuRef = useRef<HTMLDivElement>(null); // Реф для mobileMenu
  const regionDropdownRef = useRef<HTMLDivElement>(null); // Реф для дропдауна регионов
  const regionTriggerRef = useRef<HTMLButtonElement>(null); // Реф для кнопки "Регионы"
  const burgerButtonRef = useRef<HTMLButtonElement>(null); // Реф для кнопки бургера

  const handleLanguageChange = (newLang: string) => {
    localStorage.setItem("lang", newLang);
    setLocalLang(newLang);
    window.location.reload();
  };

  // Обработчик клика вне мобильного меню
  useEffect(() => {
    const handleClickOutsideMenu = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        burgerButtonRef.current &&
        !burgerButtonRef.current.contains(target) // Исключаем кнопку бургера
      ) {
        setIsOpen(false);
        setRegionsOpen(false); // Закрываем также дропдаун регионов
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => document.removeEventListener("mousedown", handleClickOutsideMenu);
  }, [setIsOpen]);

  // Обработчик клика вне дропдауна регионов
  useEffect(() => {
    const handleClickOutsideRegions = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        regionDropdownRef.current &&
        !regionDropdownRef.current.contains(target) &&
        regionTriggerRef.current &&
        !regionTriggerRef.current.contains(target) // Исключаем кнопку "Регионы"
      ) {
        setRegionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideRegions);
    return () => document.removeEventListener("mousedown", handleClickOutsideRegions);
  }, [regionDropdownRef, regionTriggerRef]);

  // Обработчик клика на "Регионы"
  const handleToggleRegions = () => {
    if (regionsOpen) {
      setRegionsOpen(false);
    } else {
      setRegionsOpen(true);
    }
  };

  return (
    <div className={scss.mobileNav}>
      {/* Верхняя панель */}
      <div className={scss.topBar}>
        <UserProfile userData={userData} status={status} />
        <button
          ref={burgerButtonRef} // Привязываем реф к кнопке бургера
          className={scss.burgerButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Мобильное меню */}
      <div
        ref={mobileMenuRef} // Привязываем реф к mobileMenu
        className={`${scss.mobileMenu} ${isOpen ? scss.open : ""}`}
      >
        {/* Дублированная кнопка закрытия */}
        <button className={scss.closeButtonInner} onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>

        <div className={scss.menuContent}>
          <nav className={scss.navItems}>
            {navItems.map((item) => (
              <div key={item.path} className={scss.navItem}>
                {item.path ? (
                  <Link
                    href={item.path}
                    className={`${scss.mobileLink} ${isActive(item.path) ? scss.active : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t(item.name.ru, item.name.ar, item.name.en)}
                  </Link>
                ) : (
                  <div className={scss.regionWrapper}>
                    <button
                      ref={regionTriggerRef}
                      className={scss.regionTrigger}
                      onClick={handleToggleRegions}
                    >
                      {t(item.name.ru, item.name.ar, item.name.en)}
                      <ChevronDown
                        className={`${scss.chevron} ${regionsOpen ? scss.rotated : ""}`}
                      />
                    </button>

                    {regionsOpen && (
                      <div className={scss.regionList} ref={regionDropdownRef}>
                        {regions.map((region) => (
                          <Link
                            key={region.path}
                            href={region.path}
                            className={scss.regionItem}
                            onClick={() => {
                              setIsOpen(false);
                              setRegionsOpen(false);
                            }}
                          >
                            {t(region.name[0], region.name[1], region.name[2])}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Вертикальный языковой переключатель */}
          <div className={scss.languageWrapper}>
            <button
              className={`${scss.langButton} ${localLang === "ru" ? scss.active : ""}`}
              onClick={() => handleLanguageChange("ru")}
            >
              Русский
            </button>
            <button
              className={`${scss.langButton} ${localLang === "ar" ? scss.active : ""}`}
              onClick={() => handleLanguageChange("ar")}
            >
              العربية
            </button>
            <button
              className={`${scss.langButton} ${localLang === "en" ? scss.active : ""}`}
              onClick={() => handleLanguageChange("en")}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};