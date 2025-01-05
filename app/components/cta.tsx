import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "./ui/button";
import { useWizard } from "./wizard-form";

export function CTA({ isLearnPage = false }: { isLearnPage?: boolean }) {
  const { setShowWizard } = useWizard();
  const { scrollYProgress } = useScroll();

  const backgroundColor = useTransform(
    scrollYProgress,
    [0.96, 0.99],
    ["rgb(24 24 27 / 1)", "rgb(24 24 27 / 0)"]
  );

  const borderColor = useTransform(
    scrollYProgress,
    [0.96, 0.99],
    ["rgb(39 39 42 / 1)", "rgb(39 39 42 / 0)"]
  );

  const textColor = useTransform(
    scrollYProgress,
    [0.96, 0.99],
    ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0.8)"]
  );

  return (
    <div className="flex min-h-[calc(100dvh-290px)] items-center justify-center">
      <motion.div
        className="max-w-5xl text-center px-10 py-14 mx-4 md:mx-auto md:px-24 flex items-center flex-col rounded-lg"
        style={{
          backgroundColor,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor,
        }}
      >
        <motion.span
          className="text-6xl md:text-8xl font-bold tracking-tighter"
          style={{ color: textColor }}
        >
          CarbonOS
        </motion.span>
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
      </motion.div>
    </div>
  );
}
