import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function CTASection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Build Smarter?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Share your research. Browse the library. Help every founder start
              with evidence.
            </p>
            <div className="flex items-center justify-center gap-x-6">
              <Link
                href="/submit"
                className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Submit Research
              </Link>
              <Link
                href="/studies"
                className="rounded-md border border-border px-3.5 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Browse Studies
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
