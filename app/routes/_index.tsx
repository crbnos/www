import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { Lightbulb, Play } from "lucide-react";

import {
  Gantt,
  GanttContainer,
  GanttHeader,
  Resource,
} from "~/components/gantt";
import { Hero } from "~/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { AnimatedShinyText } from "~/components/ui/animated-shiny-text";
import { Button } from "~/components/ui/button";
import { Actor, ScrollStage, useStage } from "~/components/ui/stage";
import TextRevealByWord from "~/components/ui/text-reveal";
import { useIsMobile } from "~/hooks/useIsMobile";
import { cn } from "~/lib/utils";

export default function Route() {
  const isMobile = useIsMobile();
  return (
    <>
      <Header />

      {isMobile ? <div className="h-[60vh]" /> : <Hero />}
      <WhatIsCarbonOS />
      <Features isMobile={isMobile} />
      <WhyNotOffTheShelf />
      <GanttComparison />
      <Team />
      <FAQs />
    </>
  );
}

function Header() {
  return (
    <div className="flex flex-col items-center justify-start gap-4 pt-[30dvh] px-8">
      <motion.div
        className="w-[240px]"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="z-logo flex items-center justify-center group rounded-full border border-black/5 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800/20 hover:filter-blur dark:border-white/5 ">
          <AnimatedShinyText className="relative inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-zinc-600 hover:duration-300 hover:dark:text-zinc-400">
            <span>Introducing CarbonOS</span>
            <Play className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </motion.div>
      <motion.h2
        className="text-balance mx-auto mt-4 max-w-4xl text-center text-3xl font-semibold tracking-tight text-zinc-700 dark:text-zinc-300 md:text-5xl"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        The manufacturing software you own
      </motion.h2>
      <motion.p
        className="text-balance mx-auto  max-w-4xl text-center text-zinc-500 font-medium text-lg"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        CarbonOS is the new standard for custom manufacturing systems
      </motion.p>
    </div>
  );
}

function GanttComparison() {
  return (
    <ScrollStage pages={4} fallbackLength={800} fallbackFrame={560}>
      <div
        className="sticky top-0 flex h-screen w-screen mx-auto flex-col justify-center pb-4 xl:pb-56"
        aria-hidden
      >
        <div className="xl:flex">
          <div className="relative xl:-right-10 lg:mt-[18rem] ">
            <GanttHeader>Build from Scratch</GanttHeader>
            <GanttContainer>
              <WithBuildItFromScratch />
            </GanttContainer>
          </div>

          <div className="relative xl:-left-10 lg:mt-[18rem] ">
            <GanttHeader>Build on CarbonOS</GanttHeader>
            <GanttContainer>
              <WithCarbonOS />
            </GanttContainer>
          </div>
        </div>
        <Actor start={0} end={1}>
          <div className="absolute bottom-0 w-full pb-4 text-center text-sm text-gray-300 md:text-base">
            (Keep scrolling to compare)
          </div>
        </Actor>
      </div>
    </ScrollStage>
  );
}

function WithBuildItFromScratch() {
  let resources: [string, number, number][] = [
    ["Online Ordering", 0, 10],
    ["Routing", 10, 10],
    ["Bill of Materials", 20, 10],
    ["MES", 30, 10],
    ["Inventory", 40, 10],
    ["Estimating", 50, 10],
    ["Purchasing", 60, 10],
    ["Resources", 70, 10],
    ["Refactor", 80, 20],
  ];

  return (
    <Gantt>
      {resources.map(([name, start, size]) => (
        <Resource key={name} name={name} start={start} size={size} />
      ))}
    </Gantt>
  );
}

