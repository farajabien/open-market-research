"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { allRoutes } from "@/lib/auth/routes";

function AuthenticatedRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || allRoutes.STUDIES;
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    if (redirectAttempted) return; // Prevent multiple redirect attempts

    console.log("AuthenticatedRedirect: Redirecting to", redirectTo);
    setRedirectAttempted(true);

    // Use setTimeout to ensure the component has fully rendered
    const timer = setTimeout(() => {
      try {
        // Use replace instead of push to avoid back button issues
        router.replace(redirectTo);
      } catch (error) {
        console.error("AuthenticatedRedirect: Redirect failed:", error);
        // Fallback: try window.location
        window.location.href = redirectTo;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router, redirectTo, redirectAttempted]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to {redirectTo}...</p>
        <p className="text-sm text-muted-foreground mt-2">
          If you&apos;re not redirected automatically,{" "}
          <button
            onClick={() => (window.location.href = redirectTo)}
            className="underline hover:no-underline text-primary"
          >
            click here
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginFormContent() {
  const [sentEmail, setSentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || allRoutes.STUDIES;

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Code validation (6 digits)
  const validateCode = (code: string) => {
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const email = emailValue.trim();

    // Validate email
    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      await db.auth.sendMagicCode({ email });
      setSentEmail(email);
      setSuccess(`Verification code sent to ${email}`);
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(
        error.body?.message || "Failed to send magic code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const code = codeValue.trim();

    // Validate code
    if (!code) {
      setError("Please enter the verification code");
      setIsLoading(false);
      return;
    }

    if (!validateCode(code)) {
      setError("Please enter a valid 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      await db.auth.signInWithMagicCode({ email: sentEmail, code });
      setSuccess("Successfully verified! Redirecting...");
      // Small delay to show success message before redirect
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(
        error.body?.message || "Invalid verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={allRoutes.HOME}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <CardTitle>Sign In</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              {!sentEmail
                ? "Enter your email address and we'll send you a verification code."
                : `We sent a 6-digit code to ${sentEmail}. Check your email and enter it below.`}
            </p>
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!sentEmail ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    required
                    autoFocus
                    disabled={isLoading}
                    className={
                      error && !success
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !emailValue.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <Input
                    name="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={codeValue}
                    onChange={(e) =>
                      setCodeValue(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    required
                    autoFocus
                    disabled={isLoading}
                    className={
                      error && !success
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSentEmail("");
                      setCodeValue("");
                      setError("");
                      setSuccess("");
                    }}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Back to Email
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading || codeValue.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginForm() {
  const { user, isLoading, error: authError } = db.useAuth();
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  console.log("LoginForm: Auth state", {
    user: !!user,
    isLoading,
    authError: !!authError,
    retryCount,
    userEmail: user?.email,
  });

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      console.error("LoginForm: Auth error detected:", authError);
      setError(`Authentication error: ${authError.message || "Unknown error"}`);
    } else {
      setError(null);
    }
  }, [authError]);

  // Retry logic for auth issues
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    // Force a re-render to retry auth
    window.location.reload();
  };

  // Show error state with retry option
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={handleRetry}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry ({retryCount}/3)
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {user ? "Authenticating..." : "Checking authentication..."}
          </p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect
  if (user) {
    return <AuthenticatedRedirect />;
  }

  // Show login form for unauthenticated users
  return <LoginFormContent />;
}
