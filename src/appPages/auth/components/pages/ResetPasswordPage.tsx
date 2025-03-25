"use client";
import scss from "./ResetPasswordPage.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { usePostResetPasswordMutation } from "@/redux/api/auth";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import useTranslate from "@/appPages/site/hooks/translate/translate";

const InputPassword = dynamic(
  () => import("antd").then((mod) => mod.Input.Password),
  { ssr: false }
);

type ApiError = {
  data?: {
    message: string;
  };
  status?: number;
};

const ResetPasswordPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AUTH.PostResetPasswordRequest>();
  const [postResetPassword] = usePostResetPasswordMutation();
  const router = useRouter();
  const { t } = useTranslate();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9!@#$%^&*_.]*$/; 
    if (!regex.test(value)) {
      e.target.value = value.replace(/[^A-Za-z0-9!@#$%^&*_.]/g, ''); 
    }
  };

  const showModal = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    router.push("/auth/sign-in");
  };

  const onSubmit: SubmitHandler<AUTH.PostResetPasswordRequest> = async (data) => {
    try {
      const response = await postResetPassword({
        email: data.email,
        reset_code: data.reset_code,
        new_password: data.new_password,
      }).unwrap();
      showModal(response.message);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Ошибка:", apiError);
      showModal(apiError?.data?.message || "Ошибка при сбросе пароля.");
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <section className={scss.ResetPasswordPage}>
      <h1>{t("Новый пароль", "كلمة مرور جديدة", "New password")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={scss.form}>
        <InputPassword
          className={scss.castomInput}
          {...register("new_password", { required: t("Пароль обязателен", "كلمة المرور مطلوبة", "Password is required") })}
          placeholder={t("Пароль", "كلمة المرور", "Password")}
          onChange={handleInput}
        />
        {errors.new_password && (
          <p className={scss.error}>{errors.new_password.message}</p>
        )}

        <input
          type="text"
          placeholder={t("Введите email", "أدخل البريد الإلكتروني", "Enter email")}
          {...register("email", { required: t("Поле обязательно", "الحقل مطلوب", "Field is required") })}
        />
        {errors.email && <p className={scss.error}>{errors.email.message}</p>}

        <input
          type="text"
          placeholder={t("Введите код сброса", "أدخل رمز إعادة التعيين", "Enter reset code")}
          {...register("reset_code", { required: t("Поле обязательно", "الحقل مطلوب", "Field is required") })}
        />
        {errors.reset_code && (
          <p className={scss.error}>{errors.reset_code.message}</p>
        )}

        <button type="submit">{t("Сбросить пароль", "إعادة تعيين كلمة المرور", "Reset password")}</button>
      </form>

      <Modal
        title={t("Сообщение", "رسالة", "Message")}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>{modalMessage}</p>
      </Modal>
    </section>
  );
};

export default ResetPasswordPage;