
import { useAuthContext } from "@/context/AuthContext";

export const useUserRole = () => {
  const { user } = useAuthContext();
  return user?.roles?.[0]?.name;
};
