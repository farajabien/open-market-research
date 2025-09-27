# 🔐 InstantDB + Next.js Authentication Flow Implementation Guide

Here's a comprehensive breakdown of how we implemented the authentication flow for this Jibu POS app using InstantDB and Next.js. This guide will help you implement similar auth flows in other InstantDB Next.js applications.

## 🏗️ **Architecture Overview**

Our auth implementation follows a **unified approach** combining:

- **InstantDB** for real-time authentication and user management
- **Next.js App Router** for server-side rendering and route protection
- **React Context** for client-side state management
- **Middleware** for route protection and redirection
- **Server Actions** for profile and business management

## 🎯 **Key Design Principles**

1. **Always authenticate first** - Let InstantDB handle user creation/authentication
2. **Check profile after auth** - Don't validate profiles before magic code
3. **Create minimal profiles** - Add details during setup flow
4. **Handle missing data gracefully** - Redirect to appropriate setup
5. **Use dedicated setup pages** - Don't inline complex setup in auth flow

## 🏗️ **1. Core Setup & Configuration**

### **InstantDB Client Setup**

```typescript
// lib/instantdb-client.ts
import { createClient } from "@instantdb/react";

const db = createClient({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
});

export { db };
```

### **Environment Variables**

```env
# .env.local
NEXT_PUBLIC_INSTANT_APP_ID=your_instant_app_id
```

### **Database Schema (instant.schema.ts)**

```typescript
const schema = {
  profiles: {
    id: { type: "string", constraints: ["not null"] },
    name: { type: "string" },
    email: { type: "string", constraints: ["not null", "unique"] },
    phone: { type: "string" },
    role: { type: "string" },
    business_id: { type: "string" },
    is_active: { type: "boolean" },
    last_login_at: { type: "string" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
  businesses: {
    id: { type: "string", constraints: ["not null"] },
    name: { type: "string", constraints: ["not null"] },
    slug: { type: "string", constraints: ["not null", "unique"] },
    type: { type: "string" },
    description: { type: "string" },
    address: { type: "string" },
    phone: { type: "string" },
    email: { type: "string" },
    logo: { type: "string" },
    location: { type: "string" },
    business_type: { type: "string" },
    franchise_status: { type: "string" },
    target_liters: { type: "number" },
    current_liters: { type: "number" },
    owner_id: { type: "string" },
    is_active: { type: "boolean" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
  user_businesses: {
    id: { type: "string", constraints: ["not null"] },
    user_id: { type: "string" },
    business_id: { type: "string" },
    role: { type: "string" },
    is_active: { type: "boolean" },
    created_at: { type: "string" },
    updated_at: { type: "string" },
  },
};

export default schema;
```

## 🔑 **2. Authentication Context Implementation**

### **Unified Auth Types**

```typescript
// lib/types/auth.ts
import type { Profile } from "./database";

// Unified auth types
export type AuthUser = Profile;

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export interface AuthContextType extends AuthState, AuthActions {}

// Auth step types for the auth flow
export type AuthStep =
  | "login"
  | "magic-code"
  | "signup"
  | "business-setup"
  | "business-selector"
  | "dashboard";

// Magic code verification
export interface MagicCodeData {
  email: string;
  code: string;
}

// Business setup completion
export interface BusinessSetupResult {
  businessId: string;
  businessSlug?: string;
}

// Auth error types
export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}
```

### **Enhanced Auth Context**

```typescript
// lib/contexts/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { db } from "@/lib/instantdb-client";
import { getProfileByEmail } from "@/app/actions/auth";
import type { AuthContextType, AuthUser, AuthError } from "@/lib/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use InstantDB's useAuth hook
  const { user: instantUser, isLoading: authLoading } = db.useAuth();

  const loadUserProfile = useCallback(async (userEmail: string) => {
    try {
      console.log("🔍 Loading user profile for:", userEmail);
      setError(null);
      const profileResult = await getProfileByEmail(userEmail);
      console.log("📋 Profile loading result:", profileResult);

      if (profileResult.success && profileResult.data) {
        console.log("✅ Profile loaded successfully:", profileResult.data);
        setUser(profileResult.data);
      } else {
        console.log("❌ No profile found for user:", userEmail);
        // User exists in InstantDB but not in our profiles table
        // This might be a new user who needs to complete setup
        setUser(null);
      }
    } catch (err) {
      const authError = err as AuthError;
      console.error("❌ Error fetching user profile:", authError);
      setError(authError.message || "Failed to load user profile");
      setUser(null);
    }
  }, []);

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
        console.log("🔍 InstantDB user object:", instantUser);
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
```

