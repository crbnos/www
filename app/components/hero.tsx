// Start of Selection
import { Trans, useLingui } from "@lingui/react/macro";
import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Play } from "lucide-react";
import { memo, useMemo, useRef } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { useWizard } from "./wizard-form";

export function Hero() {
  const ref = useRef(null);
  const screenshots = useScreenshots();

  const firstRow = useMemo(() => screenshots.slice(0, 5), [screenshots]);
  const secondRow = useMemo(() => screenshots.slice(5, 10), [screenshots]);
  const thirdRow = useMemo(() => screenshots.slice(10, 15), [screenshots]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );

  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  const paddingTop = useTransform(scrollYProgress, [0, 0.2], ["80dvh", "0dvh"]);

  const motionStyles = useMemo(
    () => ({
      rotateX,
      rotateZ,
      translateY,
      paddingTop,
    }),
    [scrollYProgress]
  );

  return (
    <div
      ref={ref}
      className="min-h-[2300px] h-[250dvh] overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] will-change-transform"
    >
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.5, duration: 2.0, ease: "easeInOut" }}
        style={motionStyles}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((screenshot) => (
            <ScreenshotCard
              screenshot={screenshot}
              translate={translateX}
              key={screenshot.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((screenshot) => (
            <ScreenshotCard
              screenshot={screenshot}
              translate={translateXReverse}
              key={screenshot.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((screenshot) => (
            <ScreenshotCard
              screenshot={screenshot}
              translate={translateX}
              key={screenshot.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export const Header = memo(({ className }: { className?: string }) => {
  const { setShowWizard } = useWizard();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 1.0, ease: "easeInOut" }}
      className={cn(
        "flex flex-col items-center justify-start gap-8 pt-[22dvh] px-8 z-logo",
        className
      )}
    >
      <h2 className="text-balance mx-auto mt-4 max-w-4xl text-center text-4xl font-semibold tracking-tighter bg-[radial-gradient(at_top_left,_var(--tw-gradient-stops))] from-zinc-700 to-zinc-900 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem]">
        <Trans>The Modern Manufacturing Stack</Trans>
      </h2>
      <p className="text-balance mx-auto max-w-4xl text-center text-muted-foreground font-medium text-lg">
        <Trans>Carbon combines ERP, MES, and QMS into a single, unified system.</Trans>
      </p>
      <Button
        onClick={() => setShowWizard(true)}
        size="xl"
        variant="outline"
        className="text-lg rounded-full"
      >
        <Trans>Get Started</Trans>
        <Play className="size-5" />
      </Button>
    </motion.div>
  );
});

Header.displayName = "Header";

export const ScreenshotCard = memo(
  ({
    screenshot,
    translate,
  }: {
    screenshot: {
      title: string;
      thumbnail: string;
    };
    translate: MotionValue<number>;
  }) => {
    return (
      <motion.div
        style={{
          x: translate,
          willChange: "transform",
        }}
        whileHover={{
          y: -20,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
        key={screenshot.title}
        className="group/screenshot h-96 w-[30rem] relative flex-shrink-0"
      >
        <div className="block group-hover/screenshot:shadow-2xl">
          <img
            src={screenshot.thumbnail}
            height="400"
            width="500"
            className="object-cover object-left-top absolute h-full w-full inset-0"
            alt={screenshot.title}
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 h-full w-full opacity-0 group-hover/screenshot:opacity-80 bg-black pointer-events-none"></div>
        <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/screenshot:opacity-100 text-white">
          {screenshot.title}
        </h2>
      </motion.div>
    );
  }
);

ScreenshotCard.displayName = "ScreenshotCard";

export function useScreenshots() {
  const { t } = useLingui();
  return [
    {
      title: t`Work Instructions`,
      thumbnail: "/screenshots/bop.webp",
    },
    {
      title: t`Quotes Table`,
      thumbnail: "/screenshots/quotes-table.webp",
    },
    {
      title: t`MES 3D Viewer`,
      thumbnail: "/screenshots/mes-model.webp",
    },
    {
      title: t`Global Search`,
      thumbnail: "/screenshots/search.webp",
    },
    {
      title: t`Resources`,
      thumbnail: "/screenshots/permissions.webp",
    },
    {
      title: t`Documents`,
      thumbnail: "/screenshots/documents.webp",
    },
    {
      title: t`Kanban Schedule`,
      thumbnail: "/screenshots/kanban.webp",
    },
    {
      title: t`Auto-generated API Documentation`,
      thumbnail: "/screenshots/api-docs.webp",
    },
    {
      title: t`MES Work Instructions`,
      thumbnail: "/screenshots/mes-instructions.webp",
    },
    {
      title: t`Bill of Materials`,
      thumbnail: "/screenshots/bom.webp",
    },
    {
      title: t`Customer Portal`,
      thumbnail: "/screenshots/customer-portal.webp",
    },
    {
      title: t`Configurator`,
      thumbnail: "/screenshots/configurator.webp",
    },
    {
      title: t`Quote Pricing`,
      thumbnail: "/screenshots/quote-pricing.webp",
    },
    {
      title: t`Analytics`,
      thumbnail: "/screenshots/analytics.webp",
    },
    {
      title: t`MES Details`,
      thumbnail: "/screenshots/mes-details.webp",
    },
    {
      title: t`Resources`,
      thumbnail: "/screenshots/resources.webp",
    },
  ];
}
