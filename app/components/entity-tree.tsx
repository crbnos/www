import { useLingui } from "@lingui/react/macro";
import { AnimatePresence, motion } from "motion/react";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { cn } from "~/lib/utils";

/**
 * Hand-rolled SVG of a multi-entity org chart — a parent company, its
 * subsidiaries and their elimination entities, each in its own currency.
 * Hovering (or tapping) an entity lights up its consolidation path: the edges
 * draw in from the entity toward the parent, cascading up the tree, then a
 * pulse keeps flowing upward to show the books rolling up. Everything off the
 * path dims. All state changes are CSS transitions, so they stay interruptible
 * as the pointer moves between entities.
 */

type Flag = "us" | "ar";

type Entity = {
	id: string;
	parent?: string;
	name: string;
	currency: string;
	flag?: Flag;
	/** An elimination entity: a bookkeeping shell for intercompany entries. */
	elimination?: boolean;
	/** Centre x and top y, in viewBox units. */
	x: number;
	y: number;
};

const CARD_W = 188;
const ELIM_W = 148;
const CARD_H = 56;
const VIEW_W = 640;
const VIEW_H = 388;

// Hank Rearden's empire from Atlas Shrugged, drawn as a consolidated group:
// the Rearden Metal holding company over the Pennsylvania mills and the
// Minnesota ore mines, plus d'Anconia Copper out of Buenos Aires for a second
// currency. Names are demo data, left untranslated like the app UI.
const entities: Entity[] = [
	{
		id: "metal",
		name: "Rearden Metal",
		currency: "USD",
		flag: "us",
		x: 320,
		y: 16,
	},
	{
		id: "elim-metal",
		parent: "metal",
		name: "Elimination",
		currency: "USD",
		elimination: true,
		x: 90,
		y: 172,
	},
	{
		id: "steel",
		parent: "metal",
		name: "Rearden Steel",
		currency: "USD",
		flag: "us",
		x: 320,
		y: 172,
	},
	{
		id: "danconia",
		parent: "metal",
		name: "d’Anconia Copper",
		currency: "ARS",
		flag: "ar",
		x: 542,
		y: 172,
	},
	{
		id: "elim-steel",
		parent: "steel",
		name: "Elimination",
		currency: "USD",
		elimination: true,
		x: 206,
		y: 328,
	},
	{
		id: "ore",
		parent: "steel",
		name: "Rearden Ore",
		currency: "USD",
		flag: "us",
		x: 434,
		y: 328,
	},
];

const byId = new Map(entities.map((e) => [e.id, e]));
const root = entities[0];

function ancestors(id: string) {
	const out: string[] = [];
	let cur = byId.get(id)?.parent;
	while (cur) {
		out.push(cur);
		cur = byId.get(cur)?.parent;
	}
	return out;
}

function descendants(id: string): string[] {
	return entities
		.filter((e) => e.parent === id)
		.flatMap((e) => [e.id, ...descendants(e.id)]);
}

function width(e: Entity) {
	return e.elimination ? ELIM_W : CARD_W;
}

/** Child top → parent bottom, as an orthogonal elbow. Drawn upward so the
 *  draw-in and the pulse both travel toward the parent. */
function edgePath(child: Entity, parent: Entity) {
	const from = parent.y + CARD_H;
	const mid = (from + child.y) / 2;
	return `M${child.x} ${child.y} V${mid} H${parent.x} V${from}`;
}

