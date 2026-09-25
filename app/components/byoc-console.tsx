import { AnimatePresence, motion } from "motion/react";
import {
	ArrowLeft,
	FileKey,
	GitFork,
	LayoutGrid,
	PanelLeft,
	Plus,
	Search,
	ShipWheel,
	Users,
	Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

/**
 * A hand-built recreation of the BYOC control plane: one org, its
 * environments running in the customer's own cloud account, and the release
 * channel they track. It's interactive in the two ways that sell the offer:
 * "Update" rolls the lagging staging environment onto the channel head, and
 * "New environment" provisions a fresh one in a single click. Org and
 * environment names are demo data, left untranslated like the app UI.
 */

const HEAD = "0.2.22";
const STEP_MS = 160;

type Phase = "behind" | "rolling" | "current";

type Row = {
	id: string;
	name: string;
	slug: string;
	region: string;
	release: string;
	/** Rolling toward this release. */
	target?: string;
	ready: number;
	total: number;
	/** Still coming up: provisioning or mid-rollout. */
	pending: boolean;
	provisioning?: boolean;
	behind?: boolean;
	seen: number;
	onUpdate?: () => void;
};

export function ByocConsole({
	label,
	className,
}: {
	label: string;
	className?: string;
}) {
	const [staging, setStaging] = useState<{ phase: Phase; ready: number }>({
		phase: "behind",
		ready: 13,
	});
	const [added, setAdded] = useState<{ ready: number } | null>(null);
	const [tick, setTick] = useState(0);

	// Agent heartbeats: each "seen Ns ago" counts up and wraps.
	useEffect(() => {
		const id = setInterval(() => setTick((t) => t + 1), 1000);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		if (staging.phase !== "rolling") return;
		const id = setTimeout(() => {
			setStaging((s) =>
				s.ready + 1 >= 13
					? { phase: "current", ready: 13 }
					: { ...s, ready: s.ready + 1 },
			);
		}, STEP_MS);
		return () => clearTimeout(id);
	}, [staging]);

	useEffect(() => {
		if (!added || added.ready >= 14) return;
		const id = setTimeout(
			() => setAdded((a) => (a ? { ready: a.ready + 1 } : a)),
			STEP_MS * 1.5,
		);
		return () => clearTimeout(id);
	}, [added]);

	const rows: Row[] = [
		{
			id: "staging",
			name: "staging",
			slug: "rearden-staging",
			region: "us-east-1",
			release: staging.phase === "current" ? HEAD : "0.2.18",
			target: staging.phase === "rolling" ? HEAD : undefined,
			ready: staging.ready,
			total: 13,
			pending: staging.phase === "rolling",
			behind: staging.phase === "behind",
			seen: (tick + 7) % 20,
			onUpdate: () => setStaging({ phase: "rolling", ready: 0 }),
		},
		{
			id: "prod",
			name: "prod",
			slug: "rearden-prod",
			region: "us-east-1",
			release: HEAD,
			ready: 14,
			total: 14,
			pending: false,
			seen: (tick + 17) % 20,
		},
	];
	if (added) {
		const done = added.ready >= 14;
		rows.push({
			id: "eu-prod",
			name: "eu-prod",
			slug: "rearden-eu-prod",
			region: "eu-west-1",
			release: HEAD,
			ready: added.ready,
			total: 14,
			pending: !done,
			provisioning: !done,
			seen: tick % 20,
		});
	}

	const running = rows.filter((r) => r.pending).length;
	const awaiting = staging.phase === "behind" ? 1 : 0;
	const addEnvironment = () => {
		if (!added) setAdded({ ready: 0 });
	};

	const caption = (() => {
		if (added && added.ready < 14)
			return `Provisioning eu-prod in your AWS account · ${added.ready}/14 workloads`;
		if (staging.phase === "rolling")
			return `Rolling ${HEAD} out to staging · ${staging.ready}/13 workloads`;
		if (staging.phase === "behind")
			return `staging is behind the channel — approve ${HEAD} to roll it out`;
		if (!added) return `Every environment on ${HEAD} · add one in a click`;
		return `${rows.length} environments on ${HEAD} · all workloads healthy`;
	})();

	return (
		<div
			role="group"
			aria-label={label}
			className={cn(
				"relative flex h-full w-full flex-col bg-screenshot text-left",
				className,
			)}
		>
			<div className="flex min-h-0 flex-1">
				<Sidebar
					environments={rows.map((r) => ({ name: r.name, pending: r.pending }))}
					count={rows.length}
					canAdd={!added}
					onAdd={addEnvironment}
				/>

				<div className="flex min-w-0 flex-1 flex-col">
					{/* top bar */}
					<div className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4 sm:px-6">
						<PanelLeft className="hidden size-4 text-muted-foreground md:block" />
						<div className="text-sm">
							<span className="text-foreground">Rearden</span>
							<span className="px-2 text-muted-foreground">/</span>
							<span className="font-medium text-foreground">Overview</span>
						</div>
						<div className="ml-auto flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
							<Pill className="hidden sm:inline-flex">
								synced {tick % 30}s ago
							</Pill>
							<Pill>{rows.length} envs</Pill>
							<span className="hidden items-center gap-2 border border-border px-2.5 py-1 font-sans lg:inline-flex">
								<Search className="size-3.5" />
								Jump to…
							</span>
						</div>
					</div>

					<div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden p-4 sm:p-6">
						{/* heading */}
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<div className="text-2xl font-semibold tracking-[-0.01em]">
									Rearden Metal
								</div>
								<div className="mt-1.5 font-mono text-[11px] text-muted-foreground">
									rearden · ws_01m33172zmemdb6ya43jnz9bwx
								</div>
							</div>
							<div className="flex gap-2">
								<span className="hidden border border-border px-3 py-1.5 text-xs font-medium sm:inline-block">
									Members
								</span>
								<button
									type="button"
									onClick={addEnvironment}
									disabled={!!added}
									className="inline-flex items-center gap-1.5 bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-[opacity,transform] hover:opacity-90 active:scale-[0.97] disabled:cursor-default disabled:opacity-50"
								>
									<Plus className="size-3.5" />
									New environment
								</button>
							</div>
						</div>

						{/* stats */}
						<div className="grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-4">
							<Stat
								label="Environments"
								value={rows.length}
								note={running ? `${running} applying` : "all applied"}
							/>
							<Stat label="Awaiting approval" value={awaiting} />
							<Stat label="Running" value={running} />
							<Stat label="Seats" value={48} note="of 60 licensed" />
						</div>

						{/* environments */}
						<div className="min-h-0">
							<div className="flex items-baseline justify-between gap-4">
								<div className="text-sm font-medium">Environments</div>
								<div className="hidden font-mono text-[11px] text-muted-foreground sm:block">
									channel head {HEAD}+db3da1b
								</div>
							</div>
							<div className="mt-3 border border-border text-[13px]">
								<div className={cn(ROW, "text-xs text-muted-foreground")}>
									<div>Environment</div>
									<div className="hidden lg:block">Placement</div>
									<div>Release</div>
									<div className="hidden sm:block">Workloads</div>
									<div className="hidden xl:block">Certificates</div>
									<div className="hidden md:block">Agent</div>
								</div>
								<AnimatePresence initial={false}>
									{rows.map((r) => (
										<EnvironmentRow key={r.id} row={r} />
									))}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				aria-live="polite"
				className="flex min-h-11 items-center gap-2 border-t border-border px-4 py-3 font-mono text-[9px] uppercase leading-snug tracking-[0.08em] text-muted-foreground sm:px-5 sm:text-[11px] sm:tracking-[0.16em]"
			>
				<span
					aria-hidden
					className={cn(
						"size-1.5 shrink-0 transition-colors duration-200",
						running || awaiting ? "bg-secondary" : "bg-muted-foreground/40",
					)}
				/>
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.span
						key={caption.replace(/\d+\/\d+/, "")}
						initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
						transition={{ type: "spring", duration: 0.3, bounce: 0 }}
						className="min-w-0 tabular-nums"
					>
						{caption}
					</motion.span>
				</AnimatePresence>
			</div>
		</div>
	);
}

const ROW =
	"grid grid-cols-[1.3fr_1.2fr] items-center gap-4 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[1.3fr_1.2fr_1fr] md:grid-cols-[1.3fr_1.2fr_1fr_0.9fr] lg:grid-cols-[1.3fr_1fr_1.2fr_1fr_0.9fr] xl:grid-cols-[1.2fr_1fr_1.2fr_1fr_0.8fr_0.9fr]";

function EnvironmentRow({ row: r }: { row: Row }) {
	const tone = r.pending ? "bg-amber-500" : "bg-emerald-500";
	return (
		<motion.div
			layout="position"
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			transition={{ type: "spring", duration: 0.4, bounce: 0 }}
			className={cn(ROW, "overflow-hidden")}
		>
			<div className="flex min-w-0 items-center gap-3">
				<Dot className={tone} pulse={r.pending} />
				<div className="min-w-0">
					<div className="font-medium text-foreground">{r.name}</div>
					<div className="truncate font-mono text-[11px] text-muted-foreground">
						{r.slug}
					</div>
				</div>
			</div>
			<div className="hidden items-center gap-2 lg:flex">
				<ShipWheel className="size-4 shrink-0 text-secondary" strokeWidth={1.75} />
				<span className="text-foreground">EKS</span>
				<span className="text-muted-foreground">· {r.region}</span>
			</div>
			<div className="flex items-center gap-2 font-mono tabular-nums">
				<span>{r.release}</span>
				{r.target && (
					<span className="text-muted-foreground">→ {r.target}</span>
				)}
				{r.behind && (
					<>
						<span className="hidden border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-sans text-[11px] leading-none text-amber-700 dark:text-amber-300 xl:inline-block">
							behind
						</span>
						<button
							type="button"
							onClick={r.onUpdate}
							className="border border-secondary px-2 py-0.5 font-sans text-[11px] font-medium text-secondary transition-[background-color,transform] hover:bg-secondary/10 active:scale-[0.96]"
						>
							Update
						</button>
					</>
				)}
			</div>
			<div className="hidden items-center gap-2 tabular-nums sm:flex">
				<Dot className={tone} />
				{r.provisioning
					? `provisioning ${r.ready}/${r.total}`
					: r.target
						? `${r.ready}/${r.total} updated`
						: `${r.ready}/${r.total} running`}
			</div>
			<div className="hidden items-center gap-2 xl:flex">
				<Dot className={r.provisioning ? "bg-amber-500" : "bg-emerald-500"} />
				{r.provisioning ? "issuing" : r.id === "eu-prod" ? "90d left" : "87d left"}
			</div>
			<div className="hidden items-center gap-2 tabular-nums md:flex">
				<Dot className={r.provisioning ? "bg-amber-500" : "bg-emerald-500"} />
				{r.provisioning ? "installing" : `seen ${r.seen}s ago`}
			</div>
		</motion.div>
	);
}

function Sidebar({
	environments,
	count,
	canAdd,
	onAdd,
}: {
	environments: { name: string; pending: boolean }[];
	count: number;
	canAdd: boolean;
	onAdd: () => void;
}) {
	const nav = [
		{ icon: LayoutGrid, name: "Overview", active: true },
		{ icon: FileKey, name: "Licenses" },
		{ icon: Workflow, name: "Operations" },
		{ icon: Users, name: "Members" },
		{ icon: GitFork, name: "Build & Releases" },
	];
	return (
		<div className="hidden w-56 shrink-0 flex-col gap-1 border-r border-border bg-muted/40 p-3 text-[13px] md:flex">
			<div className="flex items-center gap-2 px-2 py-2 text-muted-foreground">
				<ArrowLeft className="size-3.5" />
				Carbon
			</div>
			<div className="flex items-center gap-3 border border-border bg-card p-2.5">
				<div className="flex size-8 items-center justify-center bg-secondary text-sm font-semibold text-secondary-foreground">
					R
				</div>
				<div className="min-w-0">
					<div className="truncate font-medium">Rearden Metal</div>
					<div className="text-[11px] text-muted-foreground tabular-nums">
						{count} environments
					</div>
				</div>
			</div>
			<SideLabel>Organization</SideLabel>
			{nav.map(({ icon: Icon, name, active }) => (
				<div
					key={name}
					className={cn(
						"flex items-center gap-2.5 px-2 py-1.5",
						active ? "bg-card text-foreground" : "text-muted-foreground",
					)}
				>
					<Icon className="size-4" strokeWidth={1.75} />
					{name}
				</div>
			))}
			<SideLabel>Environments</SideLabel>
			{environments.map((e) => (
				<div
					key={e.name}
					className="flex items-center gap-2.5 px-2 py-1.5 text-muted-foreground"
				>
					<ShipWheel className="size-4" strokeWidth={1.75} />
					<span className="flex-1">{e.name}</span>
					<Dot
						className={e.pending ? "bg-amber-500" : "bg-emerald-500"}
						pulse={e.pending}
					/>
				</div>
			))}
			<button
				type="button"
				onClick={onAdd}
				disabled={!canAdd}
				className="flex items-center gap-2.5 px-2 py-1.5 text-left text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
			>
				<Plus className="size-4" strokeWidth={1.75} />
				New environment
			</button>
		</div>
	);
}

function SideLabel({ children }: { children: string }) {
	return (
		<div className="mt-3 flex items-center gap-2 px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
			{children}
			<span className="h-px flex-1 bg-border" />
		</div>
	);
}

function Stat({
	label,
	value,
	note,
}: {
	label: string;
	value: number;
	note?: string;
}) {
	return (
		<div className="bg-card px-4 py-3">
			<div className="text-xs text-muted-foreground">{label}</div>
			<div className="mt-1.5 flex items-baseline gap-2">
				<span className="text-xl font-medium tabular-nums">{value}</span>
				{note && (
					<span className="truncate text-xs text-muted-foreground">{note}</span>
				)}
			</div>
		</div>
	);
}

function Pill({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 border border-border px-2.5 py-1 tabular-nums",
				className,
			)}
		>
			<Dot className="bg-emerald-500" />
			{children}
		</span>
	);
}

function Dot({ className, pulse }: { className: string; pulse?: boolean }) {
	return (
		<span
			aria-hidden
			className={cn(
				"inline-block size-1.5 shrink-0 rounded-full",
				pulse && "motion-safe:animate-pulse",
				className,
			)}
		/>
	);
}
