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

	return (
		<div
			role="group"
			aria-label={label}
			className={cn(
				"shadcn relative flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-border bg-background text-left text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.05),0_8px_24px_-8px_rgb(0_0_0/0.12)]",
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
						<span className="hidden h-4 w-px bg-border md:block" />
						<div className="text-sm">
							<span className="text-muted-foreground">Rearden</span>
							<span className="px-2 text-muted-foreground">/</span>
							<span className="font-medium text-foreground">Overview</span>
						</div>
						<div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
							<Pill className="hidden sm:inline-flex">
								synced {tick % 30}s ago
							</Pill>
							<Pill>{rows.length} envs</Pill>
							<span className="hidden h-8 w-48 items-center gap-2 rounded-[6px] border border-input bg-background px-2.5 shadow-[0_1px_2px_rgb(0_0_0/0.05)] lg:inline-flex">
								<Search className="size-3.5" />
								Search…
								<kbd className="ml-auto rounded-[4px] border border-border bg-muted px-1.5 font-mono text-[10px] leading-4">
									⌘K
								</kbd>
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
								<div className="mt-1 text-sm text-muted-foreground">
									rearden · ws_01m33172zmemdb6ya43jnz9bwx
								</div>
							</div>
							<div className="flex gap-2">
								<span className="hidden h-8 items-center rounded-[6px] border border-input bg-background px-3 text-xs font-medium shadow-[0_1px_2px_rgb(0_0_0/0.05)] sm:inline-flex">
									Members
								</span>
								<button
									type="button"
									onClick={addEnvironment}
									disabled={!!added}
									className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-primary px-3 text-xs font-medium text-primary-foreground shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-[opacity,transform] hover:opacity-90 active:scale-[0.97] disabled:cursor-default disabled:opacity-50"
								>
									<Plus className="size-3.5" />
									New environment
								</button>
							</div>
						</div>

						{/* stats */}
						<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
								<div className="hidden text-xs text-muted-foreground sm:block">
									channel head {HEAD}+db3da1b
								</div>
							</div>
							<div className="mt-3 overflow-hidden rounded-[10px] border border-border text-[13px]">
								<div className={cn(ROW, "py-2.5 text-xs font-medium text-muted-foreground")}>
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
			className={cn(ROW, "overflow-hidden transition-colors hover:bg-muted/50")}
		>
			<div className="flex min-w-0 items-center gap-3">
				<Dot className={tone} pulse={r.pending} />
				<div className="min-w-0">
					<div className="font-medium text-foreground">{r.name}</div>
					<div className="truncate text-xs text-muted-foreground">
						{r.slug}
					</div>
				</div>
			</div>
			<div className="hidden items-center gap-2 lg:flex">
				<ShipWheel className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
				<span className="text-foreground">EKS</span>
				<span className="text-muted-foreground">· {r.region}</span>
			</div>
			<div className="flex items-center gap-2 tabular-nums">
				<span>{r.release}</span>
				{r.target && (
					<span className="text-muted-foreground">→ {r.target}</span>
				)}
				{r.behind && (
					<>
						<span className="hidden rounded-[6px] bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground xl:inline-block">
							Behind
						</span>
						<button
							type="button"
							onClick={r.onUpdate}
							className="h-6 rounded-[6px] border border-input bg-background px-2 text-[11px] font-medium shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-[background-color,transform] hover:bg-accent active:scale-[0.96]"
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
		<div className="hidden w-56 shrink-0 flex-col gap-0.5 border-r border-border bg-[hsl(var(--sidebar))] p-2 text-[13px] md:flex">
			<div className="flex items-center gap-2 px-2 py-2 text-muted-foreground">
				<ArrowLeft className="size-3.5" />
				Carbon
			</div>
			<div className="flex items-center gap-2.5 rounded-[8px] p-2 hover:bg-accent">
				<div className="flex size-8 items-center justify-center rounded-[8px] bg-primary text-sm font-semibold text-primary-foreground">
					R
				</div>
				<div className="min-w-0">
					<div className="truncate font-medium">Rearden Metal</div>
					<div className="text-xs text-muted-foreground tabular-nums">
						{count} environments
					</div>
				</div>
			</div>
			<SideLabel>Organization</SideLabel>
			{nav.map(({ icon: Icon, name, active }) => (
				<div
					key={name}
					className={cn(
						"flex h-8 items-center gap-2 rounded-[6px] px-2",
						active
							? "bg-accent font-medium text-accent-foreground"
							: "text-foreground/80",
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
					className="flex h-8 items-center gap-2 rounded-[6px] px-2 text-foreground/80"
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
				className="flex h-8 items-center gap-2 rounded-[6px] px-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
			>
				<Plus className="size-4" strokeWidth={1.75} />
				New environment
			</button>
		</div>
	);
}

function SideLabel({ children }: { children: string }) {
	return (
		<div className="mt-3 flex h-8 items-center px-2 text-xs font-medium text-muted-foreground">
			{children}
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
		<div className="rounded-[10px] border border-border bg-card px-4 py-3 shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
			<div className="text-xs font-medium text-muted-foreground">{label}</div>
			<div className="mt-1.5 flex items-baseline gap-2">
				<span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
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
				"inline-flex h-6 items-center gap-1.5 rounded-[6px] border border-border px-2 font-medium tabular-nums",
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
