import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExampleSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Early Example
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We interviewed real estate agents in Nairobi. Top findings:
            </p>
            <ol className="list-decimal list-inside space-y-3 mb-6">
              <li className="text-sm">
                <strong>Getting access to fresh vacant units</strong> — Due to
                the fast-moving nature of rentals, by the time agents learn
                about a vacancy, it&apos;s often already taken. Everyone is
                competing for the same limited inventory.
              </li>
              <li className="text-sm">
                <strong>Content creation is time-consuming</strong> — Most
                agents work part-time, so shooting videos, editing content, and
                posting across multiple social media platforms becomes a major
                hassle that eats up their limited time.
              </li>
            </ol>
            <p className="text-sm text-muted-foreground">
              Another founder, building in the same space, validated his problem
              immediately — starting conversations from insight, not scratch.
            </p>
            <p className="text-sm font-medium mt-4">
              That&apos;s the power of shared market research.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
