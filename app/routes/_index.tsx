import { AnimatePresence, motion } from "framer-motion";
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideBookOpen,
  LucideCheckCircle,
  LucideChevronRight,
  LucidePlay,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useIsMobile } from "~/hooks/useIsMobile";
import { cn } from "~/lib/utils";

export default function Route() {
  const isMobile = useIsMobile();
  return (
    <>
      <Hero />
      <Features />
      <Manufacturing />
      <Reviews />
      <Quality />
      <CTA />
    </>
  );
}

const reviews = [
  {
    light: "66f2484c3bc5dc31462dfeed_Sponsor%20Image%2001.svg",
    dark: "6722099eb6b0484ea2a3b94a_Group%20284.svg",
    review:
      "Connecting my bank accounts was a breeze, allowing me to see all my financial data in a single view. The budgeting tools are solid, and the real-time updates help me monitor my expenses with ease. The support team is exceptional—prompt and extremely helpful. I can’t imagine managing my finances without it now",
    author: "John Doe",
    authorTitle: "CEO, Company",
  },
  {
    light: "66f2484c6b8fac1b7be52a7e_Sponsor%20Image%2002.svg",
    dark: "6722099fa63e6899c0672211_relax.co.svg",
    review:
      "Connecting my bank accounts was a breeze, allowing me to see all my financial data in a single view. The budgeting tools are solid, and the real-time updates help me monitor my expenses with ease. The support team is exceptional—prompt and extremely helpful. I can’t imagine managing my finances without it now",
    author: "John Doe",
    authorTitle: "CEO, Company",
  },
  {
    light: "66f2484ca36d00d0a86f6245_Sponsor%20Image%2003.svg",
    dark: "672209af4f48678fa4f439f6_Group%20280.svg",
    review:
      "Connecting my bank accounts was a breeze, allowing me to see all my financial data in a single view. The budgeting tools are solid, and the real-time updates help me monitor my expenses with ease. The support team is exceptional—prompt and extremely helpful. I can’t imagine managing my finances without it now",
    author: "John Doe",
    authorTitle: "CEO, Company",
  },
  {
    light: "66f2484c82c6e20bbc6c80df_Sponsor%20Image%2006.svg",
    dark: "6722099ffc6cc308200f7947_Group%20278.svg",
    review:
      "Connecting my bank accounts was a breeze, allowing me to see all my financial data in a single view. The budgeting tools are solid, and the real-time updates help me monitor my expenses with ease. The support team is exceptional—prompt and extremely helpful. I can’t imagine managing my finances without it now",
    author: "John Doe",
    authorTitle: "CEO, Company",
  },
];

