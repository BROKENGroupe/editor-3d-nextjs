import { create } from "zustand";

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

interface Profile {
  name: string;
  timezone: string;
}

interface OnboardingState {
  step: OnboardingStep;
  selectedTools: string[];
  profile: Profile;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: OnboardingStep) => void;
  toggleTool: (tool: string) => void;
  setProfile: (profile: Profile) => void;
}

const steps: OnboardingStep[] = [
  "welcome",
  "choose_tools",
  "set_profile",
  "skills",
  "availability",
  "experience",
  "preferences",
  "rates",
  "goals",
  "review",
  "finish",
];

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  step: "welcome",
  selectedTools: [],
  profile: { name: "", timezone: "" },

  nextStep: () => {
    const currentIndex = steps.indexOf(get().step);
    if (currentIndex < steps.length - 1) {
      set({ step: steps[currentIndex + 1] });
    }
  },

  prevStep: () => {
    const currentIndex = steps.indexOf(get().step);
    if (currentIndex > 0) {
      set({ step: steps[currentIndex - 1] });
    }
  },

  setStep: (step: OnboardingStep) => set({ step }),

  toggleTool: (tool: string) => {
    const tools = get().selectedTools;
    const updated =
      tools.includes(tool)
        ? tools.filter(t => t !== tool)
        : [...tools, tool];

    set({ selectedTools: updated });
  },

  setProfile: (profile: Profile) => set({ profile }),
}));
