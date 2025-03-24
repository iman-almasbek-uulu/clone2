"use client";
import dynamic from "next/dynamic";

// Динамический импорт NoteFaund с отключением SSR
const NoteFaund = dynamic(
  () => import("@/appPages/site/ui/NoteFaund/NoteFaund"),
  { ssr: false }
);

const Page = () => {
  return (
    <div>
      <NoteFaund />
    </div>
  );
};

export default Page;