export function EntityTree({
	label,
	className,
}: {
	label: string;
	className?: string;
}) {
	const { t } = useLingui();
	const [active, setActive] = useState<string | null>(null);

	const current = active ? byId.get(active) : undefined;
	// An elimination entity nets out trades between its siblings, so hovering
	// one lights those siblings (and the parent they consolidate into) rather
	// than a single path up the tree.
	const peers = current?.elimination
		? entities
				.filter((e) => e.parent === current.parent && e.id !== current.id)
				.map((e) => e.id)
		: [];
	const up = !current
		? []
		: current.elimination
			? [current.parent ?? ""]
			: ancestors(current.id);
	const down = current && !current.elimination ? descendants(current.id) : [];
	const lit = new Set(current ? [current.id, ...up, ...down, ...peers] : []);

	// An edge is on the path when both its ends are lit. Edges above the active
	// entity cascade upward one after another; edges below it flow in at once.
	const edges = entities.flatMap((e) => {
		const parent = e.parent ? byId.get(e.parent) : undefined;
		if (!parent) return [];
		return {
			id: e.id,
			d: edgePath(e, parent),
			on: lit.has(e.id) && lit.has(parent.id),
			delay: (up.indexOf(e.id) + 1) * 220,
		};
	});

	const caption = (() => {
		const e = current;
		if (!e) {
			const count = entities.filter((x) => !x.elimination).length;
			const currencies = new Set(entities.map((x) => x.currency)).size;
			return t`${count} entities · ${currencies} currencies · one ledger`;
		}
		if (e.elimination) {
			const parent = byId.get(e.parent ?? "")?.name ?? "";
			return t`Intercompany eliminations for ${parent}`;
		}
		if (!e.parent) {
			const count = down.filter((id) => !byId.get(id)?.elimination).length;
			return t`Consolidates ${count} entities in ${e.currency}`;
		}
		const rootName = root.name;
		return e.currency === root.currency
			? t`Rolls up to ${rootName} in ${e.currency}`
			: t`${e.currency} → ${root.currency} · rolls up to ${rootName}`;
	})();

	return (
		<div
			className={cn(
				"relative flex h-full w-full flex-col bg-screenshot",
				className,
			)}
		>
			<div className="flex min-h-0 flex-1 items-center justify-center px-3 pt-6 sm:px-8 sm:pt-8">
				<svg
					viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
					role="img"
					aria-label={label}
					className="h-auto w-full select-none sm:h-full"
					onPointerLeave={() => setActive(null)}
				>
					{/* Siblings share the trunk into their parent, so every base line
					    goes down before any highlight — otherwise an unlit sibling's
					    grey line paints over a lit one. */}
					<g fill="none">
						{edges.map(({ id, d }) => (
							<path
								key={id}
								d={d}
								className="stroke-border"
								strokeWidth={1.25}
							/>
						))}
						{edges.map(({ id, d, on, delay }) => (
							<g key={id}>
								{/* draws in from the entity toward its parent */}
								<path
									d={d}
									pathLength={1}
									strokeDasharray="1 1"
									className="stroke-secondary motion-reduce:!transition-none"
									strokeWidth={1.5}
									style={{
										strokeDashoffset: on ? 0 : 1,
										transition: on
											? `stroke-dashoffset 320ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`
											: "stroke-dashoffset 160ms ease-in",
									}}
								/>
								{/* then keeps pulsing upward once drawn */}
								<path
									d={d}
									strokeDasharray="4 14"
									strokeLinecap="round"
									className="stroke-secondary motion-safe:animate-cb-march motion-reduce:hidden"
									strokeWidth={2.5}
									style={{
										opacity: on ? 1 : 0,
										transition: on
											? `opacity 200ms ease-out ${delay + 280}ms`
											: "opacity 120ms ease-in",
									}}
								/>
							</g>
						))}
					</g>

					{entities.map((e) => (
						<EntityCard
							key={e.id}
							entity={e}
							active={active === e.id || peers.includes(e.id)}
							dimmed={!!active && !lit.has(e.id)}
							onEnter={() => setActive(e.id)}
							onToggle={() =>
								setActive((cur) => (cur === e.id ? null : e.id))
							}
						/>
					))}
				</svg>
			</div>

			<div
				aria-live="polite"
				className="flex min-h-11 items-center gap-2 px-4 py-3 font-mono text-[9px] uppercase leading-snug tracking-[0.08em] text-muted-foreground sm:px-5 sm:text-[11px] sm:tracking-[0.16em]"
			>
				<span
					aria-hidden
					className={cn(
						"size-1.5 shrink-0 transition-colors duration-200",
						active ? "bg-secondary" : "bg-muted-foreground/40",
					)}
				/>
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.span
						key={caption}
						initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
						animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
						exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
						transition={{ type: "spring", duration: 0.3, bounce: 0 }}
						className="min-w-0"
					>
						{caption}
					</motion.span>
				</AnimatePresence>
			</div>
		</div>
	);
}

