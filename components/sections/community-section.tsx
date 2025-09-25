import { Card, CardContent } from "@/components/ui/card";

export default function CommunitySection() {
  const promises = [
    {
      title: "Free",
      description: "to use and contribute",
    },
    {
      title: "Open-source",
      description: "(built in Next.js + InstantDB)",
    },
    {
      title: "Transparent",
      description: "in moderation and licensing",
    },
    {
      title: "Collaborative",
      description: "— powered by contributions",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/50">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-6">
          Community Promise
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Open Market Research will always be:
        </p>
        <div className="grid gap-6 md:grid-cols-4">
          {promises.map((promise, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">{promise.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {promise.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
