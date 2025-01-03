import { Link } from "@remix-run/react";
import { SocialIcon } from "./social-icon";

export function Footer() {
  return (
    <>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-zinc-200/0 via-zinc-500/30 to-zinc-200/0" />
      <div className="flex w-full justify-center border-t py-12 md:py-16 lg:py-20 2xl:py-24 dark:border-transparent">
        <div className="mx-auto w-full max-w-7xl flex-col px-4 md:px-6 lg:px-8 grid grid-cols-1 gap-12 sm:grid-cols-5 sm:gap-6">
          <div className="flex flex-col gap-6 sm:col-span-2">
            <a className="text-primary select-none" href="/">
              <div className="flex items-center gap-1.5">
                <img
                  src="https://app.carbonos.dev/carbon-logo-dark.png"
                  alt="CarbonOS"
                  className="size-5 block dark:hidden"
                />
                <img
                  src="https://app.carbonos.dev/carbon-logo-light.png"
                  alt="CarbonOS"
                  className="size-5 hidden dark:block"
                />
                <span className="text-primary text-lg font-semibold tracking-tight">
                  CarbonOS
                </span>
              </div>
            </a>

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
            <p className="font-medium py-1 col-span-1 text-sm text-primary">
              Product
            </p>
            <div className="col-span-2 -mx-1 flex flex-wrap gap-2 sm:flex-col">
              {[
                { href: "/learn", text: "Learn" },
                { href: "/license", text: "License" },
              ].map((link) => (
                <Link
                  key={link.href}
                  className="text-muted-foreground hover:text-primary p-1 text-sm"
                  to={link.href}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-12">
            <div className="col-span-1 flex flex-col gap-1">
              <p className="font-medium py-1 col-span-1 text-sm text-primary">
                About
              </p>
              <div className="col-span-2 -mx-1 flex flex-wrap gap-2 sm:flex-col">
                {[
                  { href: "/contact", text: "Contact" },
                  { href: "/ownership", text: "Ownership Plans" },
                  { href: "/privacy", text: "Privacy" },
                  { href: "/terms", text: "Terms" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    className="text-muted-foreground hover:text-primary p-1 text-sm"
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