function WithCarbonOS() {
  let resources: [string, number, number][] = [
    ["Online Ordering", 0, 10],
    ["Routing", 0, 10],
    ["Bill of Materials", 0, 10],
    ["MES", 0, 10],
    ["Inventory", 0, 10],
    ["Estimating", 0, 10],
    ["Purchasing", 0, 10],
    ["Resources", 0, 10],
    ["Sales", 0, 10],
    ["Reporting", 0, 10],
    ["Scheduling", 0, 10],
    ["Automation", 10, 10],
    ["Process", 20, 10],
    ["Customizations", 30, 58],
  ];

  return (
    <Gantt>
      {resources.map(([name, start, size]) => (
        <Resource key={name} name={name} start={start} size={size} />
      ))}
    </Gantt>
  );
}

function WhatIsCarbonOS() {
  return (
    <TextRevealByWord
      text={`CarbonOS is an __API-first__ operating system for manufacturing. We give you __full access to the source code,__ so you have complete control.
That means you're __never locked in__ and you can focus on building the things that makes your business unique.`}
    />
  );
}

type Slide = {
  img: string;
  description: string;
  link?: string;
  start: number;
  end: number;
};

function FeatureDescription({
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
        className="fixed left-10 bottom-[10dvh] md:left-10 md:top-5 flex flex-col  justify-center md:min-h-[100dvh] w-[calc(100%-5rem)] md:w-1/3 items-start px-6 font-medium text-lg text-muted-foreground text-balance "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.p>
    </Actor>
  );
}

const slides: Slide[] = [
  {
    img: "https://placehold.co/1280x800",
    description:
      "It starts with a delightful customer experience. We help you create a custom solution to feed requests to the system or use the API for instant quoting.",
    link: "/learn/delightful-experience",
    start: 0.1,
    end: 0.25,
  },
  {
    img: "https://placehold.co/1280x800",
    description:
      "Next, whatever you're making needs converted to a bill of materials and a routing. If you're not mass producing, our configurator will help you generate the perfect BoM and routing automatically.",
    link: "/learn/configuration-is-all-you-need",
    start: 0.25,
    end: 0.433,
  },
  {
    img: "https://placehold.co/1280x800",
    description:
      "With an accurate account of what needs made, everything falls into place. Purchasing, production, scheduling, inventory, receiving, and resource management all benefit from an integrated system of record.",
    start: 0.433,
    end: 0.617,
  },
  {
    img: "https://placehold.co/1280x800",
    description:
      "CarbonOS is built entirely with our self-documenting API. With access to the source code, our SDK, and our realtime API, you'll be able to build custom applications that drive your business.",

    start: 0.617,
    end: 0.8,
  },
  {
    img: "https://placehold.co/1280x800",
    description:
      "In addition to our core application, we provide an MES app and a starter kit for building your own applications. This will save you years of development time, and allow you to avoid the pitfalls of off-the-shelf systems.",
    start: 0.8,
    end: 0.95,
  },
];

