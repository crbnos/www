import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { Book, Check, ChevronRight, Copy, ImageIcon, X } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { CodeExamples } from "~/components/code-examples";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */
//
// User-facing copy in these module-level constants is wrapped in the `msg`
// macro, which produces a lazy MessageDescriptor (not a translated string).
// Each descriptor is resolved to the active locale at render time via
// `useLingui().i18n._(descriptor)`. Brand names, acronym codes (ERP/MRP/…),
// URLs and other proper nouns are left as plain strings on purpose.

type Customer = {
	name: string;
	logo: string;
	url: string;
	tone?: "light" | "color";
};

// Brand names — never translated.
const customers: Customer[] = [
	{ name: "Minimal", logo: "/logos/minimal.svg", url: "https://minimal.tech" },
	{ name: "Machenit", logo: "/logos/machenit.png", url: "https://machenit.com" },
	{
		name: "Black Cat Labs",
		logo: "/logos/black-cat-labs.png",
		url: "https://blackcatlabs.xyz",
	},
	{ name: "M3 Aerospace", logo: "/logos/m3.png", url: "https://m3-aerospace.com/" },
	{ name: "Zero", logo: "/logos/zero.webp", url: "https://zerofarms.it" },
	{
		name: "Witty Machines",
		logo: "/logos/witty-machines.svg",
		url: "https://www.witty-machines.com/",
	},
	{ name: "Kform", logo: "/logos/kform.png", url: "https://kform.com/" },
	{
		name: "Allinol Technologies",
		logo: "/logos/allinol.png",
		url: "https://allinoltec.com",
	},
	{ name: "Saeki", logo: "/logos/saeki.svg", url: "https://saeki.ch/" },
	{
		name: "Sygnal",
		logo: "/logos/sygnal.svg",
		url: "https://www.sygnalauto.com/",
		tone: "light",
	},
	{
		name: "Ren-Teq",
		logo: "/logos/ren-teq.webp",
		url: "https://www.ren-teq.com/",
		tone: "light",
	},
	{
		name: "Digital Metal",
		logo: "/logos/digital-metal.svg",
		url: "https://www.digitalmetal.io/",
	},
];

const heroWords: MessageDescriptor[] = [
	msg`hardware`,
	msg`satellites`,
	msg`parts`,
	msg`drones`,
	msg`robots`,
	msg`vehicles`,
	msg`reactors`,
];

const statusQuo = [
	
	{
		id: "spreadsheet",
		name: msg`Spreadsheet`,
		rows: [
            msg`Based on assumptions`,
			msg`Shortages found on the floor`,
			msg`Costing guessed after the fact`,
			msg`Revisions lost in email`,
			msg`No serial-level history`,
			msg`Audits reconstructed from memory`,
		],
	},
  {
		id: "legacy",
		name: msg`Legacy ERP`,
		rows: [
            msg`Accounting-focused`,
			msg`18-month implementation`,
			msg`Huge consulting bills`,
			msg`BOMs re-keyed by hand`,
			msg`Traveler printed at 6am, stale by 9`,
			msg`Quality in a separate binder`,
		],
	},
	{
		id: "carbon",
		name: msg`Next Generation`,
		accent: true,
		rows: [
            msg`Manufacturing-focused, GAAP accounting`,
            msg`Everything integrated`,
			msg`Live in weeks`,
			msg`API-first, with first-class MCP`,
			msg`Full traceability and COGS`,
			msg`Audit trail is the database`,
		],
	},
];

const modules = [
	{
		code: "ERP",
		shot: "sales-order",
		name: msg`Inventory & Costing`,
		note: msg`money in, money out`,
		rows: [
			msg`Quotes & RFQ pricing`,
			msg`Sales orders`,
			msg`Purchasing & receipts`,
			msg`Inventory & locations`,
			msg`Job costing`,
			msg`Invoicing & accounting sync`,
			msg`Accrual accounting`,
		],
	},
	{
		code: "MRP",
		shot: "kanban",
		name: msg`Planning`,
		note: msg`what to make, when`,
		rows: [
			msg`Demand & forecast`,
			msg`Supply planning runs`,
			msg`BOM & routing versions`,
			msg`Finite capacity model`,
			msg`Lead times & buffers`,
			msg`Shortage escalation`,
			msg`Part supersession`,
			msg`Engineering change orders`,
		],
	},
	{
		code: "MES",
		shot: "mes-model",
		name: msg`Execution`,
		note: msg`the floor itself`,
		rows: [
			msg`Digital job travelers`,
			msg`Operator terminal`,
			msg`Adaptive MES UI`,
			msg`Labor, scrap & rework`,
			msg`Barcode / QR tracking`,
			msg`Live schedule board`,
		],
	},
	{
		code: "QMS",
		shot: "traceability",
		name: msg`Quality`,
		note: msg`proof, not paperwork`,
		rows: [
			msg`First article inspection`,
			msg`Non-conformance & CAPA`,
			msg`Gauge calibration`,
			msg`Serial & lot genealogy`,
			msg`Supplier scorecards`,
			msg`Certificates of conformance`,
		],
	},
];

