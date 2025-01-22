import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { CTA } from "~/components/cta";

import {
  Gantt,
  GanttContainer,
  GanttHeader,
  Resource,
} from "~/components/gantt";
import { Header, Hero } from "~/components/hero";
import { SocialIcon } from "~/components/social-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
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
      <BuyVsBuildIntro />
      <GanttComparison />
      <Team />
      <FAQs />
      <CTA />
    </>
  );
}

function WhatIsCarbonOS() {
  return (
    <TextRevealByWord
      text={`CarbonOS is an API-first operating system for manufacturing – an extensible foundation for digital manufacturers building end-to-end, fully integrated software stacks. 
Unlike  legacy systems, we give you __full access to the source code,__ so you have complete control of your technology. That means you’re __never locked in__ and you can focus on building the things that make your business unique.`}
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

function OurApproach() {
  return (
    <Actor start={0.02} end={0.99}>
      <div className="fixed left-10 top-[10dvh] px-6">
        <motion.h2
          className="text-base font-medium tracking-tight text-muted-foreground font-mono uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          / Our Approach
        </motion.h2>
      </div>
    </Actor>
  );
}

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
    img: "/screenshots/features-customer-experience.webp",
    description: (
      <>
        <strong className="font-semibold text-foreground">
          Craft a delightful customer experience.
        </strong>{" "}
        CarbonOS makes it easy to build customer-facing apps that securely
        interface with your business and production data.
      </>
    ),
    link: "/learn/delightful-experience",
    start: 0.1,
    end: 0.22,
  },
  {
    img: "/screenshots/features-configurator.webp",
    description: (
      <>
        <strong className="font-semibold text-foreground">
          Automatically configure
        </strong>{" "}
        the bill of materials and router based on your customers’ requests to
        drive instant quoting and efficient production planning
      </>
    ),
    link: "/learn/configuration-is-all-you-need",
    start: 0.25,
    end: 0.41,
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
    start: 0.433,
    end: 0.6,
  },
  {
    img: "/screenshots/features-mes.webp",
    description: (
      <>
        <strong className="font-semibold text-foreground">
          Connect your machines
        </strong>{" "}
        to your core system of record, and use our MES app to drive real-time
        production insights.
      </>
    ),
    link: "/learn/bridging-the-automation-gap",
    start: 0.617,
    end: 0.76,
  },
  {
    img: "/screenshots/features-api.webp",
    description: (
      <>
        <strong className="font-semibold text-foreground">
          Build custom applications
        </strong>{" "}
        that drive your business on top of our source code, our SDK, and our
        self-documenting API.
      </>
    ),
    link: "/learn/build-custom-applications",
    start: 0.78,
    end: 0.98,
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
      pages={isMobile ? 1 : 5.5}
      fallbackLength={100}
      fallbackFrame={25}
    >
      {!isMobile && (
        <div className="md:flex relative">
          <OurApproach />
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
        {isMobile && (
          <p className="text-foreground text-3xl font-bold tracking-tight text-center w-full mb-8">
            Our Approach
          </p>
        )}
        <div className="w-full md:max-w-3xl px-3">
          <BenefitImages isMobile={isMobile} />
        </div>
      </div>
    </ScrollStage>
  );
}

function BuyVsBuildIntro() {
  return (
    <TextRevealByWord
      text={`Off-the-shelf systems can __get you 80% of the way there today.__ But the things that make your business unique become impossible.
__If you don't control the full stack,__ you're at the mercy of the vendor. In essence, __you're a renter, not an owner.__
Building on CarbonOS __reduces development time from years to months__ and allows you to grow on a strong foundation.`}
    />
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
          <div className="absolute bottom-0 w-full pb-4 text-center text-sm text-muted-foreground md:text-base">
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

function Team() {
  return (
    <div className="mx-auto w-screen max-w-6xl px-6 py-[30dvh] flex flex-col gap-8">
      <div className="mx-auto text-center">
        {/* <h4 className="text-xl font-bold tracking-tight text-muted-foreground/80">
          Team
        </h4>
        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          We know manufacturing
        </h2> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-start gap-2">
          <img
            src="/faces/rob.webp"
            alt="Rob Carrington"
            className="w-full aspect-[3/4] rounded-lg object-cover mb-4 opacity-80"
          />
          <h3 className="text-xl lg:text-2xl font-bold tracking-tight">
            Rob Carrington
          </h3>
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
            where he led ERP integrations and architected custom software
            systems for leading digital manufacturers. Prior to that, he
            researched high-performance computing systems at MIT Lincoln
            Laboratory, built data infrastructure for a financial consulting
            firm, and wrote zero-to-one code at an early stage consumer device
            startup.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <img
            src="/faces/brad.webp"
            alt="Brad Barbin"
            className="w-full aspect-[3/4] rounded-lg object-cover mb-4 opacity-80"
          />
          <h3 className="text-xl lg:text-2xl font-bold tracking-tight">
            Brad Barbin
          </h3>
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
            startup, built a successful social media app. He worked as a
            principal engineer at Teamworks while building CarbonOS at night.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <img
            src="/faces/tom.webp"
            alt="Tom Smith"
            className="w-full aspect-[3/4] rounded-lg object-cover mb-4 opacity-80"
          />
          <h3 className="text-xl lg:text-2xl font-bold tracking-tight">
            Tom Smith
          </h3>
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
            Tom is a third-generation toolmaker and manufacturing engineer with
            18 years of industry expertise and a passion for innovation. He has
            led operations and software teams at GE, Arrival, CloudNC, Fictiv,
            and Saeki. Driven by the experience that no two manufacturers are
            alike, he founded CarbonOS to create tailored solutions for the
            industry that can generate growth.
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQs() {
  return (
    <section className="w-full min-h-[80dvh] py-32 ">
      <div className="mx-auto md:w-form-md lg:w-form-lg px-6">
        <h2 className="mb-8 text-center text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 text-base md:text-lg lg:text-xl">
          <Accordion type="multiple" defaultValue={["item-6"]}>
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
                opposed to an owner of the entire system. Here is the{" "}
                <Link className="text-foreground font-semibold" to="/license">
                  License
                </Link>
                .
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
                You can try CarbonOS for free&mdash;reach out to learn more.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What is the tech stack?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
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

                  <p className="text-muted-foreground">
                    There are API clients available in TypesScript, Dart, Swift,
                    Python, C#, Go, Kotlin, Ruby and Elixir for our functional
                    friends.
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
