import SubmissionFormWrapper from "@/components/submission/submission-form-wrapper";

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Submit Your Research
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your market research findings with the community. Help other
              founders build from evidence, not guesswork.
            </p>
          </div>
          <SubmissionFormWrapper />
        </div>
      </div>
    </div>
  );
}
