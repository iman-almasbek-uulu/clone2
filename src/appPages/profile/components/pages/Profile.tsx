"use client";
import scss from "./Profile.module.scss";
import { useGetMeQuery, usePatchMeMutation } from "@/redux/api/auth";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import SearchProfile from "./SearchProfile/SearchProfile";
import User from "./User/User";
import VisionProfile from "./VisionProfile/VisionProfile";
import { Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import BurgerMenu from "@/appPages/site/ui/BurgerMenu/BurgerMenu";

const Profile: FC = () => {
  const [tab, setTab] = useState(false);

  const [PatchMeRequest] = usePatchMeMutation();
  const { data: user } = useGetMeQuery();

  const { register, handleSubmit } = useForm<AUTH.PatchMeRequest>();

  const onSubmit: SubmitHandler<AUTH.PatchMeRequest> = async (userData) => {
    const userDataRest = {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number,
      birth_date: userData.birth_date,
    };
    console.log(
      "🚀 ~ constonSubmit:SubmitHandler<AUTH.PatchMeRequest>= ~ userDataRest:",
      userDataRest
    );

    try {
      const response = await PatchMeRequest(userDataRest);
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<AUTH.PatchMeRequest>= ~ response:",
        response
      );
      if (response.data) {
        // window.location.reload();
      }
    } catch (e) {
      console.log(
        "🚀 ~ constonSubmit:SubmitHandler<AUTH.PatchMeRequest>= ~ e:",
        e
      );
      console.error("An error occurred:", e);
    }
  };

  return (
    <section className={scss.Profile}>
      {user?.map((el) => (
        <div className={scss.headerMobile} key={el.id}>
          <h1 className={scss.logo}>LOGO</h1>
          <Space direction="vertical" size={16}>
            <Space wrap size={16}>
              <Avatar
                className={scss.avatar}
                icon={
                  el.user_picture ? (
                    <img src={el.user_picture} alt="avatar" />
                  ) : (
                    <UserOutlined />
                  )
                }
              />
            </Space>
          </Space>
          <div className={scss.burgerMenu}>
            <BurgerMenu />
          </div>
        </div>
      ))}
      <div className={scss.content}>
        <div className={scss.headerUser}>
          <SearchProfile />
          <User />
        </div>
        <h2 className="title">Personal information</h2>
        <div className={scss.ProfileCover}>
          <VisionProfile />
        </div>
        {!tab ? (
          <>
            {user?.map((el, index) => (
              <form key={el.id || index}>
                <>
                  <h3>{el?.email}</h3>
                  <div className={scss.userName}>
                    <p>Name</p>
                    <p>Surname</p>
                    <h3>{el?.first_name}</h3>
                    <h3>{el?.last_name}</h3>
                    <p>Phone number</p>
                    <p>Birth date</p>
                    <h3>{el?.phone_number}</h3>
                    <h3>{el?.birth_date}</h3>
                  </div>
                  <button onClick={() => setTab(!tab)}>Редактировать</button>
                </>
              </form>
            ))}
          </>
        ) : (
          user?.map((el) => (
            <form action="" onSubmit={handleSubmit(onSubmit)} key={el.id}>
              <input
                type="text"
                {...register("email", { required: true })}
                placeholder={`${el.email! ? el.email : "Email"}`}
              />
              <div className={scss.userName}>
                <p>
                  Name <span>*</span>
                </p>
                <p>
                  Surname <span>*</span>
                </p>
                <input
                  type="text"
                  {...register("first_name", { required: true })}
                  placeholder={`${el.first_name! ? el.first_name : "Name"}`}
                />
                <input
                  type="text"
                  {...register("last_name", { required: true })}
                  placeholder={`${el.last_name! ? el.last_name : "Surname"}`}
                />
                <p>
                  Phone number <span>*</span>
                </p>
                <p>
                  Birth date <span>*</span>
                </p>
                <input
                  type="text"
                  {...register("phone_number", { required: true })}
                  placeholder={`${
                    el.phone_number! ? el.phone_number : "Phone number"
                  }`}
                />
                <input
                  type="date"
                  {...register("birth_date", { required: true })}
                  placeholder={`${
                    el.birth_date! ? el.birth_date : "Birth date"
                  }`}
                />
              </div>
              <button type="submit">Сохранить</button>
            </form>
          ))
        )}
      </div>
    </section>
  );
};
export default Profile;
