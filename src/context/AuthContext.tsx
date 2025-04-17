"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User } from "@/types/auth";
import { getUserProfile, login, register, verifyAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { log } from "console";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     setIsLoading(true);
  //     try {
  //       const { authenticated, user } = await verifyAuth();
  //       if (authenticated && user) {
  //         setUser(user);
  //       } else {
  //         setUser(null);
  //       }
  //     } catch (error) {
  //       setUser(null);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, []);
  
  const loginUser = async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await login(email, password);
        setUser(response.user);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

  const registerUser = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await register(email, password, name);
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      setUser(response.user);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
    value={{ user, isLoading, loginUser, registerUser, logout }}
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
