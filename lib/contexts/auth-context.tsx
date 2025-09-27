"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { db } from "@/lib/db";
import type { AuthContextType, AuthUser, AuthError } from "@/lib/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use InstantDB's useAuth hook
  const { user: instantUser, isLoading: authLoading } = db.useAuth();

  const loadUserProfile = useCallback(
    async (userEmail: string) => {
      try {
        console.log("🔍 Loading user profile for:", userEmail);
        setError(null);

        // For now, create a basic user profile from InstantDB user
        // In a real app, you'd fetch from your profiles table
        const userData: AuthUser = {
          id: instantUser?.id || "",
          email: userEmail,
          name: userEmail.split("@")[0], // Use email prefix as name
          profile_url: undefined, // InstantDB user doesn't have profile_url
        };

        console.log("✅ Profile loaded successfully:", userData);
        setUser(userData);
      } catch (err) {
        const authError = err as AuthError;
        console.error("❌ Error fetching user profile:", authError);
        setError(authError.message || "Failed to load user profile");
        setUser(null);
      }
    },
    [instantUser]
  );

  const refreshUser = useCallback(async () => {
    if (instantUser?.email) {
      await loadUserProfile(instantUser.email);
    }
  }, [instantUser?.email, loadUserProfile]);

  useEffect(() => {
    const handleAuthStateChange = async () => {
      console.log("🔄 Auth context state change:", {
        authLoading,
        instantUser: instantUser?.email,
      });

      if (authLoading) {
        console.log("⏳ Auth loading in context, setting loading state");
        setIsLoading(true);
        return;
      }

      if (instantUser?.email) {
        console.log(
          "👤 InstantDB user found, loading profile for:",
          instantUser.email
        );
        await loadUserProfile(instantUser.email);
        console.log("✅ Auth context state change complete - user loaded");
        setIsLoading(false);
      } else {
        console.log("🚫 No InstantDB user, clearing user state");
        setUser(null);
        setError(null);
        console.log("✅ Auth context state change complete - user cleared");
        setIsLoading(false);
      }
    };

    handleAuthStateChange();
  }, [authLoading, instantUser, loadUserProfile]);

  const signIn = useCallback(async (email: string) => {
    try {
      setError(null);
      await db.auth.sendMagicCode({ email });
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Failed to send magic code");
      throw authError;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      await db.auth.signOut();
      setUser(null);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "Failed to sign out");
      throw authError;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    signIn,
    signOut,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
