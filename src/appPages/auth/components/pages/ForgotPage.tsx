"use client";
import scss from "./ForgotPage.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { usePostForgotPasswordMutation } from "@/redux/api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Modal, Button } from "antd";
import { useState } from "react";

type ApiError = FetchBaseQueryError & {
  data?: {
    data?: {
      email?: string[];
    };
    detail?: string;
  };
};

const ForgotPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AUTH.PostForgotPasswordRequest>();
  const [postForgotPassword] = usePostForgotPasswordMutation();
  const router = useRouter();
  const { t } = useTranslate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9@._-]*$/;
    if (!regex.test(value)) {
      e.target.value = value.replace(/[^A-Za-z0-9@._-]/g, "");
    }
  };

  const showModal = (content: string, isError = false) => {
    setModalContent(content);
    setIsErrorModal(isError);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (!isErrorModal) {
      router.push("/auth/reset_password");
    }
  };

  const onSubmit: SubmitHandler<AUTH.PostForgotPasswordRequest> = async (
    data
  ) => {
    try {
      const response = await postForgotPassword(data).unwrap();
      showModal(
        response.status ||
          t(
            "Письмо для сброса пароля отправлено",
            "تم إرسال بريد إعادة تعيين كلمة المرور",
            "Password reset email sent"
          )
      );
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Ошибка запроса:", apiError);

      if (apiError.status === 404 || 400) {
        showModal(
          apiError?.data?.data?.email?.[0] ||
            apiError?.data?.detail ||
            t(
              "Данный электронный адрес не зарегистрирован",
              "هذا البريد الإلكتروني غير مسجل",
              "We couldn't find an account associated with that email. Please try a different e-mail address."
            ),
          true
        );
      }
    }
  };

  return (
    <section className={scss.ForgotPage}>
      <h1>{t("Забыли пароль?", "نسيت كلمة المرور؟", "Forgot password?")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={scss.form}>
        <input
          type="email"
          placeholder={t(
            "Введите email",
            "أدخل البريد الإلكتروني",
            "Enter email"
          )}
          {...register("email", {
            required: t(
              "Введите email",
              "أدخل البريد الإلكتروني",
              "Enter email"
            ),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t(
                "Неверный формат email",
                "تنسيق البريد الإلكتروني غير صحيح",
                "Invalid email format"
              ),
            },
          })}
          onChange={handleInput}
        />
        {errors.email && <p className={scss.error}>{errors.email.message}</p>}
        <button type="submit">
          {t(
            "Отправить письмо сброса",
            "إرسال بريد إعادة التعيين",
            "Send reset email"
          )}
        </button>
      </form>
      <div className={scss.links}>
        <p>
          {t(
            "У вас уже есть аккаунт?",
            "هل لديك حساب؟",
            "Already have an account?"
          )}
        </p>
        <Link href="/auth/sign-in" className={scss.link}>
          {t("Войти", "تسجيل الدخول", "Sign in")}
        </Link>
      </div>

      <Modal
        title={
          isErrorModal
            ? t("Ошибка", "خطأ", "Error")
            : t("Успешно", "نجاح", "Success")
        }
        open={isModalOpen}
        onOk={handleOk}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <p>{modalContent}</p>
      </Modal>
    </section>
  );
};

export default ForgotPage;
