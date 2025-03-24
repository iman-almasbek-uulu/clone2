// components/LanguageSelector.tsx
import { useEffect, useState, useRef } from "react";
import scss from "../Header.module.scss";
import { ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
  lang: string;
  isRotate: boolean;
  setIsRotate: (value: boolean) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  lang,
  isRotate,
  setIsRotate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const languages = ["ru", "ar", "en"];
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langSelectRef = useRef<HTMLDivElement>(null); // Новый реф для селектора

  const handleLanguageChange = (value: string) => {
    localStorage.setItem("lang", value);
    window.location.reload();
  };

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang && storedLang !== lang) {
      handleLanguageChange(storedLang);
    }
  }, [lang]);

  // Обработчик клика вне дропдауна
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        langSelectRef.current &&
        !langSelectRef.current.contains(target) // Исключаем селектор
      ) {
        setIsOpen(false);
        setIsRotate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen, setIsRotate]);

  // Обработчик клика на селектор языка
  const handleToggleDropdown = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsRotate(false);
    } else {
      setIsOpen(true);
      setIsRotate(true);
    }
  };

  return (
    <div className={scss.languageSelector}>
      <div
        ref={langSelectRef} // Привязываем реф к селектору
        style={
          isOpen
            ? { background: "#FFFFFF99", backdropFilter: "blur(4px)", borderBottom: 0 }
            : { background: "transparent" }
        }
        className={`${scss.langSelect} ${isOpen ? scss.open : ""}`}
        onClick={handleToggleDropdown}
      >
        <span>{lang.toUpperCase()}</span>
        <ChevronDown
          size={14}
          style={{
            transform: `rotate(${isRotate ? 180 : 0}deg)`,
            transition: "transform 0.1s ease-in-out",
            marginLeft: "5px",
          }}
        />
      </div>

      {isOpen && (
        <div className={scss.languageDropdown} ref={dropdownRef}>
          {languages.map((value) => (
            <div
              key={value}
              className={scss.languageOption}
              onClick={() => {
                handleLanguageChange(value);
                setIsOpen(false);
                setIsRotate(false);
              }}
            >
              <span>{value.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};