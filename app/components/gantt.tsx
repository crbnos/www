// this is a modified version of the network chart by ryan florence's remix run website
// you should use remix -- it's amazing
// and it's what we use at carbonos

import { Actor, useActor } from "./ui/stage";

export function GanttHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-center text-xl font-semibold text-foreground lg:mb-6 lg:text-3xl">
      {children}
    </div>
  );
}

export function GanttContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Actor start={0.25} end={1} persistent>
      <div
        className={
          "origin-top scale-75 xl:w-[50vw] xl:scale-75" + " " + className
        }
      >
        {children}
      </div>
    </Actor>
  );
}

export function Resource({
  name,
  size,
  start,
  cancel,
}: {
  name: string;
  size: number;
  start: number;
  cancel?: boolean;
  hideUntilStart?: boolean;
}) {
  let actor = useActor();
  let progress = actor.progress * 100;
  let end = start + size;

  let complete = progress > end;
  let width = complete ? size : Math.max(progress - start, 0);

  return (
    <div className="flex items-center justify-center border-b border-gray-600 last:border-b-0">
      <div
        className={
          "w-16 text-[length:8px] sm:w-28 sm:text-sm" +
          " " +
          (width === 0 ? "opacity-0" : "")
        }
      >
        {name}
      </div>
      <div className="relative flex-1">
        <div
          className={
            "h-1 sm:h-2" +
            " " +
            (complete
              ? cancel
                ? "bg-red-500"
                : "bg-green-500"
              : "bg-blue-500")
          }
          style={{
            width: `${width}%`,
            marginLeft: `${start}%`,
          }}
        />
      </div>
    </div>
  );
}

export function Gantt({
  children,
  ticks = 50,
}: {
  children: React.ReactNode;
  ticks?: number;
}) {
  let actor = useActor();
  return (
    <div className="relative mx-2 max-h-[75vh] select-none overflow-hidden shadow-md md:mx-4 md:rounded-lg lg:mx-auto lg:max-w-4xl">
      <div className="relative">
        <Ticks n={ticks} />
        <div className="h-4" />
        <div>{children}</div>
        <div className="absolute left-16 right-0 top-0 h-full sm:left-28">
          <div
            className="absolute top-0 h-full"
            style={{
              left: `${actor.progress * 100}%`,
            }}
          >
            <ProgressHead className="-ml-1 w-2 text-blue-400" />
            <div className="relative top-[-1px] h-full w-[1px] bg-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Ticks({ n }: { n: number }) {
  let ticks = Array.from({ length: n }).fill(null);
  return (
    <div className="absolute left-16 right-0 top-0 flex justify-around sm:left-28">
      {ticks.map((_, index) => (
        <div
          className={
            (index + 1) % 10
              ? "h-1 w-[1px] bg-gray-300"
              : "h-[6px] w-[1px] bg-gray-50"
          }
          key={index}
        />
      ))}
    </div>
  );
}

export function ProgressHead({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 7 14"
    >
      <path
        fill="currentColor"
        d="M0 0h7v9.249a2 2 0 01-.495 1.316L3.5 14 .495 10.566A2 2 0 010 9.248V0z"
      ></path>
    </svg>
  );
}
