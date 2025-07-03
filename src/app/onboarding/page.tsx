"use client";

import { motion } from "framer-motion";
import { useOnboardingStore } from "@/store/onboardingStorage";

// Steps
import { WelcomeStep } from "./steep/WelcomeStep";
import { ChooseToolsStep } from "./steep/ChooseToolsStep";
import { ProfileStep } from "./steep/ProfileStep";
import { AvailabilityStep } from "./steep/AvailabilityStep";
import { ExperienceStep } from "./steep/ExperienceStep";
import { PreferencesStep } from "./steep/PreferencesStep";
import { RatesStep } from "./steep/RatesStep";
import { GoalsStep } from "./steep/GoalsStep";
import { ReviewStep } from "./steep/ReviewStep";
import { FinishStep } from "./steep/FinishStep";
import { SkillsStep } from "./steep/SkillsStep";

type OnboardingStep =
  | "welcome"
  | "choose_tools"
  | "set_profile"
  | "skills"
  | "availability"
  | "experience"
  | "preferences"
  | "rates"
  | "goals"
  | "review"
  | "finish";


export default function Onboarding() {
  const { step } = useOnboardingStore();

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto p-6"
    >
      {step === "welcome" && <WelcomeStep />}
      {step === "choose_tools" && <ChooseToolsStep />}
      {step === "set_profile" && <ProfileStep />}
      {step === "skills" && <SkillsStep />}
      {step === "availability" && <AvailabilityStep />}
      {step === "experience" && <ExperienceStep />}
      {step === "preferences" && <PreferencesStep />}
      {step === "rates" && <RatesStep />}
      {step === "goals" && <GoalsStep />}
      {step === "review" && <ReviewStep />}
      {step === "finish" && <FinishStep />}
    </motion.div>
  );
}
