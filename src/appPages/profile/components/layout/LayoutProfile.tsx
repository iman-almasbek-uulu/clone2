import scss from "./LayoutProfile.module.scss";
import { FC, ReactNode } from "react";
import HeaderProfile from "./HeaderProfile/HeaderProfile";

interface LayoutProfileProps {
  children: ReactNode;
}

const LayoutProfile: FC<LayoutProfileProps> = ({ children }) => {
  return (
    <div className={scss.LayoutProfile}>
        <div className={scss.content}>
          <div className={scss.headerDeckstop}>
            <HeaderProfile />
          </div>
          <main className={scss.mainDeckstop}>
            {children}
          </main>
        </div>
    </div>
  );
};

export default LayoutProfile;
