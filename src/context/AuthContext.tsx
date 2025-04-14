"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User } from "@/types/auth";
import { getToken, getUserProfile, removeToken, setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const userData = await getUserProfile(token);
          setState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          removeToken();
          setState({
            ...initialState,
            isLoading: false,
          });
        }
      } else {
        setState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    setState({ ...state, isLoading: true });
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      setToken(data.token);
      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setState({
        ...state,
        isLoading: false,
      });
      throw error;
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    setState({ ...state, isLoading: true });
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      setToken(data.token);
      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setState({
        ...state,
        isLoading: false,
      });
      throw error;
    }
  };

  const logoutUser = () => {
    removeToken();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}