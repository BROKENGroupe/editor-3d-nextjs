"use client";

import { useOnboardingStore } from "@/store/onboardingStorage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function GoalsStep() {
  const { nextStep } = useOnboardingStore();
  const [goals, setGoals] = useState("");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your goals</h2>
      <p className="text-gray-500">What are you hoping to achieve on Broken Taskflow?</p>
      <Textarea
        placeholder="E.g. Collaborate with international clients, build a solid portfolio, etc."
        value={goals}
        onChange={(e) => setGoals(e.target.value)}
      />
      <Button onClick={nextStep}>Finish step</Button>
    </div>
  );
}
