"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Settings, LogOut } from "lucide-react";

function ProfileDialogContent() {
  const { user, isLoading: authLoading, error: authError } = db.useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Get user profile data with error handling
  const { data, error: queryError } = db.useQuery({
    profiles: {
      $: {
        where: {
          user: user?.id,
        },
      },
    },
  });

  const profile = data?.profiles?.[0];

  // Handle errors
  useEffect(() => {
    if (queryError) {
      console.error("ProfileDialog: Query error:", queryError);
      setProfileError("Failed to load profile data");
    } else {
      setProfileError(null);
    }
  }, [queryError]);

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    bio: profile?.bio || "",
    company: profile?.company || "",
    role: profile?.role || "",
  });

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await db.auth.signOut();
      // The redirect will be handled by the AuthProvider
    } catch (error) {
      console.error("Error signing out:", error);
      // Show error message to user
      setProfileError("Failed to sign out. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    setProfileError(null);

    try {
      const now = new Date().toISOString();

      if (profile) {
        // Update existing profile
        await db.transact(
          db.tx.profiles[profile.id].update({
            name: formData.name || undefined,
            bio: formData.bio || undefined,
            company: formData.company || undefined,
            role: formData.role || undefined,
            updated_at: now,
          })
        );
      } else {
        // Create new profile
        const profileId = id();
        await db.transact([
          db.tx.profiles[profileId].update({
            name: formData.name || undefined,
            bio: formData.bio || undefined,
            company: formData.company || undefined,
            role: formData.role || undefined,
            created_at: now,
            updated_at: now,
          }),
          db.tx.$users[user.id].link({ profile: profileId }),
        ]);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileError("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "",
      bio: profile?.bio || "",
      company: profile?.company || "",
      role: profile?.role || "",
    });
    setIsEditing(false);
  };

  // Update form data when profile changes
  React.useEffect(() => {
    setFormData({
      name: profile?.name || "",
      bio: profile?.bio || "",
      company: profile?.company || "",
      role: profile?.role || "",
    });
  }, [profile]);

  // Helper function to generate unique IDs
  const id = () => Math.random().toString(36).substr(2, 9);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
        Loading...
      </Button>
    );
  }

  // Show error state if there's an auth error
  if (authError) {
    return (
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <span className="text-red-500">⚠️</span>
        Auth Error
      </Button>
    );
  }

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          {profile?.name || user.email}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Profile Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and profile information.
          </DialogDescription>
          {profileError && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {profileError}
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  placeholder="Your company"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  placeholder="Your role/title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Name</Label>
                <p className="text-sm text-gray-900">
                  {profile?.name || "Not provided"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Company</Label>
                <p className="text-sm text-gray-900">
                  {profile?.company || "Not provided"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <p className="text-sm text-gray-900">
                  {profile?.role || "Not provided"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <p className="text-sm text-gray-900">
                  {profile?.bio || "Not provided"}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfileDialog() {
  return <ProfileDialogContent />;
}
