// hooks/useUser.ts
import { useGetMeQuery } from "@/redux/api/auth";
import { useState } from "react";

export const useUser = () => {
  const { data: userData, status } = useGetMeQuery();
  const [userPreview, setUserPreview] = useState<string | null>(null);

  return { userData, status, userPreview, setUserPreview };
};