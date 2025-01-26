import { useStateContext } from "@/context";
import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useEffect } from "react";

const AuthComponent = () => {
  const { authenticated, login, user, logout } = usePrivy();
  const { fetchUsers, users, fetchUserRecords } = useStateContext();

  const fetchUserInfo = useCallback(async () => {
    if (!user || !user.email?.address) return;

    try {
      await fetchUsers();
      const existingUser = users.find(
        (u: any) => u.createdBy === user?.email?.address
      );
      if (existingUser) {
        await fetchUserRecords(user.email.address);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [user, fetchUsers, users, fetchUserRecords]);

  useEffect(() => {
    if (authenticated && user) {
      fetchUserInfo();
    }
  }, [authenticated, user, fetchUserInfo]);

  const handleLoginLogout = useCallback(() => {
    if (authenticated) {
      logout();
    } else {
      login(); // Просто вызываем login
      if (user) {
        fetchUserInfo(); // Вызываем fetchUserInfo без .then
      }
    }
  }, [authenticated, login, logout, user, fetchUserInfo]);

  return { authenticated, handleLoginLogout };
};

export default AuthComponent;
