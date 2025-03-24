"use client";
import scss from "./SignUpPage.module.scss";
import { usePostRegistrationMutation } from "@/redux/api/auth";
import { ConfigProvider, Input, Select, Space, Switch, Button } from "antd";
import { FC, useState } from "react";
import { SubmitHandler, useForm, Controller, Control, UseFormHandleSubmit, RegisterOptions, FieldErrors } from "react-hook-form";
import Link from "next/link";
import useTranslate from "@/appPages/site/hooks/translate/translate";

const options = [
  { value: "+996", label: "+996" },
  { value: "+7", label: "+7" },
];

interface IFormInput {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  birth_date: string;
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
    const regex = /^[A-Za-z0-9@._-]*$/; // Разрешаем только английские буквы, цифры и символы @ . _ -
    if (!regex.test(value)) {
      e.target.value = value.replace(/[^A-Za-z0-9@._-]/g, ''); // Удаляем все недопустимые символы
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
    const regex = /^[A-Za-z0-9!@#$%^&*()_+]*$/; // Разрешаем только английские буквы, цифры и специальные символы
    if (!regex.test(value)) {
      e.target.value = value.replace(/[^A-Za-z0-9!@#$%^&*()_+]/g, ''); // Удаляем все недопустимые символы
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


interface RegistrationFormProps {
  handleSubmit: UseFormHandleSubmit<IFormInput>;
  control: Control<IFormInput>;
  errors: FieldErrors<IFormInput>;
  password: string;
  handleRememberMeChange: (checked: boolean) => void;
  onSubmit: SubmitHandler<IFormInput>;
  handleCountryCodeChange: (value: string) => void;
}

const RegistrationForm: FC<RegistrationFormProps> = ({
  handleSubmit,
  control,
  errors,
  password,
  handleRememberMeChange,
  onSubmit,
  handleCountryCodeChange,
}) => {
  const { t } = useTranslate();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.email && <span className={scss.error}>{errors.email.message}</span>}
      <InputField
        name="email"
        control={control}
        rules={{ required: t("Email обязателен", "البريد الإلكتروني مطلوب", "Email is required") }}
        placeholder="Email"
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

      <PasswordField
        name="confirm_password"
        control={control}
        rules={{
          required: t("Подтверждение пароля обязательно", "تأكيد كلمة المرور مطلوب", "Password confirmation is required"),
          validate: (value: string) =>
            value === password || t("Пароли не совпадают", "كلمات المرور غير متطابقة", "Passwords do not match"),
        }}
        placeholder={t("Повторите пароль", "أعد كلمة المرور", "Repeat password")}
        errors={errors}
      />

      <div className={scss.userName}>
        <p>
          {t("Name", "الاسم", "Name")} <span>*</span>{" "}
          {errors.first_name && (
            <span className={scss.error}>{errors.first_name.message}</span>
          )}
        </p>
        <p>
          {t("Surname", "اللقب", "Surname")} <span>*</span>{" "}
          {errors.last_name && (
            <span className={scss.error}>{errors.last_name.message}</span>
          )}
        </p>
        <InputField
          name="first_name"
          control={control}
          rules={{ required: t("Имя обязательно", "الاسم مطلوب", "Name is required") }}
          placeholder={t("Name", "الاسم", "Name")}
          errors={errors}
        />

        <InputField
          name="last_name"
          control={control}
          rules={{ required: t("Фамилия обязательна", "اللقب مطلوب", "Surname is required") }}
          placeholder={t("Surname", "اللقب", "Surname")}
          errors={errors}
        />
        <p>
          {t("Phone number", "رقم الهاتف", "Phone number")} <span>*</span>{" "}
          {errors.phone_number && (
            <span className={scss.error}>{errors.phone_number.message}</span>
          )}
        </p>
        <p>
          {t("Birth date", "تاريخ الميلاد", "Birth date")} <span>*</span>{" "}
          {errors.birth_date && (
            <span className={scss.error}>{errors.birth_date.message}</span>
          )}
        </p>
        <Space direction="vertical">
          <Space.Compact>
            <ConfigProvider
              theme={{
                components: {
                  Select: {
                    colorPrimary: "#407EC7",
                    colorBorder: "transparent",
                    controlOutline: "none",
                    controlItemBgHover: "transparent",
                    controlItemBgActive: "transparent",
                  },
                },
              }}
            >
              <Select
                className={scss.castomSelect}
                defaultValue="+996"
                options={options}
                onChange={handleCountryCodeChange}
              />
            </ConfigProvider>
            <InputField
              name="phone_number"
              control={control}
              rules={{
                required: t("Номер телефона обязателен", "رقم الهاتف مطلوب", "Phone number is required"),
                pattern: {
                  value: /^\d{9}$/,
                  message: t("Номер телефона должен содержать 9 цифр", "يجب أن يحتوي رقم الهاتف على 9 أرقام", "Phone number must contain 9 digits"),
                },
              }}
              placeholder="XXX XXX XXX"
              errors={errors}
            />
          </Space.Compact>
        </Space>

        <InputField
          name="birth_date"
          control={control}
          rules={{ required: t("Дата рождения обязательна", "تاريخ الميلاد مطلوب", "Birth date is required") }}
          placeholder="YYYY-MM-DD"
          errors={errors}
        />
      </div>

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

      <Button
        className={scss.submit}
        type="primary"
        size="large"
        block
        htmlType="submit"
      >
        {t("Зарегистрироваться", "تسجيل", "Sign up")}
      </Button>
    </form>
  );
};

const SignUpPage: FC = () => {
  const { t } = useTranslate();
  const [postRegisterMutation] = usePostRegistrationMutation();
  const [rememberMe, setRememberMe] = useState(false);
  const [countryCode, setCountryCode] = useState("+996");

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (userData) => {
    const fullPhoneNumber = `${countryCode}${userData.phone_number}`;

    const dataRegistr = {
      email: userData.email,
      password: userData.password,
      confirm_password: userData.confirm_password,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: fullPhoneNumber,
      birth_date: userData.birth_date,
    };

    try {
      const response = await postRegisterMutation(dataRegistr);
      if ("data" in response && response.data?.access) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("accessToken", JSON.stringify(response.data));
      }
    } catch (error: unknown) {
      console.error("An error occurred:", error);
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
  };

  const password = watch("password");

  return (
    <section className={scss.RegistrationPage}>
      <h1 className={scss.authTitle}>{t("Sign up", "تسجيل", "Sign up")}</h1>
      <h2>{t("Создать аккаунт", "إنشاء حساب", "Create account")}</h2>
      <RegistrationForm
        handleSubmit={handleSubmit}
        control={control}
        errors={errors}
        password={password}
        handleRememberMeChange={handleRememberMeChange}
        onSubmit={onSubmit}
        handleCountryCodeChange={handleCountryCodeChange}
      />
      <div className={scss.links}>
        <p>{t("У вас уже есть аккаунт?", "هل لديك حساب بالفعل؟", "Already have an account?")}</p>
        <Link href="/auth/sign-in" className={scss.link}>
          {t("Войти", "تسجيل الدخول", "Sign in")}
        </Link>
      </div>
    </section>
  );
};

export default SignUpPage;