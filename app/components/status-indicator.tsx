import { Trans, useLingui } from "@lingui/react/macro";
import { Suspense } from "react";
import { Await } from "react-router";
import { cn } from "~/lib/utils";

function StatusDot({ up }: { up: boolean }) {
	const { t } = useLingui();
	const label = up ? t`Operational` : t`Incident detected`;
	const color = up ? "emerald" : "red";

	return (
		<a
			href="https://status.carbon.ms"
			target="_blank"
			rel="noopener noreferrer"
			className="flex items-center gap-2 text-sm text-foreground hover:text-foreground transition-colors"
		>
			{label}
			<span className="relative flex h-2 w-2">
				<span
					className={cn(
						"absolute h-full w-full animate-ping rounded-full border opacity-100 duration-1000",
						color === "emerald"
							? "border-emerald-500"
							: "border-red-500",
					)}
				/>
				<span
					className={cn(
						"h-2 w-2 rounded-full",
						color === "emerald"
							? "bg-emerald-500"
							: "bg-red-500",
					)}
				/>
			</span>
		</a>
	);
}

function StatusLoading() {
	const { t } = useLingui();
	return (
		<span className="flex items-center gap-2 text-sm text-foreground">
			{t`Checking status…`}
			<span className="inline-block h-2 w-2 rounded-full bg-zinc-400" />
		</span>
	);
}

export function StatusIndicator({
	statusPromise,
}: {
	statusPromise: Promise<{ up: boolean }>;
}) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-sm text-muted-foreground">
				<Trans>System Status:</Trans>
			</span>
			<Suspense fallback={<StatusLoading />}>
				<Await resolve={statusPromise}>
					{(status) => <StatusDot up={status?.up ?? false} />}
				</Await>
			</Suspense>
		</div>
	);
}
