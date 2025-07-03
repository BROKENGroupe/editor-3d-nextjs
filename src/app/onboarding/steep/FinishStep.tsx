import { Button } from "@/components/ui/button";

export function FinishStep() {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold">You're all set! ✅</h2>
      <p className="text-muted-foreground text-sm">
        Your preferences have been saved. You can now explore the platform.
      </p>
      <Button asChild>
        <a href="/dashboard">Go to Dashboard</a>
      </Button>
    </div>
  );
}