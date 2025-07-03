"use client";

import { useOnboardingStore } from "@/store/onboardingStorage";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const OPTIONS = ["Web Apps", "Landing Pages", "Branding", "Mobile Apps", "Motion Design"];

export function PreferencesStep() {
  const { nextStep } = useOnboardingStore();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Preferred project types</h2>
      <p className="text-gray-500">Choose what excites you the most to work on.</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              selected.includes(opt)
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-green-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <Button onClick={nextStep}>Continue</Button>
    </div>
  );
}