### **Key Features:**

- ✅ **Unified type system** with consistent interfaces
- ✅ **Enhanced error handling** with proper error states
- ✅ **Custom hooks** for auth operations and permissions
- ✅ **Real-time auth state** using `db.useAuth()`
- ✅ **Automatic token management** handled by InstantDB

## 🎯 **3. The Complete Authentication Flow**

### **Step 1: Login Form (components/auth/login-form.tsx)**

```typescript
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, Building2 } from "lucide-react";
import { useAuthActions } from "@/lib/hooks/use-auth";
import { toast } from "sonner";

interface LoginFormProps {
  onEmailSent: (email: string, isSignup?: boolean) => void;
}

export function LoginForm({ onEmailSent }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendMagicCode } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      // Always send magic code first - InstantDB will create user if needed
      console.log("📧 Sending magic code for login flow:", email);
      await sendMagicCode(email);
      onEmailSent(email, false); // This is a login flow
    } catch {
      // Error is already handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome to Your App
            </CardTitle>
            <p className="text-muted-foreground">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking Account...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### **Step 2: Magic Code Form (components/auth/magic-code-form.tsx)**

```typescript
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuthActions } from "@/lib/hooks/use-auth";
import { toast } from "sonner";

interface MagicCodeFormProps {
  email: string;
  onCodeVerified: () => void;
  onBack: () => void;
  isSignup?: boolean;
}

