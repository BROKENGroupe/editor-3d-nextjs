import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStorage";

export function WelcomeStep() {
  const { nextStep } = useOnboardingStore();

  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold">Welcome to the Platform 🎉</h1>
      <p className="text-muted-foreground text-sm">
        Let's get started by setting up your experience.
      </p>
      <Button onClick={nextStep}>Get Started</Button>
    </div>
  );
}
