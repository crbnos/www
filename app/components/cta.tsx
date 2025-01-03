import { Play } from "lucide-react";
import { Button } from "./ui/button";
import { useWizard } from "./wizard-form";

export function CTA({ isLearnPage = false }: { isLearnPage?: boolean }) {
  const { setShowWizard } = useWizard();
  return (
    <div className="flex min-h-[calc(100dvh-290px)] items-center justify-center">
      <div className="max-w-5xl text-center px-10 py-14 mx-4 md:mx-auto md:px-24 flex items-center flex-col border border-border rounded-lg  dark:bg-muted">
        <span className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground">
          CarbonOS
        </span>
        <p className="text-muted-foreground mt-6">
          The new standard for custom manufacturing systems
        </p>
        <div className="mt-10 md:mb-8">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => setShowWizard(true)}
              size="lg"
              className="text-lg rounded-full"
            >
              {isLearnPage ? "Get in touch" : "Start your trial"}
              <Play className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}