import { Link } from "@remix-run/react";
import { Safari } from "components/magicui/safari";
import { AnimatePresence, motion } from "framer-motion";
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideCheckCircle,
  LucideChevronRight,
  LucidePhone,
  LucidePlay,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { DiscordLogo } from "~/components/ui/discord-logo";
import { cn } from "~/lib/utils";

export default function Route() {
  return (
    <>
      <Hero />
      <Features />
      <Manufacturing />
      <Reviews />
      <Memo />
      <CTA />
    </>
  );
}

const customers = [
  {
    name: "Black Cat Labs",
    logo: "/logos/black-cat-labs.png",
    url: "https://blackcatlabs.xyz",
  },
  {
    name: "Harp Engineering",
    logo: "/logos/harp.png",
    url: "https://www.headco.net/",
  },
  {
    name: "Northwest Production Source",
    logo: "/logos/northwest.png",
    url: "https://nwprosource.com",
  },
  {
    name: "Minimal",
    logo: "/logos/minimal.svg",
    url: "https://minimalx.com",
  },
];

const reviews = [
  {
    logo: "/logos/minimal.svg",
    face: "/faces/liam.jpeg",
    review:
      "As an engineering start-up pushing the boundaries in manufacturing assembly, we needed more than just another MRP/MES system. Carbon delivered - combining deep functionality with a refreshingly open, API-first design. It integrates seamlessly with our CAD tools, scales effortlessly, has fantastic UX and offers exceptional value.",
    author: "Liam Sill",
    authorTitle: "CTO, Minimal",
  },
  {
    logo: "/logos/black-cat-mark.png",
    face: "/faces/anthan.jpg",
    review:
      "We've been using Carbon for the last 6 months to grow our sheet metal and fabrication business, and I feel like it's a platform that will be able to grow with us over the next 10-15 years. If you're growing a job shop, I highly recommend it. The customer support is super responsive, the platform is easy to use, and the value far outweighs the cost.",
    author: "Anthan Rajaratnam",
    authorTitle: "CEO, Black Cat Labs, AS9100D",
  },
  {
    logo: "/logos/fabworks.svg",
    face: "/faces/jonathan.jpeg",
    review:
      "Beautiful piece of software. I think if this was around 2 years ago when we built fabworks.com I would have heavily considered building our custom ERP/quoting site as a thin layer on top of this. All these other ERPs like Fulcrum do not do a good job of letting you extend them, and I think with more and more shops looking to copy what we/SendCutSend/OSH do, they will be looking for solutions like this.",
    author: "Johnathan Sessa",
    authorTitle: "CEO, Fabworks",
  },
];

