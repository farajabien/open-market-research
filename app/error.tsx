"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl font-bold text-destructive mb-4">⚠️</div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Something went wrong
            </CardTitle>
            <p className="text-muted-foreground">
              We encountered an unexpected error. Please try again or contact
              support if the problem persists.
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset}>Try Again</Button>
              <Button variant="outline" asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Error ID: {error.digest || "unknown"}</p>
              <p>
                Need help? Contact us at{" "}
                <a
                  href="mailto:hello@fbien.com"
                  className="text-primary hover:underline"
                >
                  hello@fbien.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
