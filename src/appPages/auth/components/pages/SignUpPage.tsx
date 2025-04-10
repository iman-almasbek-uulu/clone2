"use client";
import scss from "./SignUpPage.module.scss";
import { usePostRegistrationMutation } from "@/redux/api/auth";
import {
  ConfigProvider,
  Input,
  Select,
  Space,
  Switch,
  Button,
  message,
} from "antd";
import { FC, useState } from "react";
import {
  SubmitHandler,
  useForm,
  Controller,
  Control,
  UseFormHandleSubmit,
  RegisterOptions,
  FieldErrors,
} from "react-hook-form";
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

interface PasswordFieldProps extends InputFieldProps {}

interface RegistrationFormProps {
  handleSubmit: UseFormHandleSubmit<IFormInput>;
  control: Control<IFormInput>;
  errors: FieldErrors<IFormInput>;
  password: string;
  handleRememberMeChange: (checked: boolean) => void;
  onSubmit: SubmitHandler<IFormInput>;
  handleCountryCodeChange: (value: string) => void;
}

// Тип для ошибки API
interface ApiError {
  status: number;
  data?: {
    detail?: string;
    [key: string]: any;
  };
}

const InputField: FC<InputFieldProps> = ({
  name,
  control,
  rules,
  placeholder,
  errors,
}) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9@._-]*$/;
    if (!regex.test(value)) {
      e.target.value = value.replace(/[^A-Za-z0-9@._-]/g, "");
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

const PasswordField: FC<PasswordFieldProps> = ({
  name,
  control,
  rules,
  placeholder,
  errors,
}) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9!@#$%^&*_.]*$/;
    if (!regex.test(value)) {
      e.target.value = value.replace(/[^A-Za-z0-9!@#$%^&*_.]/g, "");
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

  const validateEmail = (value: string) => {
    if (!value.includes("@")) {
      return t(
        "Не корректное заполнение, пример: @gmail.com",
        "تنسيق غير صحيح، مثال: @gmail.com",
        "Invalid format, example: @gmail.com"
      );
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... (остальной код компонента остается без изменений) ... */}
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
    setError,
  } = useForm<IFormInput>({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      birth_date: "",
    },
  });

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
      const response = await postRegisterMutation(dataRegistr).unwrap();

      if (response?.access) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("accessToken", JSON.stringify(response));
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);

      // Типизированная проверка ошибки
      const apiError = error as ApiError;

      if (apiError.status === 400) {
        if (apiError.data?.detail === "user with this email already exists.") {
          setError("email", {
            type: "manual",
            message: t(
              "Данный email уже зарегистрирован.",
              "هذا البريد الإلكتروني مسجل بالفعل",
              "This email is already registered."
            ),
          });
        } else if (
          apiError.data?.detail === "Пароль должен быть не менее 8 символов."
        ) {
          setError("password", {
            type: "manual",
            message: t(
              "Пароль должен быть не менее 8 символов.",
              "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
              "Password must be at least 8 characters."
            ),
          });
        } else if (
          apiError.data?.detail?.includes(
            "Пароль должен содержать хотя бы один специальный символ."
          )
        ) {
          setError("password", {
            type: "manual",
            message: t(
              "Пароль должен содержать хотя бы один специальный символ (!@#$%^&*._)",
              "يجب أن تحتوي كلمة المرور على حرف خاص واحد على الأقل (!@#$%^&*._)",
              "Password must contain at least one special character (!@#$%^&*._)"
            ),
          });
        }

        message.error(
          apiError.data?.detail ||
            t("Ошибка при регистрации", "خطأ في التسجيل", "Registration error")
        );
      } else {
        message.error(
          t(
            "Ошибка соединения с сервером",
            "خطأ في الاتصال بالخادم",
            "Server connection error"
          )
        );
      }
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
        <p>
          {t(
            "У вас уже есть аккаунт?",
            "هل لديك حساب بالفعل؟",
            "Already have an account?"
          )}
        </p>
        <Link href="/auth/sign-in" className={scss.link}>
          {t("Войти", "تسجيل الدخول", "Sign in")}
        </Link>
      </div>
    </section>
  );
};

export default SignUpPage;
