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
        const { data: csrfData } = await api.get("/csrf-token");
        // Sets the CSRF token for all subsequent requests
        api.defaults.headers.common["X-CSRF-Token"] = csrfData.csrfToken;

        const { data } = await api.get("/auth/me");
        setUser(data.body.user);
      } catch (err) {
        // Sets user to null on request failure
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  /**
   * Function to register the user
   * @param email email of user
   * @param username username of user
   * @param password password of user
   */
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

    const { data: csrfData } = await api.get("/csrf-token");
    // Sets the CSRF token for all subsequent requests
    api.defaults.headers.common["X-CSRF-Token"] = csrfData.csrfToken;

    // Updates user to the returned user
    setUser(data.body.user);
  };

  const login = async (username: string, password: string) => {
    const { data } = await api.post("/auth/login", {
      username,
      password,
    });

    const { data: csrfData } = await api.get("/csrf-token");
    // Sets the CSRF token for all subsequent requests
    api.defaults.headers.common["X-CSRF-Token"] = csrfData.csrfToken;

    setUser(data.body.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);

    // Refresh CSRF token after logout to ensure next request has a valid token
    const { data: csrfData } = await api.get("/csrf-token");
    api.defaults.headers.common["X-CSRF-Token"] = csrfData.csrfToken;
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
