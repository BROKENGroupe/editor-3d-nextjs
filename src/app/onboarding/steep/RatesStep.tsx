"use client";

import { useOnboardingStore } from "@/store/onboardingStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function RatesStep() {
  const { nextStep } = useOnboardingStore();
  const [rate, setRate] = useState("");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your rates</h2>
      <p className="text-gray-500">What is your typical hourly rate?</p>
      <Input
        type="number"
        placeholder="$ USD / hour"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
      />
      <Button onClick={nextStep}>Continue</Button>
    </div>
  );
}