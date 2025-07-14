import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { buildAuthUrl } from "../config/api";

interface User {
  id: number;
  email: string;
  username: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      axios
        .get(buildAuthUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          // Auto-logout if credentials are invalid
          if (
            err.response &&
            err.response.data &&
            err.response.data.detail === "Could not validate credentials"
          ) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
          } else {
            setUser(null);
          }
        });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(buildAuthUrl("/auth/login"), {
        email,
        password,
      });
      setToken(res.data.access_token);
      localStorage.setItem("token", res.data.access_token);
      // Fetch user info
      try {
        const userRes = await axios.get(buildAuthUrl("/auth/me"), {
          headers: { Authorization: `Bearer ${res.data.access_token}` },
        });
        setUser(userRes.data);
        setLoading(false);
        return true;
      } catch (err: any) {
        // Auto-logout if credentials are invalid after login
        if (
          err.response &&
          err.response.data &&
          err.response.data.detail === "Could not validate credentials"
        ) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
        setLoading(false);
        return false;
      }
    } catch {
      setUser(null);
      setToken(null);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
