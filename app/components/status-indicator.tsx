import { useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

type Status = "operational" | "incident" | "loading";

export function StatusIndicator() {
	const [status, setStatus] = useState<Status>("loading");
	const { t } = useLingui();

	useEffect(() => {
		fetch("/api/status")
			.then((res) => res.json())
			.then((data) => {
				setStatus(data.incident ? "incident" : "operational");
			})
			.catch(() => {
				setStatus("operational");
			});
	}, []);

	const label =
		status === "operational"
			? t`All systems operational`
			: status === "incident"
				? t`Incident detected`
				: t`Checking status…`;

	return (
		<a
			href="https://status.carbon.ms"
			target="_blank"
			rel="noopener noreferrer"
			className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
		>
			<span
				className={cn(
					"inline-block h-2 w-2 rounded-full",
					status === "operational"
						? "bg-emerald-500"
						: status === "incident"
							? "bg-red-500"
							: "bg-zinc-400",
				)}
			/>
			{label}
		</a>
	);
}
