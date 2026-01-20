import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "@/api/axios";
import type { AuthContextType } from "@/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for an active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.body.user);
      } catch (err) {
        // 401 means no session exists, which is fine
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const register = async (
    email: string,
    username: string,
    password: string,
  ) => {
    const { data } = await api.post("/auth/register", {
      email,
      username,
      password,
    });
    setUser(data.body.user);
  };

  const login = async (username: string, password: string) => {
    const { data } = await api.post("/auth/login", {
      username,
      password,
    });
    setUser(data.body.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
