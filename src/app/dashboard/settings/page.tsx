"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordData {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserPreferences {
  defaultEncryption: boolean;
  documentExpiry: number;
}

export default function SettingsPage() {
  // State for user ID and profile information
  const [userId, setUserId] = useState<string>("");
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
  });

  // State for password change
  const [passwordData, setPasswordData] = useState<PasswordData>({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for document preferences
  const [defaultEncryption, setDefaultEncryption] = useState<boolean>(true);
  const [documentExpiry, setDocumentExpiry] = useState<number>(30);

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Update profile information
  const updateProfile = async () => {
    if (!userId) {
      toast.error("Error", {
        description: "User ID is missing. Please reload the page.",
      });
      return;
    }

    try {
      const payload = {
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        role: "user",
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Profile updated", {
          description: "Your profile information has been updated successfully.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Error", {
        description: `Failed to update profile: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`,
      });
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Password mismatch", {
        description: "New password and confirmation do not match.",
      });
      return;
    }

    if (!userId) {
      toast.error("Error", {
        description: "User ID is missing. Please reload the page.",
      });
      return;
    }

    try {
      const payload = {
        password: passwordData.newPassword,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Password updated", {
          description: "Your password has been changed successfully.",
        });

        setPasswordData({
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  // Save document preferences
  const savePreferences = async () => {
    if (!userId) {
      toast.error("Error", {
        description: "User ID is missing. Please reload the page.",
      });
      return;
    }

    try {
      const payload: UserPreferences = {
        defaultEncryption,
        documentExpiry,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Preferences saved", {
          description: "Your document preferences have been updated.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save preferences");
      }
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  // Load user data on component mount
  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Accept: "*/*",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Save the user ID
        setUserId(userData.id);

        // Split name into first and last name
        const nameParts = userData.name.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setProfile({
          firstName,
          lastName,
          email: userData.email,
        });

        // Set other preferences if available
        if (userData.preferences) {
          setDefaultEncryption(userData.preferences.defaultEncryption);
          setDocumentExpiry(userData.preferences.documentExpiry);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error", {
        description: "Failed to load user data. Please refresh the page.",
      });
    }
  };

  // useEffect to load user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={updateProfile}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Preferences</CardTitle>
              <CardDescription>
                Configure your document settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="defaultEncryption">
                    Default Encryption
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically encrypt all uploaded documents
                  </p>
                </div>
                <Switch
                  id="defaultEncryption"
                  checked={defaultEncryption}
                  onCheckedChange={setDefaultEncryption}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="documentExpiry">Document Expiry</Label>
                  <p className="text-sm text-muted-foreground">
                    Set default document expiration period (days)
                  </p>
                </div>
                <div className="w-[180px]">
                  <Input
                    id="documentExpiry"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={documentExpiry}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDocumentExpiry(parseInt(e.target.value) || 30)
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePreferences}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Current password</Label>
                <Input
                  id="password"
                  type="password"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={changePassword}>Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}