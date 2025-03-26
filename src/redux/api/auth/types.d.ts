/* eslint-disable @typescript-eslint/no-unused-vars */
namespace AUTH {
  type GetResponse = {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: number;
    user_picture: string | null;
    from_user: string;
    cover_photo: string | null;
    birth_date: string;
  }[];

  type GetRequest = void;

  type PatchMeResponse = {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    user_picture?: string | null;
    from_user?: string;
    cover_photo?: string | null;
    birth_date?: string;
  };

  type PatchMeRequest = {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    user_picture?: string | null;
    from_user?: string;
    cover_photo?: string | null;
    birth_date?: string;
  };

  type PostLoginResponse = {
    access: string;
    refresh: string;
  };

  type PostLoginRequest = {
    email: string;
    password: string;
  };

  type PostRegistrationResponse = {
    access: string;
    refresh: string;
  };

  type PostRegistrationRequest = {
    email: string;
    password: string;
    confirm_password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    birth_date: string;
  };

  type PostLogoutResponse = Record<string, unknown>; // Исправлено с `{}`
  type PostLogoutRequest = void;

  type PatchRefreshResponse = {
    refresh: string;
    access: string;
  };

  type PatchRefreshRequest = {
    refresh: string;
  };

  type PostForgotPasswordResponse = {
    status: string;
  };

  type PostForgotPasswordRequest = {
    email: string;
  };

  type PostResetPasswordResponse = {
    message: string;
  };

  type PostResetPasswordRequest = {
    email: string;
    reset_code: string;
    new_password: string;
  };
}
