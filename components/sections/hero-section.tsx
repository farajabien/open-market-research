import Link from "next/link";
import { allRoutes } from "@/lib/auth/routes";

export default function HeroSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Start With Evidence, Not Guesswork
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Open Market Research is a free, open-source hub for structured startup
          market research. Browse studies, share your findings, and build
          smarter from day one.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={allRoutes.STUDIES}
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Browse Studies
          </Link>
          <Link
            href={allRoutes.SUBMIT}
            className="rounded-md border border-border px-3.5 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Submit Your Research
          </Link>
        </div>
      </div>
    </section>
  );
}
