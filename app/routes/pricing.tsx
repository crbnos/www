import { Link } from "@remix-run/react";
import { Check, LucideHandCoins, LucidePhone } from "lucide-react";
import { Button } from "~/components/ui/button";
import { GithubLogo } from "~/components/ui/github-logo";
import { cn } from "~/lib/utils";

const plans = [
  {
    name: "Starter",
    priceHeadline: "$30",
    priceSubtext: "/user/month",
    action: "Start 30-day free trial",
    url: "https://app.carbon.ms",
    description: "A managed cloud-hosted version of Carbon",
    featured: false,
    features: [
      "Automatic updates and backups",
      "Basic ERP, MES, and QMS functionality",
      "Unlimited records",
      "Self-onboarding",
      "Community support",
    ],
  },
  {
    name: "Business",
    description:
      "A managed cloud-hosted version of Carbon that includes support and all advanced features",
    priceHeadline: "$90",
    priceSubtext: "/user/month",
    action: "Start 30-day free trial",
    url: "https://app.carbon.ms",
    featured: true,
    features: [
      "5 user minimum",
      "Everything from Starter",
      "Implementation support",
      "Unlimited functional support",
      "API, webhooks, and integrations",
      "AI-powered workflows",
      "All advanced features available",
    ],
  },
  {
    name: "Enterprise",
    priceHeadline: "Contact us",
    priceSubtext: "",
    action: "Contact us",
    url: "/sales",
    description: "A custom solution to meet your needs",
    featured: false,
    features: [
      "Self-hosted or managed",
      "Full setup and migrations",
      "Custom integrations",
      "Custom development",
      "SSO/SAML",
      "Unlimited functional support",
      "Training",
    ],
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="mx-auto flex w-screen max-w-7xl px-6 flex-col gap-8 py-14 md:px-8 min-h-[calc(100dvh-100px)] justify-center items-center"
    >
      <div className="flex flex-col gap-4 mx-auto text-center">
        <div>
          <Button variant="outline" className="cursor-default">
            <LucideHandCoins />
            Pricing
          </Button>
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Simple pricing based on your needs
        </h2>
      </div>

      <div className="mx-auto grid w-full justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex w-full flex-col gap-8 rounded-lg bg-muted p-4 text-foreground overflow-hidden h-full",
              plan.featured
                ? "border-none bg-primary text-primary-foreground"
                : "border border-border"
            )}
          >
            <div className="flex-1 flex flex-col gap-8">
              <div className="flex items-center">
                <div className="ml-4">
                  <h2 className="text-xl font-bold tracking-tight leading-7">
                    {plan.name}
                  </h2>
                  <p className="h-12 text-sm leading-5 opacity-80">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="flex items-end justify-start gap-1 pl-4">
                <p className="text-3xl font-bold tracking-tight leading-7">
                  {plan.priceHeadline}
                </p>

                <p className="text-xs leading-5 opacity-80">
                  {plan.priceSubtext}
                </p>
              </div>

              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-zinc-200/0 via-zinc-500/30 to-zinc-200/0" />

              <ul className="flex flex-col gap-2 font-normal">
                {plan.features?.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-4 text-base font-normal leading-[110%]"
                  >
                    <Check className="size-5 shrink-0 p-[3px]" />
                    <span className="flex">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto w-full">
              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-zinc-200/0 via-zinc-500/30 to-zinc-200/0 mb-8" />
              <Button
                variant={plan.featured ? "secondary" : "default"}
                className="w-full"
                asChild
              >
                <Link to={plan.url}>{plan.action}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div
        className={
          "relative flex w-full flex-col gap-2 rounded-lg bg-muted p-9 text-foreground overflow-hidden h-full border justify-center items-center"
        }
      >
        <h2 className="text-3xl font-bold tracking-tight leading-7">
          Community
        </h2>
        <p className="text-base leading-5 opacity-80">
          Our open-source ERP, MES, and QMS, available for free
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <Button variant="default" size="xl" asChild>
            <a href="https://github.com/crbnos/carbon">
              Read the Docs
              <GithubLogo />
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