export function MagicCodeForm({
  email,
  onCodeVerified,
  onBack,
  isSignup = false,
}: MagicCodeFormProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { signInWithMagicCode, sendMagicCode } = useAuthActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      // Always verify magic code first - this creates/authenticates the InstantDB user
      console.log("🔐 Verifying magic code for:", email, "isSignup:", isSignup);
      await signInWithMagicCode({ email, code });
      console.log("✅ Magic code verification successful");

      // The auth flow will handle profile checking after InstantDB user is created/authenticated
      onCodeVerified();
    } catch (error) {
      console.log("❌ Magic code verification failed:", error);
      // Error is already handled in the hook
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      await sendMagicCode(email);
      setResendCooldown(60); // 60 second cooldown
      toast.success("New code sent! Check your email.");
    } catch {
      // Error is already handled in the hook
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Enter Verification Code
            </CardTitle>
            <p className="text-muted-foreground">
              We sent a code to <strong>{email}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter the 6-digit code"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  required
                  autoFocus
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onBack}
                  disabled={loading || resendLoading}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Use Different Email
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={loading || resendLoading || resendCooldown > 0}
                  className="flex-1"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend (${resendCooldown}s)`
                  ) : (
                    "Resend Code"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### **Step 3: Auth Flow Orchestrator (components/auth/auth-flow.tsx)**

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { LoginForm } from "./login-form";
import { MagicCodeForm } from "./magic-code-form";
import { BusinessSelector } from "./business-selector";
import { RoleBasedDashboard } from "@/components/dashboard/role-based-dashboard";
import { useAuth } from "@/lib/contexts/auth-context";
import { useAuthActions } from "@/lib/hooks/use-auth";
import { getProfileByEmail, getUserBusinesses } from "@/app/actions/auth";
import { toast } from "sonner";
import type { AuthStep } from "@/lib/types/auth";
import { ROLE_IDS } from "@/lib/types/roles";

interface AuthFlowProps {
  onSignOut: () => void;
}

export function AuthFlow({ onSignOut }: AuthFlowProps) {
  const [step, setStep] = useState<AuthStep>("login");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    business_id: string;
  } | null>(null);
  const { isLoading: authLoading, user: instantUser } = useAuth();
  const { sendMagicCode } = useAuthActions();

  const checkUserProfile = useCallback(async (userEmail: string) => {
    try {
      console.log("🔍 checkUserProfile called for:", userEmail);
      const result = await getProfileByEmail(userEmail);
      console.log("📋 Profile result:", result);

      if (result.success && result.data) {
        console.log("✅ Profile found, setting user data");
        const userData = {
          id: result.data.id,
          name: result.data.name,
          email: result.data.email,
          role: result.data.role,
          business_id: result.data.business_id || "",
        };

        setUser(userData);

        // Handle different user scenarios
        if (result.data.role === ROLE_IDS.OWNER) {
          const businessesResult = await getUserBusinesses(result.data.id);
          if (businessesResult.success && businessesResult.data) {
            if (businessesResult.data.length > 1) {
              // For multiple businesses, redirect to dashboard with business selector
              window.location.href = "/dashboard?selectBusiness=true";
              toast.info("Select which business you want to manage");
            } else if (businessesResult.data.length === 1) {
              // Redirect to business dashboard
              const business = businessesResult.data[0];
              if (business.business?.slug) {
                window.location.href = `/${business.business.slug}`;
                toast.success(`Welcome back, ${result.data.name}!`);
              } else {
                toast.error("Business slug not found");
              }
            } else {
              // Redirect to setup page for business creation
              window.location.href = `/setup?email=${encodeURIComponent(
                userEmail
              )}`;
            }
          }
        } else {
          // For non-owner roles, redirect to auth page
          toast.success(`Welcome back, ${result.data.name}!`);
          setStep("dashboard");
        }
      } else {
        // No profile found - this means it's a new user who needs to complete setup
        console.log(
          "🆕 No profile found - treating as new user, creating basic profile and proceeding to business setup"
        );
        // Create a basic profile with user details
        try {
          const { createProfile } = await import("@/app/actions/auth");
          const profileResult = await createProfile({
            name: "Business Owner", // Default name, will be updated in business setup
            email: userEmail,
            phone: "",
            role: ROLE_IDS.OWNER,
            business_id: "", // Will be set after business creation
          });

          if (profileResult.success) {
            console.log("✅ Basic profile created successfully");
            // Redirect to setup page instead of handling inline
            window.location.href = `/setup?email=${encodeURIComponent(
              userEmail
            )}`;
          } else {
            console.error("❌ Failed to create profile:", profileResult.error);
            toast.error("Failed to create profile. Please try again.");
            setStep("login");
          }
        } catch (error) {
          console.error("❌ Error creating profile:", error);
          toast.error("Failed to create profile. Please try again.");
          setStep("login");
        }
      }
    } catch (error) {
      console.error("❌ Error checking user profile:", error);
      toast.error("Failed to load user profile");
      setStep("login");
      setUser(null);
    }
  }, []);

  // Handle magic code verification completion
  const handleMagicCodeVerified = useCallback(async () => {
    console.log(
      "🎉 Magic code verified, waiting for InstantDB auth state to update..."
    );

    // Wait longer for InstantDB to update its auth state
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Directly check profile if we have the email
    if (email) {
      console.log("🔍 Directly checking profile for:", email);
      await checkUserProfile(email);
    }

    console.log(
      "🔄 Magic code verification complete, waiting for auth state update..."
    );
  }, [email, checkUserProfile]);

  // Handle authentication state changes
  useEffect(() => {
    console.log("🔄 Auth state changed:", {
      authLoading,
      instantUser: instantUser?.email,
      step,
      email,
    });

    if (authLoading) {
      console.log("⏳ Auth loading, waiting...");
      return;
    }

    if (instantUser?.email) {
      console.log(
        "👤 User authenticated, checking profile for:",
        instantUser.email
      );

      // Always check profile after InstantDB user is authenticated
      console.log(
        "🎉 Magic code verified, InstantDB user authenticated, checking profile..."
      );
      checkUserProfile(instantUser.email);
    } else {
      console.log("🚫 No user, checking if we should reset to login");
      setUser(null);
      // Only reset to login if we're not in magic-code step
      if (step !== "magic-code") {
        setStep("login");
        setEmail("");
      }
    }
  }, [instantUser, authLoading, checkUserProfile, step, email]);

  const handleEmailSent = (userEmail: string, isSignup: boolean = false) => {
    console.log("📧 Email sent handler called:", { userEmail, isSignup });
    setEmail(userEmail);
    setStep("magic-code"); // Show the magic code form
    console.log("📧 State updated:", {
      email: userEmail,
      step: "magic-code",
    });
  };

  const handleBusinessSelected = (businessId: string) => {
    if (user) {
      setUser({ ...user, business_id: businessId });
      // Redirect to the business dashboard using businessId as slug
      window.location.href = `/${businessId}`;
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <span className="text-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated and ready
  if (step === "dashboard" && user) {
    return (
      <RoleBasedDashboard
        userRole={user.role}
        businessId={user.business_id}
        userName={user.name}
        onSignOut={onSignOut}
      />
    );
  }

  // Render appropriate step
  switch (step) {
    case "login":
      return <LoginForm onEmailSent={handleEmailSent} />;

    case "magic-code":
      return (
        <MagicCodeForm
          email={email}
          onCodeVerified={handleMagicCodeVerified}
          onBack={() => {
            setStep("login");
            setEmail("");
          }}
          isSignup={false}
        />
      );

    case "business-setup":
      // This case is now handled by redirecting to /setup page
      return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            <span className="text-foreground">Redirecting to setup...</span>
          </div>
        </div>
      );

    case "business-selector":
      return (
        <BusinessSelector
          userId={user?.id || ""}
          userEmail={user?.email || ""}
          onBusinessSelected={handleBusinessSelected}
        />
      );

    default:
      return <LoginForm onEmailSent={handleEmailSent} />;
  }
}
```