function FeatureImages({ isMobile }: { isMobile: boolean }) {
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
                alt={slide.description}
                className="w-full h-auto rounded-lg invert"
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
              <p className="font-medium text-base text-muted-foreground text-balance">
                {slide.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Features({ isMobile }: { isMobile: boolean }) {
  return (
    <ScrollStage
      pages={isMobile ? 1 : 5.5}
      fallbackLength={100}
      fallbackFrame={25}
    >
      {!isMobile && (
        <div className="md:flex relative">
          <div className="sticky bottom-0 w-1/3 md:bottom-auto md:top-0 md:flex md:h-screen md:flex-1 md:items-center md:self-start">
            {slides.map((slide, index) => (
              <FeatureDescription
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
              </FeatureDescription>
            ))}
          </div>
        </div>
      )}

      <div className={isMobile ? "flex-1" : "ml-[50%] flex-1"}>
        <div className="w-full md:max-w-3xl px-3">
          <FeatureImages isMobile={isMobile} />
        </div>
      </div>
    </ScrollStage>
  );
}

function WhyNotOffTheShelf() {
  return (
    <TextRevealByWord
      text={`Off-the-shelf systems can __get you 80% of the way there.__ But the remaining 20%– everything that makes your business unique– becomes nearly impossible.
__If you don't control the full stack__, you're at the mercy of a vendor's roadmap and fluctuating pricing. In essence, __you're a renter, not an owner.__`}
    />
  );
}

function Team() {
  return (
    <div className="mx-auto w-screen max-w-6xl px-6 py-[40dvh] flex flex-col gap-8">
      {/* <h3 className="text-center text-3xl lg:text-4xl xl:text-5xl font-semibold leading-none tracking-tight text-foreground">
        We know manufacturing
      </h3> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-start gap-2">
          <img
            src="/faces/rob.webp"
            alt="Rob Carrington"
            className="w-full aspect-[3/4] rounded-lg object-cover mb-4 opacity-80"
          />
          <h3 className="text-xl lg:text-2xl font-semibold">Rob Carrington</h3>
          <p className="text-sm lg:text-base text-muted-foreground">
            CEO & Co-Founder
          </p>
          <div className="flex gap-2 mb-2">
            <SocialIcon
              type="linkedin"
              href="https://www.linkedin.com/in/robcarrington/"
            />
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">
            Rob was a principal engineer and product manager at Paperless Parts,
            where he led ERP integrations. He then started a manufacturing
            consulting company to help clients transform their manufacturing
            businesses with software. After talking to hundreds of manufacturers
            and using the available options, he realized he had to build
            CarbonOS.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <img
            src="/faces/brad.webp"
            alt="Brad Barbin"
            className="w-full aspect-[3/4] rounded-lg object-cover mb-4 opacity-80"
          />
          <h3 className="text-xl lg:text-2xl font-semibold">Brad Barbin</h3>
          <p className="text-sm lg:text-base text-muted-foreground">
            CTO & Co-Founder
          </p>
          <div className="flex gap-2 mb-2">
            <SocialIcon
              type="linkedin"
              href="https://www.linkedin.com/in/brad-barbin-399815292/"
            />
            <SocialIcon type="x" href="https://x.com/barbinbrad" />
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">
            Brad has built custom manufacturing systems for heavy equipment,
            nuclear reactors, and bio-pharmaceuticals. His 7 years of experience
            on shop floors drove him to build the missing piece of the
            manufacturing stack. Before manufacturing, he founded an NLP
            startup, built a successful social media app.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <img
            src="/faces/tom.webp"
            alt="Tom Smith"
            className="w-full aspect-[3/4] rounded-lg object-cover mb-4 opacity-80"
          />
          <h3 className="text-xl lg:text-2xl font-semibold">Tom Smith</h3>
          <p className="text-sm lg:text-base text-muted-foreground">
            Co-Founder
          </p>
          <div className="flex gap-2 mb-2">
            <SocialIcon
              type="linkedin"
              href="https://www.linkedin.com/in/smithy2425/"
            />
          </div>
          <p className="text-sm lg:text-base text-muted-foreground">
            Tom is a third-generation toolmaker and manufacturing engineer who
            brings a unique blend of manufacturing expertise and product
            management to CarbonOS. He has led software and operations teams at
            Arrival, CloudNC, Fictiv, and Saeki Robotics. He was motivated to
            build CarbonOS by the insight that no two manufacturers are
            identical.
          </p>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ type, href }: { type: "linkedin" | "x"; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-foreground"
    >
      <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
        {type === "linkedin" ? (
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
        ) : (
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        )}
      </svg>
    </a>
  );
}

function FAQs() {
  return (
    <section className="w-full h-screen py-32 ">
      <div className="mx-auto w-form-sm md:w-form-md lg:w-form-lg ">
        <h2 className="mb-8 text-center text-xl md:text-2xl lg:text-3xl font-bold text-muted-foreground">
          FAQs
        </h2>

        <div className="space-y-4 text-base md:text-lg lg:text-xl">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Is CarbonOS hosted on-prem or in the cloud?
              </AccordionTrigger>
              <AccordionContent>
                You can host it yourself on-prem or in the cloud, or we can host
                it for you in the cloud. If you want to host it yourself, we'll
                help you get setup.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is CarbonOS open source?</AccordionTrigger>
              <AccordionContent>
                CarbonOS's source code is available for purchase, but it is not
                "open source". This is different than the traditional SaaS
                model, which treats you as an renter of the interfaces, as
                opposed to an owner of the entire system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Do I need to be able to code?</AccordionTrigger>
              <AccordionContent>
                No, CarbonOS works great out of the box. However, having access
                to the source code means your development team can customize and
                extend it as needed. We can do customizations for you or you can
                just ask an LLM. We've found that LLMs are great at adding
                small-to-medium-sized features but aren't capable of designing
                full systems like an ERP (we keep trying).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                How can I get started with CarbonOS?
              </AccordionTrigger>
              <AccordionContent>
                You can try CarbonOS for free.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How much does CarbonOS cost?</AccordionTrigger>
              <AccordionContent>
                The least expensive in the short-term is to have us host it for
                you in the cloud. And the least expensive in the long-term is to
                buy the source code and host it yourself.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What is the tech stack?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-lg font-medium">
                    CarbonOS is a TypeScript monorepo built with the some of the
                    best open-source tools:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex flex-col items-center space-x-2 rounded-lg border p-3 text-sm bg-zinc-900">
                      <a href="https://remix.run">
                        <img
                          src="/logos/remix.svg"
                          alt="Remix"
                          className="w-full h-auto"
                        />
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 text-sm bg-zinc-900">
                      <a href="https://supabase.com">
                        <img
                          src="/logos/supabase.svg"
                          alt="Supabase"
                          className="w-full h-auto"
                        />
                      </a>
                    </div>
                    <div className=" rounded-lg border p-3 text-sm text-white bg-zinc-900">
                      <a
                        href="https://ui.shadcn.com"
                        className="inline-flex items-center space-x-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                          className="size-6"
                        >
                          <rect width="256" height="256" fill="none"></rect>
                          <line
                            x1="208"
                            y1="128"
                            x2="128"
                            y2="208"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="32"
                          ></line>
                          <line
                            x1="192"
                            y1="40"
                            x2="40"
                            y2="192"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="32"
                          ></line>
                        </svg>
                        <span className="font-bold text-xl">shadcn</span>
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 text-sm bg-zinc-900">
                      <a href="https://tailwindcss.com">
                        <img
                          src="/logos/tailwind.svg"
                          alt="Tailwind"
                          className="w-full h-auto"
                        />
                      </a>
                    </div>

                    <div className="flex items-center space-x-2 rounded-lg border p-3 text-sm bg-zinc-900">
                      <a href="https://trigger.dev">
                        <img
                          src="/logos/trigger.svg"
                          alt="Trigger.dev"
                          className="w-full h-auto"
                        />
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 text-sm bg-zinc-900">
                      <a href="https://novu.co">
                        <img
                          src="/logos/novu.svg"
                          alt="Novu"
                          className="w-full h-auto"
                        />
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 text-sm bg-zinc-900">
                      <a href="https://vercel.com">
                        <img
                          src="/logos/vercel.svg"
                          alt="Vercel"
                          className="w-full h-auto"
                        />
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-3 text-sm bg-zinc-900">
                      <a href="https://resend.com">
                        <img
                          src="/logos/resend.svg"
                          alt="Resend"
                          className="w-full h-auto"
                        />
                      </a>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    The languages we use are{" "}
                    <span className="font-medium text-foreground">
                      TypeScript
                    </span>{" "}
                    and <span className="font-medium text-foreground">SQL</span>
                    . We also use{" "}
                    <span className="font-medium text-foreground">React</span>{" "}
                    for interfaces. This stack makes it easy to build
                    customizations with LLMs.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
