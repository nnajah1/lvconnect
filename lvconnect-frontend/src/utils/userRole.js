
import { useAuthContext } from "@/context/AuthContext";

export const useUserRole = () => {
  const { user } = useAuthContext();
  return user.active_role || user?.roles?.[0]?.name;
};