function Hero() {
  return (
    <section className="py-0">
      <div className="bg-[linear-gradient(to_bottom_right,#f7f5ff_35.67%,#c9fff8_88.95%)] dark:bg-[linear-gradient(to_bottom_right,#0e0338_35.67%,#1b433e_88.95%)] xl:rounded-xl max-w-[1380px] mx-auto py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-start items-center gap-8">
            <DiscordButton />
            <h2 className="font-display text-foreground text-balance mx-auto  max-w-3xl text-center font-medium tracking-tight leading-[115%] text-5xl sm:text-7xl lg:text-[5rem] xl:text-[6rem]">
              The open-source{" "}
              <span className="text-secondary">manufacturing ERP</span>
            </h2>
            <p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-[780px] text-center font-medium tracking-tighter text-base md:text-lg lg:text-xl">
              Carbon is a modern manufacturing platform that combines ERP, MES,
              and QMS into a single, unified, API-first system.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="xl" asChild>
                <a href="https://app.carbonos.dev">
                  Start Now
                  <LucidePlay />
                </a>
              </Button>
              <Button variant="ghost" size="xl" asChild>
                <Link to="/sales">
                  <LucidePhone />
                  Talk to Us
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-4 max-w-4xl mx-auto mt-8">
              <p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-3xl text-center font-medium tracking-tighter text-base">
                Trusted by builders worldwide
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {customers.map((customer) => (
                <a href={customer.url} target="_blank">
                  <img
                    src={customer.logo}
                    className="w-24 h-auto dark:invert"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mt-[-105px] pb-[140px]">
      <div className="flex gap-8 container max-w-[1380px] mx-auto px-4">
        <div className="flex flex-col gap-8 mt-[205px] flex-grow max-w-[1380px] mx-auto pl-8">
          <h3 className="text-muted-foreground uppercase text-sm leading-[140%] tracking-tighter">
            Features
          </h3>
          <h4 className="font-display text-foreground text-balance text-left font-medium tracking-tight leading-[115%] text-4xl lg:text-5xl xl:text-6xl -mt-4">
            Simplify complex manufacturing
          </h4>
          <p className="text-muted-foreground dark:text-foreground text-balance text-left font-medium tracking-tighter text-lg">
            Escape legacy software with a flexible, AI-powered platform designed
            for the speed and agility of today's manufacturing challenges.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex justify-start items-center gap-2">
              <LucideCheckCircle className="size-6 text-secondary" />
              <p className="text-foreground text-left font-bold tracking-tighter text-lg">
                Live Job Costing and Simplified Scheduling
              </p>
            </div>
            <div className="flex justify-start items-center gap-2">
              <LucideCheckCircle className="size-6 text-secondary" />
              <p className="text-foreground text-left font-bold tracking-tighter text-lg">
                Unified Quoting, Purchasing & Production
              </p>
            </div>
            <div className="flex justify-start items-center gap-2">
              <LucideCheckCircle className="size-6 text-secondary" />
              <p className="text-foreground text-left font-bold tracking-tighter text-lg">
                Automated Purchasing by Digital Workers
              </p>
            </div>
            <div className="flex justify-start items-center gap-2">
              <LucideCheckCircle className="size-6 text-secondary" />
              <p className="text-foreground text-left font-bold tracking-tighter text-lg">
                End-to-end traceability and compliance
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" size="xl" asChild>
              <a href="https://app.carbonos.dev">
                Start Now
                <LucidePlay />
              </a>
            </Button>

            <Button variant="outline" size="xl" asChild>
              <Link to="/sales">
                <LucidePhone />
                Talk to Us
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden lg:flex mt-[225px] pr-8 hover:scale-110 transition-all duration-300">
          <Safari
            url="https://app.carbonos.dev"
            className="size-full dark:hidden"
            imageSrc="/screenshots/sales-orders-light.jpeg"
          />
          <Safari
            url="https://app.carbonos.dev"
            className="size-full hidden dark:block"
            imageSrc="/screenshots/sales-orders-dark.jpeg"
          />
        </div>
      </div>
    </section>
  );
}

function Manufacturing() {
  return (
    <section className="xl:pb-24">
      <div className="mx-auto px-4 bg-muted rounded-xl max-w-[1380px] w-full py-24">
        <div className="container">
          <div className="flex flex-col gap-8">
            <h2 className="font-display text-balance mx-auto max-w-2xl text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Drive growth and efficiency
            </h2>

            <p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-base">
              Leave the spreadsheets and outdated software behind. Carbon gives
              you the control and clarity you need to run a better business.
            </p>
          </div>
          <div className="flex flex-col gap-8 mt-14 mb-12">
            <div className="flex flex-col">
              <div className="grid lg:grid-cols-2 grid-cols-1 border border-b-0">
                <div className="flex flex-col border-r border-border bg-background lg:border-b-0 border-b justify-center manufacturing-bg">
                  <div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
                    <div className="flex flex-col gap-4">
                      <h4 className="text-foreground text-balance text-left font-semibold tracking-tighter text-2xl">
                        End-to-End Traceability
                      </h4>
                      <p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-base">
                        Achieve granular, end-to-end tracking of materials,
                        components, and processes, ensuring compliance,
                        simplifying audits, and enabling rapid root cause
                        analysis without the complexity and cost of traditional
                        high-end systems.
                      </p>
                    </div>
                    <div>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </div>
                <div className="flex bg-background manufacturing-bg">
                  {/* <div className="flex justify-center items-center mt-10 mb-[70px] pt-10 pb-[22px]"></div> */}
                  <div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
                    <div className="flex flex-col gap-4">
                      <h4 className="text-foreground text-balance text-left font-semibold tracking-tighter text-2xl">
                        Integrated Agents
                      </h4>
                      <p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-base">
                        Our ever-expanding catalog of agents allow you to save
                        time and money by automating repetitive tasks. For
                        example, our purchasing agent can create purchase orders
                        and get quotes from suppliers automatically.
                      </p>
                    </div>
                    <div>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid lg:grid-cols-3 grid-cols-1 bg-background border">
                <div className="flex border-r border-border lg:border-b-0 border-b manufacturing-bg">
                  {/* <div className="flex justify-center items-center mt-10 mb-[70px] pt-10 pb-[22px]"></div> */}
                  <div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
                    <div className="flex flex-col gap-4">
                      <h4 className="text-foreground text-balance text-left font-semibold tracking-tighter text-2xl">
                        Custom Fields
                      </h4>
                      <p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-base">
                        Add custom fields with a few clicks to any table to
                        track additional information. Then create custom views
                        to track the data you need. Then use the configurator to
                        generate Bill of Materials.
                      </p>
                    </div>
                    <div>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </div>
                <div className="flex border-r border-border lg:border-b-0 border-b manufacturing-bg">
                  {/* <div className="flex justify-center items-center mt-10 mb-[70px] pt-10 pb-[22px]"></div> */}
                  <div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
                    <div className="flex flex-col gap-4">
                      <h4 className="text-foreground text-balance text-left font-semibold tracking-tighter text-2xl">
                        Simplified Scheduling
                      </h4>
                      <p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-base">
                        Optimize your shop floor schedule with flexible sorting
                        capabilities, maximizing throughput, improving on-time
                        delivery, and easily adapting to priority changes.
                      </p>
                    </div>
                    <div>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </div>
                <div className="flex lg:border-b-0 border-b manufacturing-bg">
                  {/* <div className="flex justify-center items-center mt-10 mb-[70px] pt-10 pb-[22px]"></div> */}
                  <div className="flex flex-col gap-4 pl-10 py-10 pr-20 h-full justify-between">
                    <div className="flex flex-col gap-4">
                      <h4 className="text-foreground text-balance text-left font-semibold tracking-tighter text-2xl">
                        API-First Architecture
                      </h4>
                      <p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-base">
                        Carbon is built with an "API-First Architecture," which
                        gives you unparalleled flexibility to seamlessly connect
                        Carbon with your other business systems. This allows you
                        to automate workflows across all applications.
                      </p>
                    </div>
                    <div>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex container items-center justify-center gap-4">
          <Button variant="secondary" size="xl" asChild>
            <a href="https://app.carbonos.dev">
              Start Now
              <LucidePlay />
            </a>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link to="/sales">
              <LucidePhone />
              Talk to Us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [currentReview, setCurrentReview] = useState(0);

  const onPrev = () => {
    setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const onNext = () => {
    setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-secondary text-secondary-foreground bg-[url('/reviews.webp')] bg-[0_0] bg-no-repeat bg-cover py-20">
      <div className="container flex flex-col gap-12 mx-auto px-4">
        <h2 className="font-display text-balance mx-auto max-w-4xl text-center font-medium tracking-tight leading-[115%] text-5xl lg:text-7xl">
          Builders ❤️ Carbon
        </h2>
        <div className="max-w-5xl mx-auto overflow-hidden p-4">
          <div className="flex flex-row items-center justify-center gap-4">
            <button
              onClick={onPrev}
              className="hidden lg:flex items-center justify-center bg-background/90 hover:bg-background text-foreground text-3xl font-bold size-12 rounded-xl px-3"
            >
              <LucideArrowLeft />
            </button>
            <div className="flex flex-grow dark:bg-background/90 bg-background text-foreground rounded-xl w-full h-full min-h-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReview}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col flex-grow gap-12 justify-between h-full items-center p-12 w-full"
                >
                  <p className="text-balance text-left flex-grow font-medium tracking-tight text-xl md:text-2xl">
                    {reviews[currentReview].review}
                  </p>
                  <div className="flex justify-start w-full">
                    <div className="flex items-center gap-2">
                      <img
                        src={reviews[currentReview].face}
                        alt="Avatar"
                        className="size-16 rounded-full"
                      />
                      <div className="flex flex-col">
                        <p className="text-xl font-bold">
                          {reviews[currentReview].author}
                        </p>
                        <p className="text-base text-muted-foreground font-medium">
                          {reviews[currentReview].authorTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              onClick={onNext}
              className="hidden lg:flex items-center justify-center bg-background/90 hover:bg-background text-foreground text-3xl font-bold size-12 rounded-xl px-3"
            >
              <LucideArrowRight />
            </button>
          </div>
        </div>
        <div className="flex flex-col max-w-[864px] mx-auto w-full">
          <div className="w-full flex justify-center items-center gap-8 lg:hidden">
            <button
              onClick={onPrev}
              className="flex items-center justify-center bg-background/90 hover:bg-background text-foreground text-3xl font-bold size-12 rounded-xl px-3"
            >
              <LucideArrowLeft />
            </button>
            <button
              onClick={onNext}
              className="flex items-center justify-center bg-background/90 hover:bg-background text-foreground text-3xl font-bold size-12 rounded-xl px-3"
            >
              <LucideArrowRight />
            </button>
          </div>
          <div className="hidden lg:flex w-full items-center justify-center">
            {reviews.map((image, index) => (
              <div
                key={image.logo}
                role="button"
                onClick={() => setCurrentReview(index)}
                className={cn(
                  "cursor-pointer flex-1 flex items-center justify-center pb-8 border-b border-secondary-foreground opacity-50 transition-opacity duration-200",
                  index === currentReview && "opacity-100"
                )}
              >
                <img
                  className="h-6 w-auto invert dark:invert-0"
                  src={image.logo}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Memo() {
  return (
    <section className="md:py-8 lg:pt-36 lg:pb-24 md:px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-4 rounded-lg border-[0.5px] bg-card px-8 shadow py-12 lg:px-12 lg:py-12">
        <div className="mb-4 flex flex-col gap-1.5 md:mb-6 lg:mb-8 tracking-tight">
          <p className="dark:text-muted-foreground font-mono uppercase text-xs font-light">
            Founder memo
          </p>
          <p className="font-semibold tracking-tight">
            Carbon Manufacturing Systems Corp.
          </p>
        </div>

        <p className="leading-[1.8] text-foreground">
          We built Carbon after nearly a decade of building end-to-end
          manufacturing systems with off-the-shelf software. Over the years, we
          noticed a few things:
        </p>

        <ul className="ml-4 list-disc">
          <li className="pl-2 leading-[1.8] text-foreground">
            There is no "perfect ERP" because each company is unique
          </li>
          <li className="pl-2 leading-[1.8] text-foreground">
            People need to be able to extend the platform to fit their needs
          </li>
          <li className="pl-2 leading-[1.8] text-foreground">
            Great systems are built on open-source foundations
          </li>
        </ul>

        <p className="leading-[1.8] text-foreground">
          As technical people move back to manufacturing, we believe Carbon will
          be the perfect foundation for tech-native manufacturers. We're
          throwing out all the bullsh*t, and building the system we would have
          wanted.
        </p>
        <p className="leading-[1.8] text-foreground">
          And ERP is just the beginning. Our goal is to build the
          community-powered orchestration layer for automated manufacturing. So
          if you're ready for a better way to build, we'd love for you to join
          us.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <a
            target="_blank"
            className="mt-4 flex items-center gap-4 md:mt-6 lg:mt-8"
            href="https://x.com/barbinbrad"
          >
            <img
              alt="Brad Barbin"
              loading="lazy"
              className="size-14 rounded-lg"
              src="https://avatars.githubusercontent.com/u/64510427?v=4"
            />
            <div className="flex flex-col">
              <p className="dark:text-tertiary text-foreground">Brad Barbin</p>
              <p className="dark:text-tertiary text-foreground">
                Co-founder &amp; CEO 🇺🇸
              </p>
            </div>
          </a>
          <DiscordButton />
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex flex-col gap-4 bg-muted dark:bg-muted bg-[url('/cta.webp')] dark:bg-none bg-[0_0] bg-no-repeat bg-cover rounded-xl py-24 justify-center items-center">
          <h2 className="font-display text-balance mx-auto max-w-2xl text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl ">
            Build something with Carbon
          </h2>
          <p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-lg">
            Start your 30-day free trial today
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="default" size="xl" asChild>
              <a href="https://app.carbonos.dev">
                Start Now
                <LucidePlay />
              </a>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/sales">
                <LucidePhone />
                Talk to Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiscordButton() {
  return (
    <div>
      <Button variant="outline" asChild>
        <a href="https://discord.gg/yGUJWhNqzy" target="_blank">
          <DiscordLogo className="text-[#5865f2]" />
          Join our Discord community{" "}
          <LucideChevronRight className="text-muted-foreground size-3" />
        </a>
      </Button>
    </div>
  );
}
