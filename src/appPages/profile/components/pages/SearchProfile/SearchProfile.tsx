"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import scss from "./SearchProfile.module.scss";
import { FC, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Search from "@/assets/icons/SearchBtn.svg";
import Image from "next/image";
interface SearchProps {
  search: string;
}

const SearchProfile: FC = () => {
  const { register, handleSubmit, watch } = useForm<SearchProps>();
  const searchValue = watch("search");
  useEffect(() => {
    if (searchValue) {
      console.log("Ищем:", searchValue); // Здесь можно вызывать API или фильтровать данные
    }
  }, [searchValue]);
  const onSubmit: SubmitHandler<SearchProps> = () => {};
  return (
    <section className={scss.SearchProfile}>
      <div className={scss.content}>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className={scss.inputWrapper}>
            <FiSearch className={scss.icon} /> {/* Иконка поиска */}
            <input type="search" placeholder="Search" {...register("search")} />
          </div>
          <button type="submit">
            <Image src={Search} alt="" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default SearchProfile;
