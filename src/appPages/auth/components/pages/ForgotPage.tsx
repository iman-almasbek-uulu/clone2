import scss from "./ForgotPage.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { usePostForgotPasswordMutation } from "@/redux/api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useTranslate from "@/appPages/site/hooks/translate/translate";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Определяем тип для ошибки, возвращаемой RTK Query
type ApiError = FetchBaseQueryError & {
  data?: {
    data?: {
      email?: string[];
    };
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9@._-]*$/; // Разрешаем только английские буквы, цифры и символы @ . _ -
    if (!regex.test(value)) {
      e.target.value = value.replace(/[^A-Za-z0-9@._-]/g, ''); // Удаляем все недопустимые символы
    }
  };

  const onSubmit: SubmitHandler<AUTH.PostForgotPasswordRequest> = async (data) => {
    try {
      const response = await postForgotPassword(data).unwrap();
      alert(response.status);
      router.push("/auth/reset_password");
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Ошибка запроса:", apiError);
      alert(apiError?.data?.data?.email?.[0] || "Ошибка при отправке запроса.");
    }
  };

  return (
    <section className={scss.ForgotPage}>
      <h1>{t("Забыли пароль?", "نسيت كلمة المرور؟", "Forgot password?")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={scss.form}>
        <input
          type="email"
          placeholder={t("Введите email", "أدخل البريد الإلكتروني", "Enter email")}
          {...register("email", {
            required: t("Введите email", "أدخل البريد الإلكتروني", "Enter email"),
          })}
          onChange={handleInput}
        />
        {errors.email && <p className={scss.error}>{errors.email.message}</p>}
        <button type="submit">{t("Отправить письмо сброса", "إرسال بريد إعادة التعيين", "Send reset email")}</button>
      </form>
      <div className={scss.links}>
        <p>{t("У вас уже есть аккаунт?", "هل لديك حساب؟", "Already have an account?")}</p>
        <Link href="/auth/sign-in" className={scss.link}>
          {t("Войти", "تسجيل الدخول", "Sign in")}
        </Link>
      </div>
    </section>
  );
};

export default ForgotPage;