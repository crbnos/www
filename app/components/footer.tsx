import { Link } from "@remix-run/react";
import { SocialIcon } from "./social-icon";

export function Footer() {
  return (
    <>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-background via-zinc-200 dark:via-zinc-800 to-background " />
      <div className="flex w-full justify-center py-12 md:py-16 lg:py-20 2xl:py-24 dark:border-transparent">
        <div className="mx-auto w-full container flex-col px-4 md:px-6 lg:px-8 grid grid-cols-1 gap-12 sm:grid-cols-5 sm:gap-6">
          <div className="flex flex-col gap-6 sm:col-span-2">
            <Link
              to="/"
              className="cursor-pointer flex flex-row items-end gap-2 flex-shrink-0 font-display"
            >
              <img
                src="/brand/carbon-word-light.svg"
                alt="Carbon"
                className="h-7 w-auto block dark:hidden"
              />
              <img
                src="/brand/carbon-word-dark.svg"
                alt="Carbon"
                className="h-7 w-auto block hidden dark:block"
              />
            </Link>

            <div className="flex items-center gap-4">
              <SocialIcon type="x" href="https://x.com/therealcarbonos" />
              <SocialIcon
                type="linkedin"
                href="https://www.linkedin.com/company/carbonos"
              />
              <SocialIcon type="github" href="https://github.com/crbnos" />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-1">
            <p className="font-medium py-1 col-span-1 text-sm text-muted-foreground">
              Company
            </p>
            <div className="col-span-2 -mx-1 flex flex-wrap gap-2 sm:flex-col">
              {[
                { href: "/brand", text: "Brand Assets" },
                { href: "/learn", text: "Blog" },
                { href: "/contact", text: "Contact" },
                { href: "/sales", text: "Sales" },
              ].map((link) => (
                <Link
                  key={link.href}
                  className="text-foreground font-medium hover:underline p-1 text-sm"
                  to={link.href}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-1">
            <p className="font-medium py-1 col-span-1 text-sm text-muted-foreground">
              Product
            </p>
            <div className="col-span-2 -mx-1 flex flex-wrap gap-2 sm:flex-col">
              {[
                {
                  href: "https://github.com/crbnos/carbon/blob/main/LICENSE",
                  text: "License",
                },
                {
                  href: "https://learn.carbonos.dev",
                  text: "Onboarding",
                },
                { href: "/pricing", text: "Pricing" },
                {
                  href: "https://github.com/crbnos/carbon",
                  text: "Source Code",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  className="text-foreground font-medium hover:underline p-1 text-sm"
                  to={link.href}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-12">
            <div className="col-span-1 flex flex-col gap-1">
              <p className="font-medium py-1 col-span-1 text-sm text-muted-foreground">
                Legal
              </p>
              <div className="col-span-2 -mx-1 flex flex-wrap gap-2 sm:flex-col">
                {[
                  { href: "/privacy", text: "Privacy" },
                  { href: "/terms", text: "Terms" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    className="text-foreground font-medium hover:underline p-1 text-sm"
                    to={link.href}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