const stages = [
	{ name: msg`Engineering`, note: msg`routing & work instructions` },
	{ name: msg`Planning`, note: msg`projections and MRP` },
	{ name: msg`Purchasing`, note: msg`POs & receipts` },
	{ name: msg`Order`, note: msg`confirmed dates` },
	{ name: msg`Production`, note: msg`ops on the floor` },
	{ name: msg`Quality`, note: msg`FAI & NCR` },
	{ name: msg`Shipping`, note: msg`packing & certs` },
	{ name: msg`Invoicing`, note: msg`costed actuals` },
	{ name: msg`Accounting`, note: msg`GL & accruals` },
	{ name: msg`Customize`, note: msg`API, MCP, apps` },
];

const stats = [
	{
		value: 4,
		label: msg`Systems replaced`,
		sub: msg`ERP · MRP · MES · QMS`,
	},
	{
		value: 1,
		label: msg`Shared schema`,
		sub: msg`No sync jobs, no drift`,
	},
	{
		value: 100,
		suffix: "%",
		accent: true,
		label: msg`Serial-level trace`,
		sub: msg`Every unit, every op`,
	},
	{
		value: 28,
		label: msg`Days to go live`,
		sub: msg`Typical first deployment`,
	},
];

const devPillars = [
	{
		tag: "REST API",
		name: msg`Every table is an endpoint`,
		desc: msg`Generated straight from Carbon's schema — 381 resources and 1,641 endpoints, with typed clients for TypeScript, Python, C#, and cURL.`,
	},
	{
		tag: "MCP server",
		name: msg`Agent-ready by default`,
		desc: msg`A built-in MCP server exposes 1,374 operations across 15 modules through three discovery tools. Permissions are baked in — an agent can never do what its identity can't.`,
	},
	{
		tag: "Source available",
		name: msg`Read it. Extend it.`,
		desc: msg`A typed TypeScript monorepo with one generated database type shared across the app, the API, and the AI tools. Bring your own LLM.`,
	},
];

const industries = [
	{ n: "01", name: msg`Defense`, note: msg`ITAR-ready, serialized, audit-first` },
	{ n: "02", name: msg`Aerospace`, note: msg`AS9100, FAI, full genealogy` },
	{ n: "03", name: msg`Automotive`, note: msg`rate production, PPAP, takt` },
	{ n: "04", name: msg`Medical devices`, note: msg`ISO 13485, DHR, e-signatures` },
	{
		n: "05",
		name: msg`Consumer electronics`,
		note: msg`SMT, contract manufacture, NPI`,
	},
	{ n: "06", name: msg`Robotics`, note: msg`deep assemblies, configured units` },
	{ n: "07", name: msg`Energy & grid`, note: msg`long lead, project-based build` },
	{ n: "08", name: msg`Space`, note: msg`one-off, lot-of-one traceability` },
	{ n: "09", name: msg`Semiconductor`, note: msg`cleanroom ops, yield analytics` },
	{
		n: "10",
		name: msg`Industrial equipment`,
		note: msg`configure to order, aftermarket`,
	},
];

const compliance: MessageDescriptor[] = [
	msg`ITAR-ready deployment`,
	msg`AS9100`,
	msg`ISO 13485`,
	msg`21 CFR Part 11`,
	msg`SOC 2 controls`,
	msg`Row-level security`,
];

const integrations = [
	// Product names stay literal; only the category ("kind") is translated.
	{ name: "Onshape", kind: msg`CAD` },
	{ name: "Ramp", kind: msg`Expenses` },
	{ name: "Linear", kind: msg`Tasks` },
	{ name: "Jira", kind: msg`Tasks` },
	{ name: "Slack", kind: msg`Chat` },
	{ name: "Paperless Parts", kind: msg`Quoting` },
	{ name: "Avalara", kind: msg`Taxes` },
	{ name: "Rillet", kind: msg`Finance` },
	{ name: "Xero", kind: msg`Finance` },
	{ name: "Epson", kind: msg`Printer` },
	{ name: "Brother", kind: msg`Printer` },
	{ name: "Zebra ZPL", kind: msg`Printer` },
	{ name: "Ignition", kind: msg`SCADA` },
	{ name: "REST and Webhooks", kind: msg`API` },
	{ name: "Claude", kind: msg`LLM` },
	{ name: "ChatGPT", kind: msg`LLM` },
];

