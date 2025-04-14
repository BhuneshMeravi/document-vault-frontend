"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
      <div className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user.name}!</h2>
        <p className="text-muted-foreground">You are now logged into your account.</p>
      </div>
      
      {/* Additional dashboard content would go here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="font-medium mb-2">Profile</h3>
          <p className="text-sm text-muted-foreground">Manage your account details and preferences</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="font-medium mb-2">Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your application settings</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow">
          <h3 className="font-medium mb-2">Activity</h3>
          <p className="text-sm text-muted-foreground">View your recent activity and logs</p>
        </div>
      </div>
    </div>
  );
}