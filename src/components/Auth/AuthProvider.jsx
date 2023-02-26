import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);

  // call this function when you want to authenticate the user
  const login = async (data) => {
    setUser(data);
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
