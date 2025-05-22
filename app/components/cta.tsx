import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

export function CTA({ isLearnPage = false }: { isLearnPage?: boolean }) {
  return (
    <div className="flex min-h-[calc(100dvh-290px)] items-center justify-center">
      <div className="max-w-5xl text-center px-10 py-14 mx-4 md:mx-auto md:px-24 flex items-center flex-col rounded-lg">
        <span className="text-6xl md:text-8xl font-bold tracking-tighter">
          CarbonOS
        </span>
        <p className="text-muted-foreground mt-6">
          The new standard for tech-enabled manufacturing
        </p>
        <div className="mt-10 md:mb-8">
          <div className="flex flex-col items-center gap-4">
            <Button size="lg" className="text-lg rounded-full" asChild>
              <Link prefetch="intent" to="/contact">
                Contact
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
