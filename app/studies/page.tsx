import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-4xl font-bold tracking-tight mb-4">
                Studies Library
              </CardTitle>
              <p className="text-lg text-muted-foreground">Coming Soon</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                We&apos;re building a comprehensive library of market research
                studies that you can search, filter, and download. Soon
                you&apos;ll be able to:
              </p>

              <ul className="text-left space-y-3 max-w-md mx-auto">
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                  <span className="text-sm">
                    Browse studies by country, industry, and role
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                  <span className="text-sm">
                    Search through findings and insights
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                  <span className="text-sm">
                    Download data in JSON, CSV, or PDF
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                  <span className="text-sm">
                    Connect with study contributors
                  </span>
                </li>
              </ul>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Want to be notified when we launch?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/submit">Submit Your Research</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="mailto:hello@fbien.com">Get Updates</Link>
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  In the meantime, check out our{" "}
                  <Link href="/" className="text-primary hover:underline">
                    example study
                  </Link>{" "}
                  on real estate agent challenges in Nairobi.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
