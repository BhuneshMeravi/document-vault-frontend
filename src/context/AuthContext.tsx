"use client";

import { createContext, useContext, useState } from "react";
import { User } from "@/types/auth";
import {login, register } from "@/lib/auth";
import { useRouter } from "next/navigation";


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
        console.log("Registration response:", response);
        
        if (response && response.user) {
          setUser(response.user);
          router.push('/dashboard');
        } else {
          throw new Error("Registration succeeded but user data is missing");
        }
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
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
