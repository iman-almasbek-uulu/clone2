// components/UserProfile.tsx
import Link from "next/link";
import { Avatar, Badge, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import scss from "./avatar.module.scss";
import Image from "next/image";

// Импортируем тип из Header
import { UserDataType } from "../../Header";
import useTranslate from "@/appPages/site/hooks/translate/translate";

// Пропсы для профиля пользователя
interface UserProfileProps {
  userData?: UserDataType;
  status: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userData,
  status,
}) => {
  const {t} = useTranslate()
  if (status !== "fulfilled") {
    return (
      <Link href="/auth/sign-in" className={scss.signInButton}>
        {t("Войти", "تسجيل الدخول", "Sign In")}
      </Link>
    );
  }

  // Проверяем, является ли userData массивом и обрабатываем соответственно
  return (
    <Link className={scss.link} href="/profile">
      <Space direction="vertical" size={10}>
        <Badge count={1}>
          {Array.isArray(userData) ? (
            // Если это массив, используем map
            userData.map((user, idx) => (
              <Avatar
                key={idx}
                size={50}
                icon={
                  user.user_picture ? (
                    <span
                      className={scss.user}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        className={scss.user}
                        src={user.user_picture}
                        alt="аватар"
                        width={100}
                        height={100}
                        style={{
                          objectFit: "cover",
                          height: "100%"
                        }}
                        unoptimized={true} // Добавляем для внешних URL
                      />
                    </span>
                  ) : (
                    <UserOutlined />
                  )
                }
              />
            ))
          ) : (
            // Если не массив, обрабатываем как объект
            <Avatar
              size={50}
              icon={
                userData?.user_picture ? (
                  <span
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={userData.user_picture}
                      className={scss.user}
                      alt="аватар"
                      width={100}
                      height={100}
                      style={{
                        objectFit: "cover",
                      }}
                      unoptimized={true} // Добавляем для внешних URL
                    />
                  </span>
                ) : (
                  <UserOutlined />
                )
              }
            />
          )}
        </Badge>
      </Space>
    </Link>
  );
};
