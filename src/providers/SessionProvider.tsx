import { FC, ReactNode, useEffect } from 'react';
import { useGetMeQuery, usePatchRefreshTokenMutation } from '../redux/api/auth';
import { usePathname, useRouter } from 'next/navigation';

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const { status } = useGetMeQuery();
  const [refreshTokenMutation] = usePatchRefreshTokenMutation();

  const pathname = usePathname();
  const router = useRouter();


	const handleRefreshToken = async () => {
    if (typeof window === "undefined") return; 

    const localStorageData = localStorage.getItem("accessToken");
    const sessionStorageData = sessionStorage.getItem("accessToken");

    const parsedLocalStorageData = localStorageData ? JSON.parse(localStorageData) : null;
    const parsedSessionStorageData = sessionStorageData ? JSON.parse(sessionStorageData) : null;

    const access = parsedSessionStorageData?.access || parsedLocalStorageData?.access;
    const refresh = parsedSessionStorageData?.refresh || parsedLocalStorageData?.refresh;

    const isTokenExpired = (token: string): boolean => {
      try {
        if (!token) return true;
        const base64Url = token.split(".")[1];
        if (!base64Url) return true;
        const payload = JSON.parse(atob(base64Url));
        return payload.exp < Math.floor(Date.now() / 1000);
      } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        return true;
      }
    };

    if (!refresh || isTokenExpired(refresh)) {
      console.warn("refreshToken недействителен, редирект на /auth/sign-in");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      return;
    }

    if (isTokenExpired(access)) {
      try {
        const { data } = await refreshTokenMutation({ refresh });
        if (data) {
          localStorage.setItem("accessToken", JSON.stringify(data));
          sessionStorage.setItem("accessToken", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Не удалось обновить токены:", error);
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
      }
    }
  };

  const handleNavigation = () => {
    switch (pathname) {
      case "/auth/sign-in":
      case "/auth/sign-up":
      case "/auth/reset-password":
      case "/auth/forgot":
        if (status === "fulfilled") {
          router.push("/profile");
        }
        break;
      case "/chats":
      case "/notifications":
      case "/settings":
      case "/profile":
      case "/my-public":
        if (status === "rejected") {
          router.push("/auth/sign-in");
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleRefreshToken();
  }, [pathname]);

  useEffect(() => {
    handleNavigation();
  }, [status, pathname, router]);

  return children;
};
