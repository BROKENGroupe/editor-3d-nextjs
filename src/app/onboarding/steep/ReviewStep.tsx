
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboardingStorage";

export function ReviewStep() {
  const { profile, selectedTools, nextStep, prevStep } =
    useOnboardingStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-2">Review your info</h2>
      <div className="space-y-2">
        <div>
          <strong>Name:</strong> {profile.name}
        </div>
        <div>
          <strong>Timezone:</strong> {profile.timezone}
        </div>
        <div>
          <strong>Tools:</strong> {selectedTools.join(", ") || "None"}
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Confirm</Button>
      </div>
    </div>
  );
}
