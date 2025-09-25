import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <div className="text-4xl">🔍</div>
              <h2 className="text-xl font-semibold">Loading Research...</h2>
              <p className="text-sm text-muted-foreground">
                Gathering the latest market insights for you
              </p>
            </div>

            <div className="space-y-2">
              <Progress value={66} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Processing data...
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
  );
}
