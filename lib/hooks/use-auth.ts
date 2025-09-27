import { useCallback } from "react";
import { db } from "@/lib/db";
import { useAuth } from "@/lib/contexts/auth-context";
import type { AuthError, MagicCodeData } from "@/lib/types/auth";

/**
 * Custom hook for authentication operations
 * Provides a clean API for auth actions with error handling
 */
export function useAuthActions() {
  const { refreshUser } = useAuth();

  const signInWithMagicCode = useCallback(
    async (data: MagicCodeData) => {
      try {
        console.log("🔐 Attempting magic code sign in with:", {
          email: data.email,
          code: data.code,
        });
        await db.auth.signInWithMagicCode({
          email: data.email,
          code: data.code,
        });
        console.log("✅ Magic code sign in successful");

        // Wait a moment for InstantDB auth state to update
        await new Promise((resolve) => setTimeout(resolve, 500));

        await refreshUser();
        console.log("🔄 User profile refreshed after magic code sign in");
      } catch (error) {
        const authError = error as AuthError;
        console.error("❌ Magic code sign in error:", authError);
        throw authError;
      }
    },
    [refreshUser]
  );

  const sendMagicCode = useCallback(async (email: string) => {
    try {
      console.log("📧 Sending magic code to:", email);
      await db.auth.sendMagicCode({ email });
      console.log("✅ Magic code sent successfully");
    } catch (error) {
      const authError = error as AuthError;
      console.error("❌ Send magic code error:", authError);
      throw authError;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await db.auth.signOut();
    } catch (error) {
      const authError = error as AuthError;
      console.error("Sign out error:", authError);
      throw authError;
    }
  }, []);

  return {
    signInWithMagicCode,
    sendMagicCode,
    signOut,
  };
}

/**
 * Hook for checking user permissions and roles
 */
export function useAuthPermissions() {
  const { user } = useAuth();

  const hasRole = useCallback(
    (role: string) => {
      return user?.name === role; // Simple role check for now
    },
    [user?.name]
  );

  const canAccess = useCallback(
    (permission: string) => {
      // This would integrate with your permissions system
      // For now, just check if user exists
      console.log("Checking permission:", permission);
      return !!user;
    },
    [user]
  );

  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  return {
    hasRole,
    canAccess,
    isAuthenticated,
  };
}

/**
 * Hook for auth state management
 */
export function useAuthState() {
  const auth = useAuth();

  return {
    ...auth,
    // Computed properties
    isReady: !auth.isLoading && auth.isAuthenticated,
    needsSetup: auth.isAuthenticated && !auth.user?.name,
  };
}