function EntityCard({
	entity: e,
	active,
	dimmed,
	onEnter,
	onToggle,
}: {
	entity: Entity;
	active: boolean;
	dimmed: boolean;
	onEnter: () => void;
	onToggle: () => void;
}) {
	const w = width(e);
	return (
		<g
			transform={`translate(${e.x - w / 2} ${e.y})`}
			className="cursor-default transition-opacity duration-200"
			style={{ opacity: dimmed ? 0.4 : 1 }}
			onPointerEnter={(ev) => {
				// Touch fires pointerenter right before click; let the click toggle.
				if (ev.pointerType === "mouse") onEnter();
			}}
			onClick={onToggle}
		>
			<g
				className="transition-transform duration-200 ease-out motion-reduce:transition-none"
				style={{ transform: active ? "translateY(-2px)" : "none" }}
			>
				<rect
					width={w}
					height={CARD_H}
					className={cn(
						"fill-card transition-[stroke] duration-200",
						active ? "stroke-secondary" : "stroke-border",
					)}
					strokeWidth={1.25}
					strokeDasharray={e.elimination ? "4 3" : undefined}
				/>
				<rect
					x={10}
					y={10}
					width={36}
					height={36}
					className={cn(
						"transition-[fill] duration-200",
						active ? "fill-secondary/15" : "fill-muted",
					)}
				/>
				{e.flag ? (
					<g transform="translate(16 20)">
						<FlagMark flag={e.flag} />
					</g>
				) : (
					<Building2
						x={18}
						y={18}
						size={20}
						strokeWidth={1.5}
						className="text-muted-foreground"
					/>
				)}
				<text
					x={58}
					y={27}
					fontSize={14}
					fontWeight={500}
					className={e.elimination ? "fill-muted-foreground" : "fill-foreground"}
				>
					{e.name}
				</text>
				<text
					x={58}
					y={44}
					fontSize={10.5}
					letterSpacing="0.08em"
					className="fill-muted-foreground font-mono"
				>
					{e.currency}
				</text>
			</g>
		</g>
	);
}

/** 24×16 flags, simplified to read at icon size. */
function FlagMark({ flag }: { flag: Flag }) {
	return (
		<g>
			{flag === "us" && (
				<>
					<rect width={24} height={16} fill="#fff" />
					{Array.from({ length: 7 }, (_, i) => (
						<rect
							key={i}
							y={(i * 2 * 16) / 13}
							width={24}
							height={16 / 13}
							fill="#B22234"
						/>
					))}
					<rect width={10} height={(16 / 13) * 7} fill="#3C3B6E" />
					{[0, 1, 2].flatMap((c) =>
						[0, 1, 2].map((r) => (
							<circle
								key={`${c}${r}`}
								cx={2 + c * 3}
								cy={1.9 + r * 2.7}
								r={0.5}
								fill="#fff"
							/>
						)),
					)}
				</>
			)}
			{flag === "ar" && (
				<>
					<rect width={24} height={16} fill="#74ACDF" />
					<rect y={16 / 3} width={24} height={16 / 3} fill="#fff" />
					<circle cx={12} cy={8} r={1.8} fill="#F6B40E" />
				</>
			)}
			{/* hairline outline so the white/black bands hold their edge */}
			<rect
				x={0.25}
				y={0.25}
				width={23.5}
				height={15.5}
				fill="none"
				strokeWidth={0.5}
				className="stroke-black/10 dark:stroke-white/10"
			/>
		</g>
	);
}