const featureRows = [
	{
		id: "configure",
		eyebrow: msg`Configure to order`,
		title: msg`Unfork your BOM.`,
		body: msg`Parameterize the part, not the paperwork. Rules drive the bill of materials, the routing, the price before you quote it.`,
		points: [
			msg`Rule-based BOM and routing generation`,
			msg`Revision control with effectivity dates`,
			msg`Rolled-up cost at any configuration`,
		],
		shotLabel: msg`Part configurator / BOM tree`,
		shot: "configurator",
		shotLight: "/screenshots/bom-light.webp",
		shotDark: "/screenshots/bom-dark.webp",
		flip: false,
	},
	{
		id: "execution",
		eyebrow: msg`Manufacturing execution`,
		title: msg`The floor, live to the second.`,
		body: msg`Every part, hour, barcode, and deviation tracked and handled in real-time.`,
		points: [
			msg`Digital travelers with work instructions`,
			msg`QR and barcode tracking on every unit`,
			msg`Finite capacity scheduling that reacts`,
		],
		shotLabel: msg`Shop floor / job traveler`,
		shot: "features-mes",
		shotLight: "/screenshots/mes-light.webp",
		shotDark: "/screenshots/mes-dark.webp",
		flip: true,
	},
	{
		id: "quality",
		eyebrow: msg`Quality`,
		title: msg`Traceability is the default state.`,
		body: msg`First article inspection, non-conformance, CAPA and gauge calibration sit on the same records as production. Pull any serial number and get its full genealogy — material certs, operators, measurements, deviations.`,
		points: [
			msg`Serial and lot genealogy, forwards and back`,
			msg`NCR to CAPA workflow with sign-off`,
			msg`Certificates generated from live data`,
		],
		shotLabel: msg`Quality / traceability record`,
		shot: "traceability",
		shotLight: "/screenshots/traceability-light.webp",
		shotDark: "/screenshots/traceability-dark.webp",
		flip: false,
	},
	{
		id: "multi-entity",
		eyebrow: msg`Multi-entity · Multi-location`,
		title: msg`Every site on one ledger.`,
		body: msg`Carbon allows you to a scale from a single-entity, single-location operation, to a multi-national, multi-location manufacturing engine with consolidated accounts.`,
		points: [
			msg`Multi-entity accounting with intercompany transactions`,
			msg`Per-entity currency, COA and tax, consolidated books`,
			msg`Multi-location planning with inter-site transfers`,
		],
		shotLabel: msg`Multi-entity ledger / multi-site planning`,
		shot: "multi-entity",
		shotLight: "/screenshots/multi-light.webp",
		shotDark: "/screenshots/multi-dark.webp",
		flip: true,
	},
];

const APP_URL = "https://app.carbon.ms";
const GITHUB_URL = "https://github.com/crbnos/carbon";

/* -------------------------------------------------------------------------- */
/*  Shared bits                                                                */
/* -------------------------------------------------------------------------- */

const shell = "mx-auto w-full max-w-[1360px] px-6 sm:px-7";
const eyebrow =
	"font-mono text-sm uppercase leading-none tracking-[0.2em] text-muted-foreground";
const heading =
	"font-display font-semibold tracking-[-0.035em] leading-[0.95] text-[clamp(2.125rem,4.4vw,3.875rem)]";

// Layout wrapper. Kept as a plain, always-visible block so content renders
// without JS / before hydration (important for first paint + SEO). Scroll-in
// reveal animations land in the aesthetics pass.
function Reveal({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={className}>{children}</div>;
}

function CyclingWord() {
	const { i18n } = useLingui();
	const [i, setI] = useState(0);
	useEffect(() => {
		const id = setInterval(
			() => setI((v) => (v + 1) % heroWords.length),
			2300,
		);
		return () => clearInterval(id);
	}, []);
	return (
		<span
			key={i}
			className="inline-block animate-cb-word text-secondary [transform-style:preserve-3d]"
		>
			{i18n._(heroWords[i])}
		</span>
	);
}

/**
 * Renders the final value by default (so it's correct on the server, without
 * JS, and for crawlers). Once JS is running it resets to 0 and counts up when
 * the number scrolls into view — the reset happens off-screen, so no flash.
 */
function CountUp({ to, dec = 0 }: { to: number; dec?: number }) {
	const [val, setVal] = useState(to);
	const ref = useRef<HTMLSpanElement>(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		setVal(0);
		let started = false;
		const io = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry?.isIntersecting || started) return;
				started = true;
				io.unobserve(el);
				const t0 = performance.now();
				const step = (now: number) => {
					const p = Math.min(1, (now - t0) / 1100);
					const eased = 1 - (1 - p) ** 3;
					setVal(to * eased);
					if (p < 1) requestAnimationFrame(step);
				};
				requestAnimationFrame(step);
			},
			{ threshold: 0.35 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [to]);
	return <span ref={ref}>{val.toFixed(dec)}</span>;
}

/**
 * Stand-in for a product screenshot. Fills its container and labels what will
 * live there, so real assets can be dropped in later.
 */
