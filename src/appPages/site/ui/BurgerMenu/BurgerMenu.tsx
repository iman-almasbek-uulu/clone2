import { useState } from "react";
import styles from "./BurgerMenu.module.scss";
import HeaderProfile from "@/appPages/profile/components/layout/HeaderProfile/HeaderProfile";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.burgerMenu}>
      {/* Кнопка бургер-меню */}
      <div
        className={`${styles.burgerIcon} ${isOpen ? styles.open : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Меню */}
      <div className={`${styles.menu} ${isOpen ? styles.open : ""}`}>
        <HeaderProfile/>
      </div>
    </div>
  );
};

export default BurgerMenu;