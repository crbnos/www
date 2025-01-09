// Start of Selection
import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { memo, useMemo, useRef } from "react";
import { cn } from "~/lib/utils";

export function Hero() {
  const ref = useRef(null);

  const firstRow = useMemo(() => screenshots.slice(0, 5), []);
  const secondRow = useMemo(() => screenshots.slice(5, 10), []);
  const thirdRow = useMemo(() => screenshots.slice(10, 15), []);

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
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
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

  const paddingTop = useTransform(scrollYProgress, [0, 0.2], ["80vh", "0vh"]);

  const motionStyles = useMemo(
    () => ({
      rotateX,
      rotateZ,
      translateY,
      opacity,
      paddingTop,
    }),
    [rotateX, rotateZ, translateY, opacity, paddingTop]
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] will-change-transform"
    >
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 0.8, duration: 2.0, ease: "easeInOut" }}
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "flex flex-col items-center justify-start gap-4 pt-[22dvh] px-8 z-logo",
        className
      )}
    >
      <h2 className="text-balance mx-auto mt-4 max-w-4xl text-center text-3xl font-semibold tracking-tight text-zinc-700 dark:text-zinc-300 md:text-5xl">
        The Manufacturing Software You Own
      </h2>
      <p className="text-balance mx-auto  max-w-4xl text-center text-zinc-500 font-medium text-lg">
        CarbonOS is the new standard for custom manufacturing systems
      </p>
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

export const screenshots = [
  {
    title: "MES 3D Viewer",
    thumbnail: "/screenshots/mes-model.webp",
  },
  {
    title: "Quotes Table",
    thumbnail: "/screenshots/quotes-table.webp",
  },
  {
    title: "Work Instructions",
    thumbnail: "/screenshots/bop.webp",
  },
  {
    title: "Global Search",
    thumbnail: "/screenshots/search.webp",
  },
  {
    title: "Resources",
    thumbnail: "/screenshots/permissions.webp",
  },
  {
    title: "Documents",
    thumbnail: "/screenshots/documents.webp",
  },
  {
    title: "Kanban Schedule",
    thumbnail: "/screenshots/kanban.webp",
  },
  {
    title: "Auto-generated API Documentation",
    thumbnail: "/screenshots/api-docs.webp",
  },
  {
    title: "MES Work Instructions",
    thumbnail: "/screenshots/mes-instructions.webp",
  },
  {
    title: "Bill of Materials",
    thumbnail: "/screenshots/bom.webp",
  },
  {
    title: "Customer Portal",
    thumbnail: "/screenshots/customer-portal.webp",
  },
  {
    title: "Configurator",
    thumbnail: "/screenshots/configurator.webp",
  },
  {
    title: "Quote Pricing",
    thumbnail: "/screenshots/quote-pricing.webp",
  },
  {
    title: "Analytics",
    thumbnail: "/screenshots/analytics.webp",
  },
  {
    title: "MES Details",
    thumbnail: "/screenshots/mes-details.webp",
  },
  {
    title: "Resources",
    thumbnail: "/screenshots/resources.webp",
  },
];
