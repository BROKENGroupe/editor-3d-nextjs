
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOnboardingStore } from "@/store/onboardingStorage";

const TOOLS = ["Next.js", "Figma", "Slack", "Jira", "Firebase"];

export function ChooseToolsStep() {
  const { selectedTools, toggleTool, nextStep, prevStep } =
    useOnboardingStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Select your tools</h2>
        <p className="text-muted-foreground text-sm">
          Choose the platforms and tools you typically work with.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {TOOLS.map((tool) => (
          <Card
            key={tool}
            onClick={() => toggleTool(tool)}
            className={`cursor-pointer transition-all duration-200 border ${
              selectedTools.includes(tool)
                ? "border-primary shadow-lg scale-[1.03]"
                : "border-muted"
            }`}
          >
            <CardContent className="p-6 text-center flex flex-col items-center gap-2">
              <span className="text-base font-medium">{tool}</span>
              {selectedTools.includes(tool) && <Badge>Selected</Badge>}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={selectedTools.length === 0}>
          Continue
        </Button>
      </div>
    </div>
  );
}