function Placeholder({ label, className }: { label: string; className?: string }) {
	return (
		<div
			className={cn(
				"flex h-full w-full items-center justify-center bg-muted/40 p-6 text-center",
				className,
			)}
			style={{
				backgroundImage:
					"repeating-linear-gradient(45deg, rgba(128,128,128,0.06) 0, rgba(128,128,128,0.06) 1px, transparent 1px, transparent 11px)",
			}}
		>
			<div className="flex flex-col items-center gap-3">
				<ImageIcon
					className="size-6 text-muted-foreground/50"
					strokeWidth={1.5}
				/>
				<span className="max-w-[24ch] font-mono text-sm uppercase leading-relaxed tracking-[0.16em] text-muted-foreground/70">
					{label}
				</span>
			</div>
		</div>
	);
}

/**
 * A product screenshot — or a muted screen recording — dropped into a panel.
 * App views are wide and multi-column, so we never crop horizontally (which
 * would slice off nav / sidebars):
 *   - Below `sm`: the media shows at its natural height (phones). No fixed
 *     frame, so a wide shot scaled to phone width never leaves dead space.
 *   - `sm` and up: the media is pinned to the top of the fixed-height frame and
 *     bleeds past it, fading into the card — reads as "the app continues below".
 * `fit="cover"` instead fills the frame from the top-left (for pre-cropped,
 * near-square regions). Pass `video` for a screen recording; `src` doubles as
 * its poster (and as the still fallback for reduced-motion or a missing video).
 * Falls back to <Placeholder> when nothing loads, so the page degrades
 * gracefully until real assets land in /public/screenshots.
 */
