import { createContext, useContext, useState, ReactNode } from "react";

export type Side = "left" | "right" | "center";


type UserData = {
  uid: string;
  side: Side;
};

type AuthContextType = {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  const isAuthenticated = !!userData?.uid;

  const logout = () => {
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        isAuthenticated,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};


