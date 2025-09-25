import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StudiesLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="text-4xl">📚</div>
                <h2 className="text-2xl font-semibold">
                  Loading Studies Library...
                </h2>
                <p className="text-muted-foreground">
                  Fetching the latest market research studies
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={45} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  Processing research data...
                </p>
              </div>

              <div className="flex justify-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