function Screenshot({
	src,
	video,
	label,
	fit = "width",
	eager = false,
	className,
}: {
	src?: string;
	video?: string;
	label: string;
	fit?: "width" | "cover";
	eager?: boolean;
	className?: string;
}) {
	const [loaded, setLoaded] = useState(false);
	const [reduce, setReduce] = useState(false);
	const [videoFailed, setVideoFailed] = useState(false);
	const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
	useEffect(() => {
		setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
	}, []);
	const showVideo = !!video && !reduce && !videoFailed;
	// onLoad/onLoadedData can fire before hydration (eager/cached media finish
	// during SSR paint), so settle `loaded` on mount too. A <video> paints its
	// poster immediately, so treat it as shown right away.
	useEffect(() => {
		const el = mediaRef.current;
		if (!el) return;
		if (el instanceof HTMLVideoElement) setLoaded(true);
		else setLoaded(el.complete && el.naturalWidth > 0);
	}, [src, showVideo]);

	const mediaClass = cn(
		"block w-full select-none transition-opacity duration-500",
		loaded ? "opacity-100" : "opacity-0",
		fit === "cover"
			? "h-auto sm:absolute sm:inset-0 sm:h-full sm:object-cover sm:object-left-top"
			: "h-auto sm:absolute sm:inset-x-0 sm:top-0",
	);

	return (
		<div
			className={cn(
				"relative w-full overflow-hidden bg-card min-h-[220px] sm:min-h-0 sm:h-full",
				className,
			)}
		>
			{!loaded && <Placeholder label={label} className="absolute inset-0" />}
			{showVideo ? (
				<video
					ref={(el) => {
						mediaRef.current = el;
					}}
					key={video}
					poster={src}
					autoPlay
					muted
					loop
					playsInline
					preload="metadata"
					aria-label={label}
					onLoadedData={() => setLoaded(true)}
					onError={() => setVideoFailed(true)}
					className={mediaClass}
				>
					<source src={video} type="video/mp4" />
				</video>
			) : src ? (
				<img
					ref={(el) => {
						mediaRef.current = el;
					}}
					src={src}
					alt={label}
					loading={eager ? "eager" : "lazy"}
					onLoad={() => setLoaded(true)}
					className={mediaClass}
				/>
			) : null}
			{(showVideo || src) && loaded && fit === "width" && (
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 hidden sm:block [background:linear-gradient(to_bottom,transparent_55%,hsl(var(--card)))]"
				/>
			)}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*  Sections                                                                   */
/* -------------------------------------------------------------------------- */

function Hero() {
	return (
		<section
			id="hero"
			className="relative flex min-h-[calc(100vh-var(--header-height))] flex-col overflow-hidden pt-16 sm:pt-24"
		>
			{/* glow backdrop */}
			<div
				aria-hidden
				className="pointer-events-none absolute left-1/2 top-[-320px] h-[560px] w-[1200px] max-w-full -translate-x-1/2 rounded-full bg-secondary/20 blur-[110px]"
			/>

			<div className={cn(shell, "relative")}>
				<div className="flex items-center gap-3.5 font-mono text-sm uppercase leading-none tracking-[0.2em] text-muted-foreground">
					<span className="text-secondary">ERP</span>
					<span>/</span>
					<span className="text-secondary">MRP</span>
					<span>/</span>
					<span className="text-secondary">MES</span>
					<span>/</span>
					<span className="text-secondary">QMS</span>
					<span className="ml-auto hidden bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5 text-secondary sm:inline uppercase text-[11px]">
						<Trans>Unified system of record</Trans>
					</span>
				</div>

				<h1 className="mt-10 font-display font-semibold tracking-[-0.05em] leading-[0.9] text-balance text-[clamp(2.75rem,8vw,8.5rem)]">
					<Trans>
						Build <CyclingWord />
						<br />
						at the speed of software.
					</Trans>
				</h1>

				<p className="mt-9 max-w-[80ch] text-lg leading-relaxed text-muted-foreground">
					<Trans>
						Carbon is the engineering-first operating system for
						manufacturers. Quote, plan, buy, build, inspect and ship on one
						live model of your factory — from a ten-person prototype shop to a
						rate-production line.
					</Trans>
				</p>

				<HeroDashboard />
			</div>
		</section>
	);
}

function HeroDashboard() {
	const { t } = useLingui();
	return (
		<div className="relative mt-auto pt-16 [perspective:2000px]">
			{/* glowing plane edge */}
			<div
				aria-hidden
				className="mx-[12%] h-px bg-gradient-to-r from-transparent via-secondary to-transparent"
				style={{ boxShadow: "0 0 34px 6px hsl(var(--secondary) / 0.35)" }}
			/>
			<div className="border border-b-0 border-border bg-card px-2.5 pt-2.5">
				<div className="flex items-center justify-between px-2 pb-3 pt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
					
						<Trans>Carbon / Assembly Instructions</Trans>
					
					<span>
						<Trans>Rev 4 · Live</Trans>
					</span>
				</div>
				<div className="relative overflow-hidden border-t border-border sm:h-[min(66vh,740px)]">
					<Screenshot
						className="dark:hidden"
						src="/screenshots/assembly-light.webp"
						video="/screenshots/assembly-light.mp4"
						label={t`Animated assembly instructions`}
						eager
					/>
					<Screenshot
						className="hidden dark:block"
						src="/screenshots/assembly-dark.webp"
						video="/screenshots/assembly-dark.mp4"
						label={t`Animated assembly instructions`}
						eager
					/>
				</div>
			</div>
		</div>
	);
}

function LogoStrip() {
	return (
		<section className="border-y border-border py-16">
			<div className={cn(shell, "flex flex-col gap-8")}>
				<div className="font-mono text-[11px] text-center uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
					<Trans>Trusted by the world's most innovative</Trans>
				</div>
				<div
					className="group relative flex w-full items-center overflow-hidden [--marquee-gap:4rem]"
					style={{
						maskImage:
							"linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
						WebkitMaskImage:
							"linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
					}}
				>
					<div className="flex w-max shrink-0 animate-marquee items-center gap-[--marquee-gap] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
						{[...customers, ...customers].map((c, index) => (
							<a
								key={`${c.name}-${index}`}
								href={c.url}
								target="_blank"
								rel="noreferrer"
								aria-hidden={index >= customers.length}
								tabIndex={index >= customers.length ? -1 : undefined}
								className="flex h-10 shrink-0 items-center justify-center"
							>
								<img
									alt={c.name}
									src={c.logo}
									className={cn(
										"h-auto max-h-8 w-24 object-contain opacity-70 transition-opacity hover:opacity-100",
										c.tone === "light" ? "invert dark:invert-0" : "dark:invert",
									)}
								/>
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function StatusQuo() {
	const { i18n } = useLingui();
	return (
		<section id="platform" className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<Reveal className="flex flex-wrap items-end justify-between gap-10">
					<div>
						<h2 className={cn(heading, "mt-5 max-w-[22ch]")}>
							<Trans>Legacy ERPs were built for accountants in the 1990s.</Trans>
						</h2>
					</div>
				</Reveal>

				<Reveal className="mt-14 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
					{statusQuo.map((col) => (
						<div
							key={col.id}
							className={cn(
								"flex flex-col p-8",
								col.accent
									? "bg-muted shadow-[inset_2px_0_0] shadow-secondary"
									: "bg-card dark:bg-background",
							)}
						>
							<div
								className={cn(
									"mt-4 pb-6 text-xl font-medium",
									col.accent ? "text-secondary" : "text-foreground",
								)}
							>
								{i18n._(col.name)}
							</div>
							<ul
								role="list"
								className={cn("flex flex-col divide-y divide-border/60", col.accent && "divide-secondary/20")}
							>
								{col.rows.map((row, rowIndex) => (
									<li
										key={rowIndex}
										className={cn(
											"flex items-start gap-3 py-4 text-[15px] leading-relaxed first:pt-0 last:pb-0",
											col.accent
												? "text-foreground"
												: "text-muted-foreground",
										)}
									>
										{col.accent ? (
											<Check
												className="mt-1 size-4 shrink-0 text-secondary"
												strokeWidth={2.5}
											/>
										) : (
											<X
												className="mt-1 size-4 shrink-0 text-muted-foreground/40"
												strokeWidth={2}
											/>
										)}
										<span>{i18n._(row)}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</Reveal>
			</div>
		</section>
	);
}

function OneModel() {
	const { i18n } = useLingui();
	const [active, setActive] = useState(0);
	// Auto-rotate through the systems every 3s until the visitor picks one.
	const [paused, setPaused] = useState(false);
	useEffect(() => {
		if (paused) return;
		const id = setInterval(
			() => setActive((v) => (v + 1) % modules.length),
			3000,
		);
		return () => clearInterval(id);
	}, [paused]);
	const mod = modules[active];
	const modName = i18n._(mod.name);
	return (
		<section id="modules" className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<Reveal>
					<h2 className={cn(heading, "mt-5 max-w-[26ch]")}>
						<Trans>Four systems, one schema. Nothing to integrate.</Trans>
					</h2>
				</Reveal>

				<div className="mt-12 grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-2">
					{/* left — the four systems, stacked */}
					<div className="grid auto-rows-fr grid-cols-1 gap-px bg-border">
						{modules.map((m, i) => (
							<button
								key={m.code}
								type="button"
								onClick={() => {
									setPaused(true);
									setActive(i);
								}}
								className={cn(
									"p-6 text-left transition-colors",
									i === active
										? "bg-muted text-foreground shadow-[inset_2px_0_0] shadow-secondary"
										: "bg-card text-muted-foreground hover:text-foreground",
								)}
							>
								<div className="font-mono text-[10px] uppercase leading-none tracking-[0.18em]">
									{m.code}
								</div>
								<div className="mt-3 text-[17px] font-medium">
									{i18n._(m.name)}
								</div>
								<div className="mt-2 font-mono text-xs text-muted-foreground">
									{i18n._(m.note)}
								</div>
							</button>
						))}
					</div>

					{/* right — the selected system's features */}
					<div className="bg-card p-7">
						<div className="font-mono text-[10px] uppercase leading-none tracking-[0.18em] text-muted-foreground">
							{mod.code} · {modName}
						</div>
						<div className="mt-5 flex flex-col">
							{mod.rows.map((row, i) => (
								<div
									key={i}
									className="flex items-baseline gap-2.5 border-b border-border/60 py-3 text-sm transition-colors hover:text-secondary"
								>
									<span className="font-mono text-[10px] leading-none text-muted-foreground">
										{String(i + 1).padStart(2, "0")}
									</span>
									<span>{i18n._(row)}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function HappyPath() {
	const { i18n } = useLingui();
	return (
		<section className="overflow-hidden border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<Reveal className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<h2 className={cn(heading, "mt-5")}>
							<Trans>CAD to cash, unbroken.</Trans>
						</h2>
					</div>
					<p className="max-w-[38ch] text-base leading-relaxed text-muted-foreground">
						<Trans>
							Every stage writes to the same record. No handoffs, no re-keying,
							no reconciliation.
						</Trans>
					</p>
				</Reveal>

				<div className="relative mt-16 border-t border-border">
					<div className="absolute left-0 top-[-2px] h-[3px] w-32 animate-cb-flow bg-gradient-to-r from-transparent to-secondary" />
					<div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-10">
						{stages.map((s, i) => (
							<div
								key={i}
								className="bg-background px-4 pb-6 pt-5 transition-colors hover:bg-muted"
							>
								<div className="font-mono text-[10px] leading-none text-secondary">
									{String(i + 1).padStart(2, "0")}
								</div>
								<div className="mt-3.5 text-[15px] font-medium">
									{i18n._(s.name)}
								</div>
								<div className="mt-2 font-mono text-xs leading-snug text-muted-foreground">
									{i18n._(s.note)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function FeatureRows() {
	const { i18n } = useLingui();
	return (
		<section className="border-b border-border py-28 sm:py-32">
			<div className={cn(shell, "flex flex-col gap-24 lg:gap-32")}>
				{featureRows.map((f) => {
					const shotLight = "shotLight" in f ? f.shotLight : undefined;
					const shotDark = "shotDark" in f ? f.shotDark : undefined;
					return (
					<Reveal
						key={f.id}
						className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14"
					>
						<div className={cn(f.flip && "lg:order-2")}>
							<div className={eyebrow}>{i18n._(f.eyebrow)}</div>
							<h3 className="mt-5 font-display font-semibold tracking-[-0.03em] leading-[0.98] text-[clamp(1.75rem,3vw,2.625rem)]">
								{i18n._(f.title)}
							</h3>
							<p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
								{i18n._(f.body)}
							</p>
							<div className="mt-7 flex flex-col gap-2.5 font-mono text-[13px] leading-snug text-muted-foreground">
								{f.points.map((p, i) => (
									<div key={i}>→ {i18n._(p)}</div>
								))}
							</div>
						</div>
						<div
							className={cn(
								"relative overflow-hidden border border-border bg-card p-2.5",
								f.flip && "lg:order-1",
							)}
						>
							<div className="relative overflow-hidden sm:h-[min(52vh,480px)]">
								{shotLight && shotDark ? (
									<>
										<Screenshot
											className="dark:hidden"
											src={shotLight}
											label={i18n._(f.shotLabel)}
										/>
										<Screenshot
											className="hidden dark:block"
											src={shotDark}
											label={i18n._(f.shotLabel)}
										/>
									</>
								) : (
									<Screenshot label={i18n._(f.shotLabel)} />
								)}
							</div>
						</div>
					</Reveal>
					);
				})}
			</div>
		</section>
	);
}


function Agents() {
	const { i18n } = useLingui();
	return (
		<section id="developers" className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<Reveal className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<h2 className={cn(heading, "mt-5 max-w-[40ch]")}>
							<Trans>An API for the entire organization.</Trans>
						</h2>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button asChild variant="accent" size="cta">
							<a
								href="https://docs.carbon.ms/api-reference"
								target="_blank"
								rel="noopener"
							>
								<Trans>API Docs</Trans>
								<Book />
							</a>
						</Button>
						<Button asChild variant="accentOutline" size="cta">
							<a
								href="https://docs.carbon.ms/mcpt"
								target="_blank"
								rel="noopener"
							>
								<Trans>MCP Docs</Trans>
								<ChevronRight />
							</a>
						</Button>
					</div>
				</Reveal>

				<Reveal className="mt-14 grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-3">
					{devPillars.map((p) => (
						<div
							key={p.tag}
							className="flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-muted"
						>
							<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
								<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
									{p.tag}
								</span>
							</div>
							<div className="text-xl font-medium">{i18n._(p.name)}</div>
							<div className="text-sm leading-relaxed text-muted-foreground">
								{i18n._(p.desc)}
							</div>
						</div>
					))}
				</Reveal>

				<Reveal>
					<CodeExamples className="border-t-0" />
				</Reveal>
			</div>
		</section>
	);
}

function Industries() {
	const { i18n } = useLingui();
	return (
		<section id="industries" className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<Reveal className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<h2 className={cn(heading, "mt-5 max-w-[22ch]")}>
							<Trans>If it has a bill of materials, Carbon runs it.</Trans>
						</h2>
					</div>
					<p className="max-w-[38ch] text-base leading-relaxed text-muted-foreground">
						<Trans>
							Regulated or not, one-off or rate production — the primitives are
							the same. The configuration is yours.
						</Trans>
					</p>
				</Reveal>

				<Reveal className="mt-14 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-3 lg:grid-cols-5">
					{industries.map((ind) => (
						<div
							key={ind.n}
							className="flex min-h-[158px] flex-col gap-3 bg-card px-6 pb-8 pt-6 transition-colors hover:bg-muted"
						>
							<div className="font-mono text-[10px] leading-none text-muted-foreground">
								{ind.n}
							</div>
							<div className="text-[19px] font-medium tracking-[-0.01em] leading-tight">
								{i18n._(ind.name)}
							</div>
							<div className="font-mono text-xs leading-normal text-muted-foreground">
								{i18n._(ind.note)}
							</div>
						</div>
					))}
				</Reveal>
			</div>
		</section>
	);
}

const AUDIT_PROMPT = `I'm deciding whether Carbon would be the approach for my manufacturing business. Download the repo https://github.com/crbnos/carbon and do an audit of the capabilities. Then interview me about my manufacturing process, goals, and tools I use. Finish with 3-5 specific things Carbon could do for me.`;

/**
 * A read-only prompt the visitor can copy in one click and paste into their
 * LLM of choice. Purely client-side; degrades to a selectable block if the
 * clipboard API is unavailable.
 */
function CopyPrompt({ prompt }: { prompt: string }) {
	const [copied, setCopied] = useState(false);
	useEffect(() => {
		if (!copied) return;
		const id = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(id);
	}, [copied]);
	return (
		<div className="relative mt-7 border border-border bg-card">
			<button
				type="button"
				onClick={() => {
					navigator.clipboard?.writeText(prompt).then(
						() => setCopied(true),
						() => {},
					);
				}}
				className="absolute right-2 top-2 inline-flex items-center gap-1.5 border border-border bg-background px-2.5 py-1.5 font-mono text-[10px] uppercase leading-none tracking-wide text-muted-foreground transition-colors hover:text-foreground"
			>
				{copied ? (
					<Check className="size-3 text-secondary" strokeWidth={2.5} />
				) : (
					<Copy className="size-3" strokeWidth={2} />
				)}
				{copied ? <Trans>Copied</Trans> : <Trans>Copy</Trans>}
			</button>
			<pre className="max-h-[280px] overflow-auto whitespace-pre-wrap px-4 py-4 pr-16 font-mono text-xs leading-[1.7] text-muted-foreground">
				{prompt}
			</pre>
		</div>
	);
}

function TrustOpen() {
	const { i18n } = useLingui();
	return (
		<section id="open" className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<Reveal className="grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-2">
					<div className="bg-card p-10 sm:p-11">
						<div className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-secondary">
							<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
								<Trans>Trusted</Trans>
							</span>
						</div>
						<h3 className="mt-5 font-display font-semibold tracking-[-0.03em] leading-[1] text-[clamp(1.625rem,2.6vw,2.375rem)]">
							<Trans>Auditable by construction.</Trans>
						</h3>
						<p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
							<Trans>
								Immutable ledgers, granular permissions, and the
								controls regulated programs are held to.
							</Trans>
						</p>
						<div className="mt-7 flex flex-wrap gap-2">
							{compliance.map((c, i) => (
								<span
									key={i}
									className="border border-border px-3.5 py-2.5 font-mono text-[11px] uppercase leading-none text-muted-foreground"
								>
									{i18n._(c)}
								</span>
							))}
						</div>
					</div>

					<div className="bg-muted p-10 sm:p-11">
						<div className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-secondary">
							<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
								<Trans>Source available</Trans>
							</span>
						</div>
						<h3 className="mt-5 font-display font-semibold tracking-[-0.03em] leading-[1] text-[clamp(1.625rem,2.6vw,2.375rem)]">
							<Trans>Ask your agent what it thinks</Trans>
						</h3>
						<p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
							<Trans>
								Carbon's source code is available. Copy the prompt below into your favorite LLM.
							</Trans>
						</p>
						<CopyPrompt prompt={AUDIT_PROMPT} />
						<div className="mt-7 flex flex-wrap gap-6 font-mono text-xs uppercase leading-none text-muted-foreground">
							<span>TypeScript</span>
							<span>React</span>
							<span>Postgres</span>
							<span>RLS</span>
							<span>REST + Webhooks</span>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}

function Integrations() {
	const { i18n } = useLingui();
	return (
		<section className="border-b border-border py-24">
			<div className={shell}>
				<Reveal>
					<h2 className="mb-12 mt-5 font-display font-semibold tracking-[-0.03em] leading-[0.98] text-[clamp(1.75rem,3vw,2.75rem)]">
						<Trans>Integrated with the world's best software.</Trans>
					</h2>
				</Reveal>
				<Reveal className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
					{integrations.map((itg) => (
						<div
							key={itg.name}
							className="flex items-center justify-between gap-2.5 bg-card p-5 font-mono text-[13px] leading-none text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							<span>{itg.name}</span>
							<span className="text-[10px] text-muted-foreground">
								{i18n._(itg.kind)}
							</span>
						</div>
					))}
				</Reveal>
			</div>
		</section>
	);
}

function StartCTA() {
	return (
		<section id="start" className="relative overflow-hidden py-32 sm:py-36">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						"linear-gradient(rgba(128,128,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.06) 1px, transparent 1px)",
					backgroundSize: "56px 56px",
					maskImage:
						"radial-gradient(90% 90% at 50% 50%, #000 10%, transparent 72%)",
					WebkitMaskImage:
						"radial-gradient(90% 90% at 50% 50%, #000 10%, transparent 72%)",
				}}
			/>
			<div className="relative mx-auto max-w-[1000px] px-6 text-center">
				<div className={eyebrow}>
					<Trans>Start now · No call required</Trans>
				</div>
				<h2 className="mt-6 font-display font-semibold tracking-[-0.045em] leading-[0.96] text-[clamp(2.5rem,6vw,5.5rem)]">
					<Trans>Ship faster than your competitors can quote.</Trans>
				</h2>
				<p className="mx-auto mt-6 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
					<Trans>
						Create a company, connect the MCP, release your first job
						today.
					</Trans>
				</p>
				<div className="mt-10 flex flex-wrap justify-center gap-2.5">
					<Button asChild variant="accentOutline" size="cta">
						<a href={APP_URL}>
							<Trans>Start Free</Trans>
						</a>
					</Button>
					<Button asChild variant="accent" size="cta">
						<Link to="/sales">
							<Trans>Contact Sales</Trans>
						</Link>
					</Button>
				</div>
				<div className="mt-5 font-mono text-[11px] uppercase leading-none text-muted-foreground">
					<a href={GITHUB_URL} target="_blank" rel="noopener">
						<Trans>Or self-host the open source core</Trans>
					</a>
				</div>
			</div>
		</section>
	);
}

export default function Route() {
	return (
		<>
			<Hero />
			<LogoStrip />
			<HappyPath />
			<FeatureRows />
			<StatusQuo />
			<OneModel />
			<Industries />
			<TrustOpen />
			<Agents />
			<Integrations />
			<StartCTA />
		</>
	);
}
