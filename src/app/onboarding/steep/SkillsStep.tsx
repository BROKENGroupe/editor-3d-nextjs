"use client";

import { useOnboardingStore } from "@/store/onboardingStorage";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ALL_SKILLS = [
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Node.js",
  "Figma",
  "UX/UI",
  "Tailwind CSS",
  "WordPress",
  "Branding",
  "3D Design",
  "Framer Motion",
  "Firebase",
  "MongoDB",
];

export function SkillsStep() {
  const { selectedTools, toggleTool, nextStep } = useOnboardingStore();

  const handleSelect = (skill: string) => {
    toggleTool(skill);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">What are your main skills?</h2>
        <p className="text-gray-500">
          Select the technologies, tools or areas you are most experienced in.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ALL_SKILLS.map((skill) => {
          const isSelected = selectedTools.includes(skill);
          return (
            <button
              key={skill}
              onClick={() => handleSelect(skill)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                isSelected
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black"
              }`}
            >
              {skill}
            </button>
          );
        })}
      </div>

      <div className="pt-4">
        <Button onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}
