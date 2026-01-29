import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, setToken } from "@/lib/api";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  location?: string;
  bio?: string;
  interests?: string[];
  photos?: string[];
  privacySettings?: {
    profileVisibility: "public" | "friends" | "private";
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
  };
  preferences?: {
    ageRange?: { min: number; max: number };
    maxDistance?: number;
    interests?: string[];
  };
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest<{ success: boolean; data: { user: User } }>("/api/auth/me");
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiRequest<{
      success: boolean;
      data: { user: User; token: string };
    }>("/api/auth/login", {
      method: "POST",
      body: { email, password }
    });

    setToken(response.data.token);
    setUser(response.data.user);
  }, []);

  const register = useCallback(async (payload: Record<string, unknown>) => {
    const response = await apiRequest<{
      success: boolean;
      data: { user: User; token: string };
    }>("/api/auth/register", {
      method: "POST",
      body: payload
    });

    setToken(response.data.token);
    setUser(response.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } finally {
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refresh }),
    [user, isLoading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};