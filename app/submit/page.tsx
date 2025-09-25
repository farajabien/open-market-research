import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-4xl font-bold tracking-tight mb-4">
                Submit Your Research
              </CardTitle>
              <p className="text-lg text-muted-foreground">Coming Soon</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                We&apos;re building an easy-to-use submission form that will
                automatically structure your research into our standardized
                format. Soon you&apos;ll be able to:
              </p>

              <ul className="text-left space-y-3 max-w-md mx-auto">
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                  <span className="text-sm">
                    Paste raw research notes, survey results, or interview
                    transcripts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                  <span className="text-sm">
                    Let our AI automatically structure it into our JSON schema
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                  <span className="text-sm">
                    Review and edit the structured data before submission
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                  <span className="text-sm">
                    Get contributor attribution and link to your project
                  </span>
                </li>
              </ul>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Have research to share right now?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="mailto:hello@fbien.com?subject=Research Submission&body=Hi! I have market research to share. Here are the details:">
                      Email Your Research
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/studies">Browse Studies</Link>
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>What to include in your email:</strong>
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 text-left max-w-sm mx-auto">
                    <li>• Research title and summary</li>
                    <li>• Target audience/market details</li>
                    <li>• Key findings and insights</li>
                    <li>• Methodology (survey, interviews, etc.)</li>
                    <li>• Sample size and collection period</li>
                    <li>• Your name and project link (optional)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
