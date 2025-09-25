import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Submit",
      description:
        "Paste your research (notes, survey results, reports) into our submission form.",
    },
    {
      number: 2,
      title: "Structure",
      description:
        "We process it through our pipeline — turning raw notes into clean, structured data.",
    },
    {
      number: 3,
      title: "Discover",
      description:
        "Your study is added to the public library, searchable by country, industry, role, and tags.",
    },
    {
      number: 4,
      title: "Reuse",
      description:
        "Other founders (and you) can reuse it to validate ideas, refine products, and share insights.",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/50">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.number} className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl mb-4">
                  {step.number}
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
