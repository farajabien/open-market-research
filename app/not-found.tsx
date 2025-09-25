import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { allRoutes } from "@/lib/auth/routes";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Page Not Found
            </CardTitle>
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href={allRoutes.HOME}>Go Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={allRoutes.STUDIES}>Browse Studies</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Need help? Contact us at{" "}
              <a
                href="mailto:hello@fbien.com"
                className="text-primary hover:underline"
              >
                hello@fbien.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
