"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import SubmissionForm from "./submission-form";
import { allRoutes } from "@/lib/auth/routes";

export default function SubmissionFormWrapper() {
  const { user, isLoading, error, isAuthenticated } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  console.log("SubmissionFormWrapper - Auth state:", {
    user,
    isLoading,
    error,
    isAuthenticated,
  });

  useEffect(() => {
    if (error) {
      console.error("SubmissionFormWrapper: Auth error:", error);
      setAuthError("Authentication error. Please refresh the page.");
    } else {
      setAuthError(null);
    }
  }, [error]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{authError}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Refresh Page
            </button>
            <button
              onClick={() => (window.location.href = allRoutes.HOME)}
              className="w-full px-4 py-2 border border-border rounded-md hover:bg-accent"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to submit research studies
          </p>
          <div className="space-y-2">
            <a
              href={allRoutes.LOGIN}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 inline-block"
            >
              Sign In
            </a>
            <a
              href={allRoutes.HOME}
              className="w-full px-4 py-2 border border-border rounded-md hover:bg-accent inline-block"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, show the form
  // At this point, user should not be null since we checked isAuthenticated
  if (!user) {
    console.error(
      "SubmissionFormWrapper: User is null but isAuthenticated is true"
    );
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">
            User data is not available. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <SubmissionForm user={user} />;
}
