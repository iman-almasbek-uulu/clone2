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
import useTranslate from "@/appPages/site/hooks/translate/translate";

const Profile: FC = () => {
  const { t } = useTranslate();
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

    try {
      const response = await PatchMeRequest(userDataRest);
      if (response.data) {
        // window.location.reload();
      }
    } catch (e) {
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
        <h2 className="title">
          {t(
            "Персональная информация",
            "المعلومات الشخصية",
            "Personal information"
          )}
        </h2>
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
                    <p>{t("Имя", "الاسم", "Name")}</p>
                    <p>{t("Фамилия", "الكنية", "Surname")}</p>
                    <h3>{el?.first_name}</h3>
                    <h3>{el?.last_name}</h3>
                    <p>{t("Номер телефона", "رقم الهاتف", "Phone number")}</p>
                    <p>{t("Дата рождения", "تاريخ الميلاد", "Birth date")}</p>
                    <h3>{el?.phone_number}</h3>
                    <h3>{el?.birth_date}</h3>
                  </div>
                  <button onClick={() => setTab(!tab)}>
                    {t("Редактировать", "تعديل", "Edit")}
                  </button>
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
                placeholder={`${el.email! ? el.email : t(
                  "Email",
                  "البريد الإلكتروني",
                  "Email"
                )}`}
              />
              <div className={scss.userName}>
                <p>
                  {t("Имя", "الاسم", "Name")} <span>*</span>
                </p>
                <p>
                  {t("Фамилия", "الكنية", "Surname")} <span>*</span>
                </p>
                <input
                  type="text"
                  {...register("first_name", { required: true })}
                  placeholder={`${el.first_name! ? el.first_name : t(
                    "Имя",
                    "الاسم",
                    "Name"
                  )}`}
                />
                <input
                  type="text"
                  {...register("last_name", { required: true })}
                  placeholder={`${el.last_name! ? el.last_name : t(
                    "Фамилия",
                    "الكنية",
                    "Surname"
                  )}`}
                />
                <p>
                  {t("Номер телефона", "رقم الهاتف", "Phone number")} <span>*</span>
                </p>
                <p>
                  {t("Дата рождения", "تاريخ الميلاد", "Birth date")} <span>*</span>
                </p>
                <input
                  type="text"
                  {...register("phone_number", { required: true })}
                  placeholder={`${
                    el.phone_number! ? el.phone_number : t(
                      "Номер телефона",
                      "رقم الهاتف",
                      "Phone number"
                    )
                  }`}
                />
                <input
                  type="date"
                  {...register("birth_date", { required: true })}
                  placeholder={`${
                    el.birth_date! ? el.birth_date : t(
                      "Дата рождения",
                      "تاريخ الميلاد",
                      "Birth date"
                    )
                  }`}
                />
              </div>
              <button type="submit">
                {t("Сохранить", "حفظ", "Save")}
              </button>
            </form>
          ))
        )}
      </div>
    </section>
  );
};
export default Profile;