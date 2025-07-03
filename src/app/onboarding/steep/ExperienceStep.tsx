"use client";

import { useOnboardingStore } from "@/store/onboardingStorage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export function ExperienceStep() {
  const { nextStep } = useOnboardingStore();
  const [experience, setExperience] = useState("");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tell us about your experience</h2>
      <p className="text-gray-500">Share a brief overview of your professional background.</p>
      <Textarea
        placeholder="E.g. 5 years working with frontend projects using React..."
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />
      <Button onClick={nextStep}>Continue</Button>
    </div>
  );
}