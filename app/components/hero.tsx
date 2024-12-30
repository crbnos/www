import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Cover } from "./ui/cover";
import { FlipWords } from "./ui/flip-words";

export function Hero() {
  const firstRow = screenshots.slice(0, 5);
  const secondRow = screenshots.slice(5, 10);
  const thirdRow = screenshots.slice(10, 15);
  const ref = useRef(null);
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
  return (
    <div
      ref={ref}
      className="h-[280vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <div className="h-[45vh]" />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
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

export function ScreenshotCard({
  screenshot,
  translate,
}: {
  screenshot: {
    title: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={screenshot.title}
      className="group/screenshot h-96 w-[30rem] relative flex-shrink-0"
    >
      <div className="block group-hover/screenshot:shadow-2xl ">
        <img
          src={screenshot.thumbnail}
          height="400"
          width="500"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={screenshot.title}
        />
      </div>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/screenshot:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/screenshot:opacity-100 text-white">
        {screenshot.title}
      </h2>
    </motion.div>
  );
}

export function Header() {
  return (
    <div className="w-full mx-auto">
      <div className="absolute z-logo top-[calc(var(--header-height)+20dvh)] left-0 md:left-12 mx-auto py-20 md:py-40 px-4 w-full text-center md:text-left">
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold dark:text-white">
          The{" "}
          <Cover>
            <FlipWords words={["ERP", "MES", "MRP"]} />
          </Cover>{" "}
          you{" "}
          <Cover>
            <FlipWords words={["own", "control", "customize", "love"]} />
          </Cover>
        </h1>
        <p className="max-w-3xl text-xl md:text-3xl mt-8 text-muted-foreground">
          CarbonOS is a modern, extensible, foundation for{" "}
          <span className="text-foreground">custom manufacturing systems</span>
        </p>
      </div>
    </div>
  );
}

export const screenshots = [
  {
    title: "Resources",
    thumbnail: "/screenshots/permissions.jpeg",
  },
  {
    title: "Bill of Materials",
    thumbnail: "/screenshots/bom.jpeg",
  },
  {
    title: "Work Instructions",
    thumbnail: "/screenshots/bop.jpeg",
  },
  {
    title: "Quotes Table",
    thumbnail: "/screenshots/quotes-table.jpeg",
  },
  {
    title: "Global Search",
    thumbnail: "/screenshots/search.jpeg",
  },
  {
    title: "Documents",
    thumbnail: "/screenshots/documents.jpeg",
  },
  {
    title: "MES Work Instructions",
    thumbnail: "/screenshots/mes-instructions.jpeg",
  },
  {
    title: "Auto-generated API Documentation",
    thumbnail: "/screenshots/api-docs.jpeg",
  },
  {
    title: "Kanban Schedule",
    thumbnail: "/screenshots/kanban.jpeg",
  },
  {
    title: "MES 3D Viewer",
    thumbnail: "/screenshots/mes-model.jpeg",
  },
  {
    title: "Customer Portal",
    thumbnail: "/screenshots/customer-portal-entry.jpeg",
  },
  {
    title: "Resources",
    thumbnail: "/screenshots/resources.jpeg",
  },
  {
    title: "Quote Pricing",
    thumbnail: "/screenshots/quote-pricing.jpeg",
  },
  {
    title: "Configurator",
    thumbnail: "/screenshots/configurator.jpeg",
  },
  {
    title: "Customer Portal",
    thumbnail: "/screenshots/customer-portal.jpeg",
  },
  {
    title: "MES Details",
    thumbnail: "/screenshots/mes-details.jpeg",
  },
];
