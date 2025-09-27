"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { useAuthActions } from "@/lib/hooks/use-auth";
import { useAuth } from "@/lib/contexts/auth-context";
import { allRoutes } from "@/lib/auth/routes";
import { toast } from "sonner";

interface LoginFormProps {
  onEmailSent: (email: string) => void;
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
      console.log("📧 Sending magic code for login flow:", email);
      await sendMagicCode(email);
      toast.success("Magic code sent! Check your email.");
      onEmailSent(email);
    } catch (error) {
      console.error("❌ Send magic code error:", error);
      toast.error("Failed to send magic code. Please try again.");
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
              Welcome to Open Market Research
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
                    Sending Code...
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

interface MagicCodeFormProps {
  email: string;
  onCodeVerified: () => void;
  onBack: () => void;
}

export function MagicCodeForm({
  email,
  onCodeVerified,
  onBack,
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
      console.log("🔐 Verifying magic code for:", email);
      await signInWithMagicCode({ email, code });
      console.log("✅ Magic code verification successful");
      toast.success("Successfully authenticated!");
      onCodeVerified();
    } catch (error) {
      console.log("❌ Magic code verification failed:", error);
      toast.error("Invalid verification code. Please try again.");
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
    } catch (error) {
      console.error("❌ Resend code error:", error);
      toast.error("Failed to resend code. Please try again.");
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
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Email
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

// Main auth flow component
export function AuthFlow() {
  const [step, setStep] = useState<"login" | "magic-code">("login");
  const [email, setEmail] = useState("");
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      const redirectTo = searchParams.get("redirect") || allRoutes.STUDIES;
      console.log("User authenticated, redirecting to:", redirectTo);
      router.replace(redirectTo);
    }
  }, [user, isLoading, router, searchParams]);

  const handleEmailSent = (userEmail: string) => {
    console.log("📧 Email sent handler called:", userEmail);
    setEmail(userEmail);
    setStep("magic-code");
  };

  const handleCodeVerified = () => {
    console.log("✅ Code verified, user should be authenticated");
    // The useEffect above will handle the redirect
  };

  const handleBack = () => {
    setStep("login");
    setEmail("");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <span className="text-foreground">Loading...</span>
        </div>
      </div>
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
          onCodeVerified={handleCodeVerified}
          onBack={handleBack}
        />
      );
    default:
      return <LoginForm onEmailSent={handleEmailSent} />;
  }
}
