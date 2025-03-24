"use client"; // Добавляем директиву, чтобы компонент был клиентским

import { useGetRegionListQuery } from "@/redux/api/regions";
import { usePathname, useRouter } from "next/navigation"; // Используем useRouter из Next.js
import { FC, ReactNode, useEffect } from "react";

interface RegionProviderProps {
  children: ReactNode;
}

export const RegionProvider: FC<RegionProviderProps> = ({ children }) => {
  const { data } = useGetRegionListQuery();

  const pathName = usePathname();
  const router = useRouter(); // Заменяем useNavigate на useRouter

  const handleNavigate = () => {
    switch (pathName) {
      case "/talas":
      case "/chui":
      case "/issyk-kyl":
      case "/jalal-abad":
      case "/naryn":
      case "/osh":
      case "/batken":
        if (!data) {
          router.push("/404"); // Используем router.push для навигации
        }
        break;
      case "/404":
        if (data) {
          router.push("/talas");
        }
        break;
    }
  };

  useEffect(() => {
    handleNavigate();
  }, [data, pathName, router]);

  return children;
};