## 🛡️ **4. Route Protection Strategy**

### **Middleware Implementation (middleware.ts)**

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Role-based route permissions
const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: ["all"],
  front_office: ["orders", "customers", "inventory_view"],
  sales: [
    "customers_create",
    "customers_view",
    "orders_view",
    "commissions_view",
  ],
  rider: ["orders_view", "orders_update_status"],
};

// Define protected routes that require authentication
const protectedRoutes = [
  "/customers",
  "/inventory",
  "/analytics",
  "/settings",
  "/pos",
  "/targets",
];

// Define public routes that don't require authentication
const publicRoutes = ["/auth", "/", "/api"];

// Define business slug routes (dynamic routes that should be protected)
const isBusinessSlugRoute = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length >= 1 &&
    !publicRoutes.some((route) => pathname.startsWith(route))
  );
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if it's a business slug route
  const isBusinessRoute = isBusinessSlugRoute(pathname);

  // If it's a protected route, let the ProtectedRoute component handle auth
  if (isProtectedRoute) {
    return NextResponse.next();
  }

  // If it's a business slug route, allow it to proceed
  if (isBusinessRoute) {
    return NextResponse.next();
  }

  // Allow public routes to proceed
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For any other routes, redirect to auth
  return NextResponse.redirect(new URL("/auth", request.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## 🎣 **5. Custom Authentication Hooks**

### **Auth Actions Hook (lib/hooks/use-auth.ts)**

```typescript
import { useCallback } from "react";
import { db } from "@/lib/instantdb-client";
import { useAuth } from "@/lib/contexts/auth-context";
import type { AuthError, MagicCodeData } from "@/lib/types/auth";
import { toast } from "sonner";

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
        toast.success("Successfully authenticated!");

        // Wait a moment for InstantDB auth state to update
        await new Promise((resolve) => setTimeout(resolve, 500));

        await refreshUser();
        console.log("🔄 User profile refreshed after magic code sign in");
      } catch (error) {
        const authError = error as AuthError;
        console.error("❌ Magic code sign in error:", authError);
        toast.error(
          `Authentication failed: ${authError.message || "Invalid code"}`
        );
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
      toast.success("Magic code sent! Check your email.");
    } catch (error) {
      const authError = error as AuthError;
      console.error("❌ Send magic code error:", authError);
      toast.error(
        `Failed to send code: ${authError.message || "Unknown error"}`
      );
      throw authError;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await db.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Sign out error:", authError);
      toast.error(`Sign out failed: ${authError.message || "Unknown error"}`);
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
      return user?.role === role;
    },
    [user?.role]
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return user ? roles.includes(user.role) : false;
    },
    [user]
  );

  const canAccess = useCallback(
    (_permission: string) => {
      // This would integrate with your permissions system
      // For now, just check if user exists
      return !!user;
    },
    [user]
  );

  const isOwner = useCallback(() => {
    return hasRole("owner");
  }, [hasRole]);

  const isStaff = useCallback(() => {
    return hasAnyRole(["front_office", "rider"]);
  }, [hasAnyRole]);

  return {
    hasRole,
    hasAnyRole,
    canAccess,
    isOwner,
    isStaff,
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
    needsSetup: auth.isAuthenticated && !auth.user?.business_id,
    hasBusiness: !!auth.user?.business_id,
  };
}
```

## 🗄️ **6. Server Actions for Authentication**

### **Key Server Actions (app/actions/auth.ts)**

The server actions handle all database operations for authentication, profiles, and businesses. Here are the key functions:

```typescript
"use server";

import { adminDb } from "@/lib/instantdb-admin";
import { id } from "@instantdb/react";
import type { Business, Profile, UserBusiness } from "@/lib/types/database";

// ===== PROFILE ACTIONS =====

export async function createProfile(data: CreateProfileData) {
  try {
    const profileId = id();
    const now = new Date();

    await adminDb.transact([
      adminDb.tx.profiles[profileId].update({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        role: data.role,
        business_id: data.business_id,
        is_active: true,
        last_login_at: now,
        created_at: now,
        updated_at: now,
      }),
    ]);

    return { success: true, data: { profile_id: profileId } };
  } catch (error) {
    console.error("❌ Error creating profile:", error);
    return { success: false, error: "Failed to create profile" };
  }
}

export async function getProfileByEmail(email: string) {
  try {
    const result = await adminDb.query({
      profiles: {
        $: {
          where: {
            email: email,
          },
        },
      },
    });

    const profile = (result as { profiles?: Profile[] }).profiles?.[0];
    if (!profile) {
      return { success: false, error: "Profile not found" };
    }
    return { success: true, data: profile };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

// ===== BUSINESS ACTIONS =====

export async function createBusiness(data: CreateBusinessData) {
  try {
    const businessId = id();
    const now = new Date();

    // Generate unique business slug
    const baseSlug = generateBusinessSlug(data.name, data.location);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const availabilityCheck = await checkBusinessSlugAvailability(slug);
      if (availabilityCheck.success && availabilityCheck.available) {
        break;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await adminDb.transact([
      adminDb.tx.businesses[businessId].update({
        name: data.name,
        type: data.type || "water_refill",
        description: data.description || "",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        logo: data.logo || "",
        slug: slug,
        location: data.location || "",
        business_type: data.business_type || "retailer",
        franchise_status: "retailer",
        target_liters: 0,
        current_liters: 0,
        owner_id: data.owner_id || "",
        is_active: true,
        created_at: now,
        updated_at: now,
      }),
    ]);

    return { success: true, data: { business_id: businessId, slug: slug } };
  } catch (error) {
    console.error("❌ Error creating business:", error);
    return { success: false, error: "Failed to create business" };
  }
}

export async function getBusinessBySlug(slug: string) {
  try {
    const result = await adminDb.query({
      businesses: {
        $: {
          where: {
            slug: slug,
            is_active: true,
          },
        },
      },
    });

    const business = (result as { businesses?: Business[] }).businesses?.[0];
    if (!business) {
      return { success: false, error: "Business not found" };
    }

    return { success: true, data: business };
  } catch (error) {
    console.error("Error fetching business by slug:", error);
    return { success: false, error: "Failed to fetch business" };
  }
}

// ===== MULTI-BUSINESS ACTIONS =====

export async function getUserBusinesses(userId: string) {
  try {
    // Get user_businesses relationships
    const userBusinessesResult = await adminDb.query({
      user_businesses: {
        $: {
          where: {
            user_id: userId,
            is_active: true,
          },
        },
      },
    });

    const userBusinesses =
      (userBusinessesResult as { user_businesses?: UserBusiness[] })
        .user_businesses || [];

    if (userBusinesses.length === 0) {
      return { success: true, data: [] };
    }

    // Get business details
    const businessIds = userBusinesses.map((ub) => ub.business_id);
    const businessesResult = await adminDb.query({
      businesses: {
        $: {
          where: {
            id: {
              in: businessIds,
            },
          },
        },
      },
    });

    const businesses =
      (businessesResult as { businesses?: Business[] }).businesses || [];

    // Map user_businesses with their corresponding business data
    const mappedData = userBusinesses.map((ub: UserBusiness) => {
      const business = businesses.find((b) => b.id === ub.business_id);
      return {
        id: ub.id,
        business_id: ub.business_id,
        role: ub.role,
        business: business
          ? {
              id: business.id,
              name: business.name,
              type: business.type,
              description: business.description,
              address: business.address,
              phone: business.phone,
              email: business.email,
              logo: business.logo,
              slug: business.slug,
            }
          : null,
      };
    });

    return {
      success: true,
      data: mappedData,
    };
  } catch (error) {
    console.error("Error fetching user businesses:", error);
    return { success: false, error: "Failed to fetch user businesses" };
  }
}
```

## 🔄 **7. The Complete Authentication Flow**

### **Step-by-Step Flow:**

1. **User visits protected route** → Middleware checks if it's public/protected
2. **If protected** → Redirect to `/auth` page
3. **User enters email** → `LoginForm` calls `sendMagicCode()`
4. **Magic code sent** → User enters code in `MagicCodeForm`
5. **Code verified** → `signInWithMagicCode()` authenticates with InstantDB
6. **InstantDB user created/authenticated** → Auth context detects change
7. **Profile check** → `getProfileByEmail()` checks if profile exists
8. **If profile exists** → Load user data and redirect to appropriate dashboard
9. **If no profile** → Create basic profile and redirect to setup page
10. **Business setup** → User completes business creation and profile details
11. **Dashboard access** → User can now access the application

### **Key Benefits of This Approach:**

- ✅ **Always works** - Magic code always succeeds (InstantDB handles user creation)
- ✅ **No validation loops** - Profile checking happens after authentication
- ✅ **Graceful handling** - Missing profiles are handled by creating basic ones
- ✅ **Clean separation** - Auth flow vs. setup flow are separate
- ✅ **Real-time updates** - InstantDB handles auth state changes automatically
- ✅ **Type safety** - Full TypeScript support throughout
- ✅ **Error handling** - Comprehensive error handling at every step

## 🚀 **8. Implementation Patterns for Different App Types**

### **Pattern 1: Simple Single-Tenant App**

For apps where users don't need multiple businesses/accounts:

```typescript
// Simplified flow - no business setup needed
const authFlow = async (email: string, code: string) => {
  // 1. Authenticate with InstantDB
  await signInWithMagicCode({ email, code });

  // 2. Check if profile exists
  const profile = await getProfileByEmail(email);

  if (!profile) {
    // 3. Create profile directly (no business setup)
    await createProfile({
      name: "User",
      email: email,
      role: "user",
      // No business_id needed
    });
  }

  // 4. Go to main app
  redirectToDashboard();
};
```

### **Pattern 2: Multi-Tenant SaaS App**

For apps where users can belong to multiple organizations:

```typescript
// Multi-tenant flow with organization selection
const authFlow = async (email: string, code: string) => {
  // 1. Authenticate with InstantDB
  await signInWithMagicCode({ email, code });

  // 2. Check if profile exists
  const profile = await getProfileByEmail(email);

  if (!profile) {
    // 3. Create basic profile
    await createProfile({
      name: "User",
      email: email,
      role: "member",
      organization_id: "", // Will be set when joining org
    });

    // 4. Go to organization selection/setup
    redirectToOrganizationSetup(email);
  } else {
    // 5. Check organizations
    const orgs = await getUserOrganizations(profile.id);

    if (orgs.length === 0) {
      redirectToOrganizationSetup(email);
    } else if (orgs.length === 1) {
      redirectToOrganization(orgs[0].slug);
    } else {
      redirectToOrganizationSelector(orgs);
    }
  }
};
```

### **Pattern 3: Marketplace App**

For apps where users can be both buyers and sellers:

```typescript
// Marketplace flow with role selection
const authFlow = async (email: string, code: string) => {
  // 1. Authenticate with InstantDB
  await signInWithMagicCode({ email, code });

  // 2. Check if profile exists
  const profile = await getProfileByEmail(email);

  if (!profile) {
    // 3. Create profile with default role
    await createProfile({
      name: "User",
      email: email,
      role: "buyer", // Default role
      seller_profile_id: "", // Will be created if they become seller
    });

    // 4. Go to role selection
    redirectToRoleSelection(email);
  } else {
    // 5. Check if they have seller profile
    if (profile.seller_profile_id) {
      redirectToSellerDashboard();
    } else {
      redirectToBuyerDashboard();
    }
  }
};
```

## 📁 **9. Complete File Structure**

```
lib/
├── contexts/
│   ├── auth-context.tsx          # Enhanced auth state management
│   └── business-context.tsx      # Business/multi-tenancy context
├── hooks/
│   └── use-auth.ts               # Custom auth hooks
├── types/
│   ├── auth.ts                   # Unified auth types
│   ├── database.ts               # Database types
│   └── roles.ts                  # Role definitions
├── instantdb-client.ts           # InstantDB client configuration
└── instantdb-admin.ts            # InstantDB admin configuration

app/
├── actions/
│   └── auth.ts                   # Server actions for auth operations
├── auth/
│   └── page.tsx                  # Auth page with AuthFlow
├── [businessSlug]/
│   ├── page.tsx                  # Business-specific pages
│   └── layout.tsx                # Business layout wrapper
├── setup/
│   ├── page.tsx                  # Business setup page
│   └── setup-page-client.tsx     # Client component for setup
└── layout.tsx                    # Root layout with providers

components/
├── auth/
│   ├── auth-flow.tsx             # Main auth flow orchestrator
│   ├── login-form.tsx            # Login form component
│   ├── magic-code-form.tsx       # Magic code verification
│   ├── business-setup.tsx        # Business setup flow
│   ├── business-selector.tsx     # Business selection
│   ├── auth-wrapper.tsx          # Route protection wrapper
│   └── protected-route.tsx       # Protected route component
└── dashboard/
    └── role-based-dashboard.tsx  # Role-based navigation

middleware.ts                     # Route protection middleware
instant.schema.ts                 # Database schema definition
```

## 🎯 **10. Key Implementation Principles**

### **Always Follow These Rules:**

1. **Always authenticate first** - Let InstantDB handle user creation/authentication
2. **Check profile after auth** - Don't validate profiles before magic code
3. **Create minimal profiles** - Add details during setup flow
4. **Handle missing data gracefully** - Redirect to appropriate setup
5. **Use dedicated setup pages** - Don't inline complex setup in auth flow

### **Common Gotchas & Solutions:**

| Issue                   | Cause                                   | Solution                               |
| ----------------------- | --------------------------------------- | -------------------------------------- |
| "Loading..." forever    | Auth context not updating loading state | Check `setIsLoading(false)` placement  |
| "No account found"      | Profile validation working correctly    | User needs to sign up first            |
| Magic code not working  | Profile doesn't exist                   | Create profile via signup flow         |
| Auth state not updating | InstantDB auth hook timing              | Add delays and proper state management |

### **Debugging Tips:**

```typescript
// Add these console logs to debug auth flow
console.log("🔄 Auth state changed:", {
  authLoading,
  instantUser: instantUser?.email,
});
console.log("📋 Profile check result:", result);
console.log("✅ Magic code verification successful");
```

## 🎉 **11. Final Implementation Checklist**

### **Setup Checklist:**

- [ ] Install InstantDB packages (`@instantdb/react`, `@instantdb/admin`)
- [ ] Set up environment variables
- [ ] Create database schema
- [ ] Implement auth context
- [ ] Create auth flow components
- [ ] Set up middleware
- [ ] Create server actions
- [ ] Implement custom hooks
- [ ] Add error handling
- [ ] Test the complete flow

### **Testing Checklist:**

- [ ] New user signup flow
- [ ] Existing user login flow
- [ ] Magic code verification
- [ ] Profile creation
- [ ] Business setup (if applicable)
- [ ] Role-based access
- [ ] Error handling
- [ ] Loading states
- [ ] Sign out functionality

This implementation provides a robust, scalable authentication system that works well with InstantDB's real-time capabilities while leveraging Next.js's powerful routing and rendering features. You can adapt these patterns to any InstantDB + Next.js application! 🚀
