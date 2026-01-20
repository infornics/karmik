import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "./api";
import { isAxiosError } from "axios";

type User = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (token: string, user: User) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "auth_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (!storedToken) {
          setLoading(false);
          return;
        }

        // TODO: Optionally call /auth/me to validate token and fetch user.
        setToken(storedToken);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const setSession = async (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    await AsyncStorage.setItem(TOKEN_KEY, newToken);
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser({ email, password });
      await setSession(data.token, data.user);
    } catch (error) {
      if (isAxiosError(error)) {
        throw error;
      }
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, setSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

