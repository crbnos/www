import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

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
    useTransform(scrollYProgress, [0, 0.7], [0.7, 1]),
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.0, duration: 2.0 }}
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

export const screenshots = [
  {
    title: "Resources",
    thumbnail: "/screenshots/permissions.webp",
  },
  {
    title: "Bill of Materials",
    thumbnail: "/screenshots/bom.webp",
  },
  {
    title: "Work Instructions",
    thumbnail: "/screenshots/bop.webp",
  },
  {
    title: "Quotes Table",
    thumbnail: "/screenshots/quotes-table.webp",
  },
  {
    title: "Global Search",
    thumbnail: "/screenshots/search.webp",
  },
  {
    title: "Documents",
    thumbnail: "/screenshots/documents.webp",
  },
  {
    title: "MES Work Instructions",
    thumbnail: "/screenshots/mes-instructions.webp",
  },
  {
    title: "Auto-generated API Documentation",
    thumbnail: "/screenshots/api-docs.webp",
  },
  {
    title: "Kanban Schedule",
    thumbnail: "/screenshots/kanban.webp",
  },
  {
    title: "MES 3D Viewer",
    thumbnail: "/screenshots/mes-model.webp",
  },
  {
    title: "Customer Portal",
    thumbnail: "/screenshots/customer-portal-entry.webp",
  },
  {
    title: "Resources",
    thumbnail: "/screenshots/resources.webp",
  },
  {
    title: "Quote Pricing",
    thumbnail: "/screenshots/quote-pricing.webp",
  },
  {
    title: "Configurator",
    thumbnail: "/screenshots/configurator.webp",
  },
  {
    title: "Customer Portal",
    thumbnail: "/screenshots/customer-portal.webp",
  },
  {
    title: "MES Details",
    thumbnail: "/screenshots/mes-details.webp",
  },
];
