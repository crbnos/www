import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { CTA } from "~/components/cta";
import { Header, Hero } from "~/components/hero";
import { Button } from "~/components/ui/button";
import { Actor, ScrollStage, useStage } from "~/components/ui/stage";
import TextRevealByWord from "~/components/ui/text-reveal";
import { useIsMobile } from "~/hooks/useIsMobile";
import { cn } from "~/lib/utils";

export default function Route() {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile ? <Header className="mb-[40vh]" /> : <Hero />}
      <WhatIsCarbonOS />
      <Benefits isMobile={isMobile} />
      <CTA />
    </>
  );
}

function WhatIsCarbonOS() {
  return (
    <TextRevealByWord
      text={`CarbonOS is a simple, flexible, and powerful manufacturing software. It is designed to be easy to use and easy to understand.
We've taken the best parts of the most popular manufacturing software and combined them into a single, unified system, powered by the best technology available.`}
    />
  );
}

type Slide = {
  img: string;
  description: React.ReactNode;
  link?: string;
  start: number;
  end: number;
};

function BenefitDescription({
  start,
  end,
  children,
}: {
  start: number;
  end: number;
  children: React.ReactNode;
}) {
  return (
    <Actor start={start} end={end}>
      <motion.p
        className="fixed left-10 bottom-[10dvh] md:left-10 md:top-5 flex flex-col justify-center md:min-h-[100dvh] w-[calc(100%-5rem)] md:w-1/3 items-start px-6 font-medium text-lg text-muted-foreground text-balance "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.p>
    </Actor>
  );
}

const slides: Slide[] = [
  {
    img: "/screenshots/sales-funnel.webp",
    description: (
      <>
        <strong className="font-semibold text-foreground">
          Fast and accurate quoting
        </strong>{" "}
        CarbonOS makes it easy for make-to-print and configure-to-order
        manufacturers to quickly and accurately quote based on multi-level
        bill-of-materials and routing.
      </>
    ),
    start: 0.1,
    end: 0.2,
  },
  {
    img: "/screenshots/features-schedule.webp",
    description: (
      <>
        Manage purchasing, production, scheduling, inventory, receiving, and
        factory resources within a{" "}
        <strong className="font-semibold text-foreground">
          single, integrated system of record.
        </strong>
      </>
    ),
    link: "/learn/vertically-integrated-stack",
    start: 0.22,
    end: 0.35,
  },
  {
    img: "/screenshots/features-mes.webp",
    description: (
      <>
        <strong className="font-semibold text-foreground">
          Run your shop-floor operations.
        </strong>{" "}
        CarbonOS's MES app is a powerful tool for managing your shop-floor
        operations. It allows you to track production progress, manage
        resources, and more.
      </>
    ),
    link: "/learn/vertically-integrated-stack",
    start: 0.37,
    end: 0.5,
  },
  {
    img: "/screenshots/traceability.webp",
    description: (
      <>
        <strong className="font-semibold text-foreground">
          End-to-end traceability
        </strong>{" "}
        from raw materials to finished products, you'll have complete visibility
        into your supply chain.
      </>
    ),
    start: 0.52,
    end: 0.65,
  },
  {
    img: "/screenshots/features-api.webp",
    description: (
      <>
        <strong className="font-semibold text-foreground">
          API-first design
        </strong>{" "}
        that allows you to build custom applications on top of our source code,
        our SDK, and our self-documenting API.
      </>
    ),
    link: "/learn/build-custom-applications",
    start: 0.67,
    end: 0.8,
  },
  {
    img: "/screenshots/agent.webp",
    description: (
      <>
        <strong className="font-semibold text-foreground">
          Integrated AI-powered agents
        </strong>{" "}
        can do the rote tasks that take up your time, so you can focus on the
        things that matter most.
      </>
    ),

    start: 0.82,
    end: 0.95,
  },
];

function BenefitImages({ isMobile }: { isMobile: boolean }) {
  const stage = useStage();

  return (
    <div className={cn(isMobile ? "flex flex-col gap-4" : "-mt-[100dvh]")}>
      {slides.map((slide, index) => {
        const slideProgress = stage.progress * 6 - index;

        const opacity =
          slideProgress < 1.3 || isMobile
            ? 1
            : Math.max(0, 1 - (slideProgress - 1.3) / 0.7);

        return (
          <div
            key={index}
            className={cn(
              isMobile
                ? "flex flex-col bg-muted rounded-lg border border-border gap-4 p-6"
                : "flex items-center justify-center min-h-[100dvh]"
            )}
          >
            <div className="relative w-full" style={{ opacity }}>
              <img
                src={slide.img}
                alt={
                  typeof slide.description === "string"
                    ? slide.description
                    : "Slide image"
                }
                className="w-full h-auto rounded-lg"
              />
              <div
                className="absolute inset-0 rounded-r-lg"
                style={{
                  content: "",
                  background:
                    "radial-gradient(97% 162% at -5% 6%, rgba(11, 11, 15, 0) 0%, rgba(11, 11, 15, 0) 60%, rgb(0, 0, 0) 100%)",
                }}
              />
            </div>
            {isMobile && (
              <div className="flex flex-col items-start justify-center gap-4">
                <p className="font-medium text-base text-muted-foreground text-balance">
                  {slide.description}
                </p>
                {slide.link && (
                  <Button className="mt-4" variant="outline" asChild>
                    <Link to={slide.link}>
                      Learn more <Lightbulb className="size-4" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Benefits({ isMobile }: { isMobile: boolean }) {
  return (
    <ScrollStage
      pages={isMobile ? 1 : 6.5}
      fallbackLength={100}
      fallbackFrame={25}
    >
      {!isMobile && (
        <div className="md:flex relative">
          <div className="sticky bottom-0 w-1/3 md:bottom-auto md:top-0 md:flex md:h-screen md:flex-1 md:items-center md:self-start">
            {slides.map((slide, index) => (
              <BenefitDescription
                key={index}
                start={slide.start}
                end={slide.end}
              >
                {slide.description}
                {slide.link && (
                  <Button className="mt-4" variant="outline" asChild>
                    <Link to={slide.link}>
                      Learn more <Lightbulb className="size-4" />
                    </Link>
                  </Button>
                )}
              </BenefitDescription>
            ))}
          </div>
        </div>
      )}

      <div className={isMobile ? "flex-1" : "ml-[50%] flex-1"}>
        <div className="w-full md:max-w-3xl px-3">
          <BenefitImages isMobile={isMobile} />
        </div>
      </div>
    </ScrollStage>
  );
}
