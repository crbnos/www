import { Link } from "@remix-run/react";
import { Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { steps, useWizard } from "~/components/wizard-form";
import { cn } from "~/lib/utils";

const plans = [
  {
    name: "Starter",
    description:
      "Rent the software on a monthly basis until you're ready to buy",
    features: [
      "Core ERP/MES/API functionality",
      "Managed hosting",
      "Dedicated support",
    ],
    featured: false,
    licensed: false,
    answers: {
      ownership: "rent",
      hosting: "managed-hosting",
      tenancy: "multi-tenant",
      support: "dedicated",
      customDev: "none",
    },
  },
  {
    name: "Foundation",
    description:
      "Buy the source code and build your custom solution. We'll help you get started.",
    features: [
      "Full access to source code",
      "Self-hosted",
      "Developer onboarding",
    ],
    featured: true,
    licensed: true,
    answers: {
      ownership: "buy",
      hosting: "self-hosted",
      tenancy: "single-tenant",
      support: "dedicated",
      customDev: "none",
    },
  },
  {
    name: "Full-Service",
    description:
      "We'll build customized applications on top of CarbonOS for you",
    features: [
      "Custom application development",
      "Core ERP/MES/API functionality",
      "Feature prioritization",
    ],
    featured: false,
    licensed: false,
    answers: {
      ownership: "rent",
      hosting: "managed-hosting",
      tenancy: "multi-tenant",
      support: "priority",
      customDev: "portal",
    },
  },
];

export default function Ownership() {
  const { answers, setShowWizard, setAnswers, setCurrentStep } = useWizard();

  return (
    <section
      id="pricing"
      className="mx-auto flex w-screen max-w-6xl px-6 flex-col gap-8 py-14 md:px-8 min-h-[100dvh] justify-center items-center"
    >
      <div className="mx-auto text-center">
        <h4 className="text-xl font-bold tracking-tight text-muted-foreground/80">
          Ownership Plans
        </h4>
        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          A plan for every business
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-6 text-muted-foreground mb-8">
          Every business is unique, and so are their software needs. With
          CarbonOS, you can choose whichever ownership model works best for you
          to create your customized end-to-end software solution.
        </p>
      </div>

      <div className="mx-auto grid w-full justify-center grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex max-w-[400px] flex-col gap-8 rounded-lg bg-muted p-4 text-foreground overflow-hidden",
              plan.featured
                ? "border-4 border-emerald-400 -mt-4"
                : "border border-border"
            )}
          >
            <div className="flex items-center">
              <div className="ml-4">
                <h2 className="text-xl font-bold tracking-tight leading-7">
                  {plan.name}
                </h2>
                <p className="h-12 text-sm leading-5 text-muted-foreground">
                  {plan.description}
                </p>
              </div>
            </div>

            <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-zinc-200/0 via-zinc-500/30 to-zinc-200/0" />

            <ul className="flex flex-col gap-2 font-normal">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-base font-medium text-foreground"
                >
                  <Check className="size-5 shrink-0 rounded-full bg-emerald-400 p-[3px] text-foreground" />
                  <span className="flex">{feature}</span>
                </li>
              ))}
            </ul>

            <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-zinc-200/0 via-zinc-500/30 to-zinc-200/0" />

            <Button
              onClick={() => {
                setShowWizard(true);
                setAnswers({ ...answers, ...plan.answers });
                setCurrentStep(steps.length - 1);
              }}
            >
              Get Started
            </Button>

            {plan.licensed && (
              <Link to="/license">
                <p className="w-full text-center text-xs text-muted-foreground underline -mt-4">
                  View License
                </p>
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
