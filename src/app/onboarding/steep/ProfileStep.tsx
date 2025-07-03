import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useOnboardingStore } from "@/store/onboardingStorage";

export function ProfileStep() {
  const { profile, setProfile, nextStep, prevStep } = useOnboardingStore();
  const [name, setName] = useState(profile.name);
  const [timezone, setTimezone] = useState(profile.timezone);

  const handleContinue = () => {
    setProfile({ name, timezone });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Your Profile</h2>
        <p className="text-muted-foreground text-sm">
          Tell us a bit about yourself.
        </p>
      </div>
      <div className="space-y-4">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Your timezone (e.g. GMT-5)"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        />
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!name || !timezone}>
          Continue
        </Button>
      </div>
    </div>
  );
}