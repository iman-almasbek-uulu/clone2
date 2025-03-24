"use client";
import dynamic from "next/dynamic";

// Динамический импорт National_clothes с отключением SSR
const National_clothes = dynamic(
  () => import("@/appPages/site/components/pages/CultureSections/National_clothes/National_clothes"),
  { ssr: false }
);

const page = () => <National_clothes />;

export default page;