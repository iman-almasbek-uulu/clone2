"use client";
import scss from "./SignInPage.module.scss";
import { usePostLoginMutation } from "@/redux/api/auth";
import { ConfigProvider, Input, Switch, Button, message } from "antd";
import Link from "next/link";
import { FC, useState } from "react";
import { SubmitHandler, useForm, Controller, Control, UseFormHandleSubmit, RegisterOptions, FieldErrors } from "react-hook-form";
import useTranslate from "@/appPages/site/hooks/translate/translate";

interface IFormInput {
  email: string;
  password: string;
}

interface InputFieldProps {
  name: keyof IFormInput;
  control: Control<IFormInput>;
  rules: RegisterOptions<IFormInput>;
  placeholder: string;
  errors: FieldErrors<IFormInput>;
}

const InputField: FC<InputFieldProps> = ({ name, control, rules, placeholder, errors }) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9@._-]*$/;
    if (!regex.test(value)) {
      e.target.value = value.replace(/[^A-Za-z0-9@._-]/g, '');
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Input
          status={errors[name] ? "error" : ""}
          className={scss.castomInput}
          placeholder={placeholder}
          {...field}
          onChange={(e) => {
            handleInput(e);
            field.onChange(e);
          }}
        />
      )}
    />
  );
};

interface PasswordFieldProps {
  name: keyof IFormInput;
  control: Control<IFormInput>;
  rules: RegisterOptions<IFormInput>;
  placeholder: string;
  errors: FieldErrors<IFormInput>;
}

const PasswordField: FC<PasswordFieldProps> = ({ name, control, rules, placeholder, errors }) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9!@#$%^&*()_+]*$/;
    if (!regex.test(value)) {
      e.target.value = value.replace(/[^A-Za-z0-9!@#$%^&*()_+]/g, '');
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorPrimary: "#407EC7",
            colorBorder: "transparent",
            controlOutline: "none",
            controlItemBgHover: "transparent",
            controlItemBgActive: "transparent",
          },
        },
      }}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Input.Password
            status={errors[name] ? "error" : ""}
            className={scss.castomInput}
            placeholder={placeholder}
            {...field}
            onChange={(e) => {
              handleInput(e);
              field.onChange(e);
            }}
          />
        )}
      />
    </ConfigProvider>
  );
};

interface LoginFormProps {
  handleSubmit: UseFormHandleSubmit<IFormInput>;
  control: Control<IFormInput>;
  errors: FieldErrors<IFormInput>;
  handleRememberMeChange: (checked: boolean) => void;
  onSubmit: SubmitHandler<IFormInput>;
  loginError?: string;
}

const LoginForm: FC<LoginFormProps> = ({
  handleSubmit,
  control,
  errors,
  handleRememberMeChange,
  onSubmit,
  loginError,
}) => {
  const { t } = useTranslate();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loginError && (
        <p className={scss.loginError}>
          <span>
          {t("Логин или пароль не верный", "اسم المستخدم أو كلمة المرور غير صحيحة", "Incorrect login or password")}</span>
        </p>
      )}
      
      {errors.email && <span className={scss.error}>{errors.email.message}</span>}
      <InputField
        name="email"
        control={control}
        rules={{ required: t("Email обязателен", "البريد الإلكتروني مطلوب", "Email is required") }}
        placeholder={t("Email", "البريد الإلكتروني", "Email")}
        errors={errors}
      />

      {errors.password && (
        <span className={scss.error}>{errors.password.message}</span>
      )}
      <PasswordField
        name="password"
        control={control}
        rules={{ required: t("Пароль обязателен", "كلمة المرور مطلوبة", "Password is required") }}
        placeholder={t("Пароль", "كلمة المرور", "Password")}
        errors={errors}
      />

      <div className={scss.links}>
        <div className={scss.Remember}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#407EC7",
                colorBorder: "#000",
              },
            }}
          >
            <Switch
              className={scss.customCheckbox}
              onChange={handleRememberMeChange}
            />
          </ConfigProvider>
          <p>{t("Remember me", "تذكرني", "Remember me")}</p>
        </div>
        <Link href="/auth/forgot" className={scss.link}>
          {t("Забыли пароль?", "نسيت كلمة المرور؟", "Forgot password?")}
        </Link>
      </div>

      <Button
        className={scss.submit}
        type="primary"
        size="large"
        block
        htmlType="submit"
      >
        {t("Войти", "تسجيل الدخول", "Sign in")}
      </Button>
    </form>
  );
};

const SignInPage: FC = () => {
  const { t } = useTranslate();
  const [postLoginMutation] = usePostLoginMutation();
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (userData) => {
    const datalogin = {
      email: userData.email,
      password: userData.password,
    };
    
    try {
      const response = await postLoginMutation(datalogin);
      
      if ("data" in response && response.data?.access) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("accessToken", JSON.stringify(response.data));
        window.location.reload();
      } else if ("error" in response) {
        // Обработка ошибки авторизации
        setLoginError("Логин или пароль не верный");
        message.error(t("Логин или пароль не верный", "اسم المستخدم أو كلمة المرور غير صحيحة", "Incorrect login or password"));
      }
    } catch (e) {
      console.error("An error occurred:", e);
      setLoginError("Логин или пароль не верный");
      message.error(t("Логин или пароль не верный", "اسم المستخدم أو كلمة المرور غير صحيحة", "Incorrect login or password"));
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  return (
    <section className={scss.LoginPage}>
      <h1 className={scss.authTitle}>{t("Sign in", "تسجيل الدخول", "Sign in")}</h1>
      <h2>{t("Войдите в аккаунт", "قم بتسجيل الدخول إلى حسابك", "Sign in to your account")}</h2>
      <LoginForm
        handleSubmit={handleSubmit}
        control={control}
        errors={errors}
        handleRememberMeChange={handleRememberMeChange}
        onSubmit={onSubmit}
        loginError={loginError || undefined}
      />
      <div className={scss.nav}>
        <p>{t("У вас нет аккаунта?", "ليس لديك حساب؟", "Don't have an account?")}</p>
        <Link href="/auth/sign-up" className={scss.link}>
          {t("Зарегестрироваться", "التسجيل", "Sign up")}
        </Link>
      </div>
    </section>
  );
};

export default SignInPage;