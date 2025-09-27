import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap, CheckCircle, Sparkles } from "lucide-react";

export default function AIFeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Structuring",
      description:
        "Paste raw research data and our AI automatically extracts key findings, insights, and metadata.",
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description:
        "Get structured data in seconds, not hours. No manual formatting required.",
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description:
        "AI provides confidence scores and suggestions to ensure data quality.",
    },
    {
      icon: Sparkles,
      title: "Smart Extraction",
      description:
        "Automatically identifies methodology, target audience, and research insights.",
    },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Powered by AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our GitHub Models integration automatically structures your raw
            research data, making it instantly searchable and reusable by the
            entire community.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <Bot className="h-4 w-4" />
            Try it now - paste your research data and see the magic!
          </div>
        </div>
      </div>
    </section>
  );
}
