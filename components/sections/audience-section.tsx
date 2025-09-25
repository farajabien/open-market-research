import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AudienceSection() {
  const founderBenefits = [
    "Discover the top 2–3 challenges your target audience actually faces.",
    "Avoid wasted cycles asking questions that have already been answered.",
    "Position your product where the evidence shows the biggest pain.",
  ];

  const researcherBenefits = [
    "Build a public contributor profile.",
    "Link your studies back to your live project or startup.",
    "Help shape an open baseline that benefits everyone in your industry.",
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/50">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold tracking-tight">
                For Founders & Builders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                Stop guessing what your customers want. Use validated research
                to:
              </p>
              <ul className="space-y-4">
                {founderBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold tracking-tight">
                For Researchers & Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                Your research matters. Get credit and visibility when you share:
              </p>
              <ul className="space-y-4">
                {researcherBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
