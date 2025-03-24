import React from "react";
import Region from "./region/Region";
import NavMap from "./navMap/NavMap";
import Try from "./try/Try";
import Places from "./places/Places";
import { useGetRegionListQuery } from "@/redux/api/regions";
import { usePathname } from "next/navigation";
import { REGION_LIST } from "@/redux/api/regions/types";

const Regions = () => {
  const { data, isLoading, isError } = useGetRegionListQuery();
  const pathName = usePathname();
  const routeName = pathName.split("/")[1];

  const region: REGION_LIST.RegionResponse | undefined = data?.find(
    (el) => el.region_category.toLocaleLowerCase() === routeName.toLowerCase()
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (!region) return <div>Region not found</div>;

  return (
    <>
      <Region region={region} /> 
      <NavMap />
      <Try region={region} />
      <Places />
    </>
  );
};

export default Regions;