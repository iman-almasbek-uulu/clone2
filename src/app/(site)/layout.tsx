"use client"
import LayoutSite from "@/appPages/site/components/layout/LayoutSide";
import { FC, ReactNode } from "react";

interface LayoutType {
  children: ReactNode
}



const Layout:FC<LayoutType> = ({children}) => {
  return (
    <div>
      <LayoutSite>{children}</LayoutSite>
    </div>
  );
};

export default Layout;
