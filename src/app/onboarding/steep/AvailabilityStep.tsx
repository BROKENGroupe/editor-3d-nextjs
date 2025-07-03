"use client";

import { useOnboardingStore } from "@/store/onboardingStorage";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export function AvailabilityStep() {
  const { nextStep } = useOnboardingStore();
  const [hours, setHours] = useState(20);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your availability</h2>
      <p className="text-gray-500">How many hours can you commit weekly?</p>
      <Slider
        min={0}
        max={40}
        step={1}
        value={[hours]}
        onValueChange={([value]) => setHours(value)}
      />
      <p className="text-sm text-muted-foreground">{hours} hours/week</p>
      <Button onClick={nextStep}>Continue</Button>
    </div>
  );
}