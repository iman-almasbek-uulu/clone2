"use client";
import dynamic from "next/dynamic";

// Динамический импорт National_instruments с отключением SSR
const National_instruments = dynamic(
  () => import("@/appPages/site/components/pages/CultureSections/National_instruments/National_instruments"),
  { ssr: false }
);

const page = () => <National_instruments />;

export default page;