function Hero() {
  return (
    <section className="py-0">
      <div className="bg-[linear-gradient(#f7f5ff_35.67%,#c9fff8_88.95%)] dark:bg-[linear-gradient(to_bottom_right,#0e0338_35.67%,#1b433e_88.95%)] xl:rounded-xl max-w-[1380px] mx-auto pt-20 pb-[204px]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-start items-center gap-8">
            <Button variant="outline">
              <DiscordLogo />
              Join our Discord community{" "}
              <LucideChevronRight className="text-muted-foreground size-3" />
            </Button>
            <h2 className="text-foreground text-balance mx-auto  max-w-7xl text-center font-medium tracking-tighter leading-[115%] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.5rem]">
              Simplify complex manufacturing with{" "}
              <span className="text-secondary">intelligent automation</span>
            </h2>
            <p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-4xl text-center font-medium tracking-tighter text-base">
              Carbon is an open manufacturing platform that combines ERP, MES,
              and QMS into a single, unified, API-first system.
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="xl">
                Start Now
                <LucidePlay />
              </Button>
              <Button variant="ghost" size="xl">
                <LucideBookOpen />
                Book a Demo
              </Button>
            </div>

            <div className="flex flex-col gap-4 max-w-4xl mx-auto mt-8">
              <p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-3xl text-center font-medium tracking-tighter text-base">
                Trusted by builders worldwide
              </p>
            </div>

            <div className="flex flex-col md:flex-row dark:hidden items-center justify-center gap-8">
              {reviews.map((review) => (
                <img
                  src={`https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/${review.light}`}
                />
              ))}
            </div>

            <div className="hidden dark:flex flex-col md:flex-row items-center justify-center gap-8">
              {reviews.map((review) => (
                <img
                  src={`https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/${review.dark}`}
                />
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
      <div className="flex gap-8 container max-w-5xl mx-auto px-4">
        <div className="flex flex-col gap-8 mt-[205px] flex-grow max-w-4xl mx-auto pl-8 lg:pl-0">
          <h3 className="text-muted-foreground uppercase text-sm leading-[140%] tracking-tighter">
            Features
          </h3>
          <h4 className="text-foreground text-balance text-left font-medium tracking-tighter leading-[115%] text-4xl lg:text-5xl xl:text-6xl -mt-4">
            The modern ERP and MES alternative
          </h4>
          <p className="text-muted-foreground dark:text-foreground text-balance text-left font-medium tracking-tighter text-lg">
            Escape legacy software with a flexible, AI-powered platform designed
            for the speed and agility of today's manufacturing challenges.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex justify-start items-center gap-2">
              <LucideCheckCircle className="size-6 text-secondary" />
              <p className="text-foreground text-left font-bold tracking-tighter text-lg">
                Live Job Costing and Advanced Scheduling
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
            <Button variant="secondary" size="xl">
              Start Now
              <LucidePlay />
            </Button>

            <Button variant="outline" size="xl">
              <LucideBookOpen />
              Book a Demo
            </Button>
          </div>
        </div>
        <div className="max-w-[416px] hidden lg:flex">
          <img
            className="feature-v2-image"
            src="https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/672203cd9790abdc56c3477b_iPhone-top.png"
            alt="Feature Image"
            srcSet="https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/672203cd9790abdc56c3477b_iPhone-top-p-500.png 500w, https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/672203cd9790abdc56c3477b_iPhone-top-p-800.png 800w, https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/672203cd9790abdc56c3477b_iPhone-top-p-1080.png 1080w, https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/672203cd9790abdc56c3477b_iPhone-top.png 1664w"
          />
        </div>
      </div>
    </section>
  );
}

function Manufacturing() {
  return (
    <section className="pb-24">
      <div className="mx-auto px-4 bg-muted rounded-xl max-w-[1380px] w-full py-24">
        <div className="container">
          <div className="flex flex-col gap-8">
            <h2 className="text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter leading-[115%] text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              Drive growth and efficiency with Carbon
            </h2>

            <p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-base">
              Leave the spreadsheets and outdated software behind. The Carbon
              platform gives you the control and clarity you need to run a
              better business.
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
          <Button variant="secondary" size="xl">
            Start Now
            <LucidePlay />
          </Button>
          <Button variant="outline" size="xl">
            <LucideBookOpen />
            Book a Demo
          </Button>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const [currentReview, setCurrentReview] = useState(2);

  const onPrev = () => {
    setCurrentReview((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const onNext = () => {
    setCurrentReview((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-secondary text-secondary-foreground bg-[url('/reviews.webp')] bg-[0_0] bg-no-repeat bg-cover py-20">
      <div className="container flex flex-col gap-12 mx-auto px-4">
        <h2 className="text-balance mx-auto max-w-4xl text-center font-medium tracking-tighter leading-[115%] text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          Reviews from our customers
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
                  className="flex flex-col gap-12 justify-start items-center p-12 w-full"
                >
                  <p className="text-balance text-left font-medium tracking-tighter text-xl md:text-2xl">
                    {reviews[currentReview].review}
                  </p>
                  <div className="flex justify-start w-full">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/670e25752ad7e046f4fadaaf_image-2.jpg`}
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
          <div className="hidden lg:flex dark:hidden w-full items-center justify-center">
            {reviews.map((image, index) => (
              <div
                key={image.dark}
                role="button"
                onClick={() => setCurrentReview(index)}
                className={cn(
                  "cursor-pointer flex-1 flex items-center justify-center pb-8 border-b border-secondary-foreground opacity-50 transition-opacity duration-200",
                  index === currentReview && "opacity-100"
                )}
              >
                <img
                  className="h-6 w-auto"
                  src={`https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/${image.dark}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="hidden lg:dark:flex w-full items-center justify-center">
            {reviews.map((image, index) => (
              <div
                key={image.light}
                role="button"
                onClick={() => setCurrentReview(index)}
                className={cn(
                  "cursor-pointer flex-1 flex items-center justify-center pb-8 border-b border-secondary-foreground opacity-50 hover:opacity-80 transition-opacity duration-200",
                  index === currentReview && "opacity-100"
                )}
              >
                <img
                  className="h-6 w-auto"
                  src={`https://cdn.prod.website-files.com/66da014bfb6cdbedcafef616/${image.light}`}
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

function Quality() {
  return (
    <section className="py-36">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter leading-[115%] text-3xl md:text-4xl lg:text-5xl pt-20">
            ISO 9001 and AS9100{" "}
            <span className="text-muted-foreground">compliance</span>
          </h2>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 bg-muted dark:bg-muted bg-[url('/cta.webp')] dark:bg-none bg-[0_0] bg-no-repeat bg-cover rounded-xl py-24 justify-center items-center">
          <h2 className="text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter leading-[115%] text-3xl md:text-4xl lg:text-5xl ">
            The only platform that unifies your entire business
          </h2>
          <p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-base">
            From the front office to the shop floor, to custom applications,
            Carbon provides a single, extensible source of truth.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="default" size="xl">
              Start Now
              <LucidePlay />
            </Button>
            <Button variant="outline" size="xl">
              <LucideBookOpen />
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiscordLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12">
      <path
        d="M 12.708 0.993 C 11.74 0.538 10.719 0.214 9.669 0.028 C 9.649 0.024 9.629 0.034 9.62 0.052 C 9.481 0.31 9.354 0.576 9.241 0.848 C 8.094 0.672 6.952 0.672 5.828 0.848 C 5.726 0.597 5.575 0.291 5.443 0.052 C 5.433 0.034 5.414 0.025 5.394 0.028 C 4.344 0.213 3.323 0.538 2.355 0.993 C 2.346 0.997 2.339 1.003 2.335 1.011 C 0.399 3.973 -0.132 6.862 0.128 9.715 C 0.13 9.729 0.137 9.742 0.148 9.751 C 1.425 10.711 2.662 11.294 3.877 11.681 C 3.896 11.687 3.917 11.68 3.929 11.663 C 4.217 11.262 4.472 10.837 4.692 10.393 C 4.698 10.38 4.699 10.366 4.694 10.353 C 4.689 10.34 4.679 10.33 4.666 10.325 C 4.264 10.168 3.874 9.978 3.501 9.757 C 3.487 9.748 3.479 9.734 3.478 9.717 C 3.477 9.701 3.484 9.685 3.496 9.675 C 3.575 9.615 3.652 9.553 3.728 9.49 C 3.741 9.478 3.76 9.476 3.776 9.483 C 6.22 10.626 8.866 10.626 11.281 9.483 C 11.297 9.475 11.316 9.478 11.33 9.489 C 11.405 9.552 11.483 9.615 11.562 9.675 C 11.575 9.685 11.582 9.701 11.581 9.717 C 11.58 9.734 11.571 9.748 11.558 9.757 C 11.185 9.979 10.796 10.169 10.392 10.325 C 10.38 10.33 10.37 10.34 10.365 10.353 C 10.36 10.366 10.361 10.38 10.367 10.393 C 10.59 10.834 10.845 11.259 11.129 11.663 C 11.141 11.68 11.162 11.687 11.181 11.681 C 12.402 11.294 13.639 10.711 14.916 9.751 C 14.927 9.742 14.934 9.729 14.936 9.715 C 15.247 6.417 14.414 3.552 12.728 1.011 C 12.724 1.003 12.717 0.997 12.708 0.993 Z M 5.057 7.978 C 4.321 7.978 3.715 7.286 3.715 6.436 C 3.715 5.587 4.309 4.895 5.057 4.895 C 5.81 4.895 6.411 5.593 6.399 6.436 C 6.399 7.286 5.804 7.978 5.057 7.978 Z M 10.019 7.978 C 9.283 7.978 8.677 7.286 8.677 6.436 C 8.677 5.587 9.271 4.895 10.019 4.895 C 10.772 4.895 11.373 5.593 11.361 6.436 C 11.361 7.286 10.772 7.978 10.019 7.978 Z"
        fill="rgb(88,101,242)"
      ></path>
    </svg>
  );
}
