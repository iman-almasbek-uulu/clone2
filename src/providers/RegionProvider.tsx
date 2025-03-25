"use client";

import { useGetRegionListQuery } from "@/redux/api/regions";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";
import horse1 from "../assets/images/galleryImages/horse1.png";
import scss from "./RegionProvider.module.scss";

interface RegionProviderProps {
  children: ReactNode;
}

export const RegionProvider: FC<RegionProviderProps> = ({ children }) => {
  const pathName = usePathname();
  const router = useRouter();
  const { data, isLoading } = useGetRegionListQuery();

  useEffect(() => {
    if (!isLoading) {
      switch (pathName) {
        case "/talas":
        case "/chui":
        case "/issyk-kyl":
        case "/jalal-abad":
        case "/naryn":
        case "/osh":
        case "/batken":
          if (!data) {
            router.push("/404");
          }
          break;
        case "/404":
          if (data) {
            router.push("/talas");
          }
          break;
      }
    }
  }, [data, isLoading, pathName, router]);

  if (isLoading) {
    return (
      <div className={scss.loading__container}>
        <div className={scss.horse}>
          <img src={horse1.src} alt="Horse 1" />
          <img src={horse1.src} alt="Horse 2" />
          <img src={horse1.src} alt="Horse 3" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
