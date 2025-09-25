"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/db";
import { isPublicRoute, isProtectedRoute } from "@/lib/auth/routes";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Let InstantDB handle its own initialization
        setIsInitialized(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthError("Failed to initialize authentication");
      }
    };

    initializeAuth();
  }, []);

  // Handle auth state changes
  useEffect(() => {
    if (!isInitialized) return;

    const { user, isLoading } = db.useAuth();

    // Only process if not loading and initialized
    if (!isLoading && isInitialized) {
      const isPublic = isPublicRoute(pathname);
      const isProtected = isProtectedRoute(pathname);

      // Handle public routes
      if (isPublic) {
        // Public routes are accessible to everyone
        return;
      }

      // Handle protected routes
      if (isProtected) {
        if (user) {
          // User is authenticated, allow access
          setAuthError(null);
          return;
        } else {
          // User is not authenticated, should redirect to login
          // But let middleware handle this to avoid conflicts
          return;
        }
      }

      // For any other routes, allow access but log for debugging
      console.log("AuthProvider: Allowing access to route:", pathname);
    }
  }, [pathname, isInitialized]);

  // Show loading state during initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an auth error
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{authError}</p>
          <button
            onClick={() => {
              setAuthError(null);
              window.location.reload();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render children for all cases - let middleware and login page handle protection
  return <>{children}</>;
}
