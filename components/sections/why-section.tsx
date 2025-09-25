import { Card, CardContent } from "@/components/ui/card";

export default function WhySection() {
  const benefits = [
    {
      title: "Save time",
      description:
        "Don't repeat the same interviews. Learn from existing data.",
    },
    {
      title: "Share knowledge",
      description:
        "Every founder's research adds value to the whole community.",
    },
    {
      title: "Level the field",
      description:
        "Even small teams get access to market insights, not just the well-funded.",
    },
    {
      title: "Stay open",
      description:
        "All studies are public, versioned, and attributed to contributors.",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Why Open Market Research?
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <Card key={index} className="p-6">
              <CardContent className="p-0">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="h-3 w-3 text-primary-foreground"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
