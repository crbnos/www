import { Trans } from "@lingui/react/macro";
import { Link, useRouteLoaderData } from "react-router";
import type { loader } from "~/root";
import { SocialIcon } from "./social-icon";
import { StatusIndicator } from "./status-indicator";

export function Footer() {
  const data = useRouteLoaderData<typeof loader>("root");
  return (
    <>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-background via-zinc-200 dark:via-zinc-800 to-background " />
      <div className="flex w-full justify-center py-12 md:py-16 lg:py-20 2xl:py-24 dark:border-transparent">
        <div className="mx-auto w-full container flex-col px-4 md:px-6 lg:px-8 grid grid-cols-1 gap-12 sm:grid-cols-5 sm:gap-6">
          <div className="flex flex-col gap-6 sm:col-span-1">
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
              <SocialIcon type="x" href="https://x.com/carbon_ms" />
              <SocialIcon
                type="linkedin"
                href="https://www.linkedin.com/company/carbon-manufacturing-systems"
              />
              <SocialIcon type="github" href="https://github.com/crbnos" />
            </div>

            <StatusIndicator statusPromise={data!.statusPromise} />
          </div>
          <div className="col-span-1 flex flex-col gap-1">
            <p className="font-medium py-1 col-span-1 text-sm text-muted-foreground">
              <Trans>Company</Trans>
            </p>
            <div className="col-span-2 -mx-1 flex flex-wrap gap-2 sm:flex-col">
              <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="/brand"><Trans>Brand Assets</Trans></Link>
              <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="/learn"><Trans>Blog</Trans></Link>
              <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="/contact"><Trans>Contact</Trans></Link>
              <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="/oss"><Trans>OSS Friends</Trans></Link>
              <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="/sales"><Trans>Sales</Trans></Link>
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-1">
            <p className="font-medium py-1 col-span-1 text-sm text-muted-foreground">
              <Trans>Product</Trans>
            </p>
            <div className="col-span-2 -mx-1 flex flex-wrap gap-2 sm:flex-col">
              <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="https://learn.carbon.ms"><Trans>Learning</Trans></Link>
              <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="https://github.com/crbnos/carbon/blob/main/LICENSE"><Trans>License</Trans></Link>
              <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="/pricing"><Trans>Pricing</Trans></Link>
              <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="https://github.com/crbnos/carbon"><Trans>Source Code</Trans></Link>
            </div>
          </div>
          <div className="flex flex-col gap-12">
            <div className="col-span-1 flex flex-col gap-1">
              <p className="font-medium py-1 col-span-1 text-sm text-muted-foreground">
                <Trans>Legal</Trans>
              </p>
              <div className="col-span-2 -mx-1 flex flex-wrap gap-2 sm:flex-col">
                <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="/privacy"><Trans>Privacy</Trans></Link>
                <Link className="text-foreground font-medium hover:underline p-1 text-sm" to="/terms"><Trans>Terms</Trans></Link>
              </div>
            </div>
          </div>
          <div className="flex col-span-1">
            <img src="/logos/itar.svg" className="h-20 dark:invert" />
          </div>
        </div>
      </div>
    </>
  );
}
