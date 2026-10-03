import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowRight, Book, Check, ChevronRight, Copy, X } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import { AppCtaLabel } from "~/components/app-cta-label";
import { CodeExamples } from "~/components/code-examples";
import { EntityTree } from "~/components/entity-tree";
import { LogoStrip } from "~/components/logo-strip";
import { Screenshot } from "~/components/screenshot";
import { Button } from "~/components/ui/button";
import { ZoomableImage } from "~/components/zoomable-image";
import { cn } from "~/lib/utils";
import { pageMeta } from "~/lib/seo";

// The home route shipped no `meta`, so it inherited root's default title
// ("Carbon Manufacturing Systems") — a bare brand name with no keyword signal,
// identical to /pricing, /contact and others. A keyword-led title that already
// names the product (so `pageMeta` adds no suffix) gives the most important
// page its own SERP entry.
export const meta: MetaFunction = ({ matches }) =>
	pageMeta(matches, {
		title: "Carbon — Manufacturing ERP, MRP, MES & QMS",
		description:
			"Carbon is an open-source manufacturing system for ERP, MRP, MES and QMS. Plan materials, run production, manage quality and track costs on one data model.",
	});

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */
//
// User-facing copy in these module-level constants is wrapped in the `msg`
// macro, which produces a lazy MessageDescriptor (not a translated string).
// Each descriptor is resolved to the active locale at render time via
// `useLingui().i18n._(descriptor)`. Brand names, acronym codes (ERP/MRP/…),
// URLs and other proper nouns are left as plain strings on purpose.

const statusQuo = [
	{
		id: "spreadsheet",
		name: msg`Spreadsheets`,
		rows: [
			msg`Plans depend on manual inputs`,
			msg`Shortages surface during production`,
			msg`Actual costs arrive after the job`,
			msg`Revisions move through email`,
			msg`No serial-level history`,
			msg`Audit records must be reconstructed`,
		],
	},
	{
		id: "legacy",
		name: msg`Legacy ERP`,
		rows: [
			msg`Designed around accounting`,
			msg`18-month implementation`,
			msg`Consultants required for changes`,
			msg`BOMs re-keyed by hand`,
			msg`Printed travelers become stale`,
			msg`Quality runs in a separate system`,
		],
	},
	{
		id: "carbon",
		name: msg`Carbon`,
		accent: true,
		rows: [
			msg`Manufacturing workflows with GAAP accounting`,
			msg`ERP, MRP, MES and QMS share one schema`,
			msg`Deploy in weeks`,
			msg`REST API, webhooks and MCP`,
			msg`Serial traceability and actual COGS`,
			msg`Audit history stored with each record`,
		],
	},
];

const modules = [
	{
		code: "ERP",
		shot: "sales-order",
		name: msg`Inventory & Costing`,
		note: msg`orders, inventory and actual costs`,
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
		note: msg`materials, capacity and schedules`,
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
		note: msg`operators, jobs and work centers`,
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
		note: msg`inspection, compliance and genealogy`,
		rows: [
			msg`First article inspection`,
			msg`Non-conformance & CAPA`,
			msg`Gauge calibration`,
			msg`Serial & lot genealogy`,
			msg`Supplier scorecards`,
			msg`Certificates of conformance`,
		],
	},
	{
		code: "CMMS",
		shot: "maintenance",
		name: msg`Maintenance`,
		note: msg`preventive and reactive maintenance`,
		rows: [
			msg`Preventive maintenance schedules`,
			msg`Reactive maintenance dispatches`,
			msg`Work center downtime`,
			msg`Technician labor tracking`,
			msg`Spare parts consumption`,
			msg`Dispatch notifications`,
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
		value: 5,
		label: msg`Systems replaced`,
		sub: msg`ERP · MRP · MES · QMS · CMMS`,
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
		name: msg`A generated API for every module`,
		desc: msg`Carbon generates REST endpoints from its schema and publishes typed clients for TypeScript, Python and C#. Use webhooks for event-driven integrations.`,
	},
	{
		tag: "MCP server",
		name: msg`A permission-aware MCP server`,
		desc: msg`The built-in MCP server exposes Carbon operations to AI agents. Every request uses the permissions of the authenticated identity.`,
	},
	{
		tag: "Open source",
		name: msg`Inspect and extend the code`,
		desc: msg`The TypeScript monorepo shares generated database types across the application, API and agent tools. Run Carbon with your own models and infrastructure.`,
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
	{ name: "SolidWorks", kind: msg`CAD` },
	{ name: "Ramp", kind: msg`Expenses` },
	{ name: "Linear", kind: msg`Tasks` },
	{ name: "Jira", kind: msg`Tasks` },
	{ name: "Slack", kind: msg`Chat` },
	{ name: "Paperless Parts", kind: msg`Quoting` },
	{ name: "Stripe", kind: msg`Billing` },
	{ name: "Rillet", kind: msg`Finance` },
	{ name: "Xero", kind: msg`Finance` },
	{ name: "Brother", kind: msg`Printer` },
	{ name: "Zebra ZPL", kind: msg`Printer` },
	{ name: "ProxyBox", kind: msg`Printer` },
	{ name: "REST and Webhooks", kind: msg`API` },
	{ name: "Claude", kind: msg`LLM` },
	{ name: "ChatGPT", kind: msg`LLM` },
];

const featureRows = [
	{
		id: "configure",
		eyebrow: msg`Configure to order`,
		title: msg`Generate each configuration from rules.`,
		body: msg`Define product parameters once. Carbon generates the BOM, routing and quoted price for each valid configuration.`,
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
		title: msg`Run production from live data.`,
		body: msg`Track material, labor, scans, scrap and deviations as work happens. Schedules and job costs update from the same records.`,
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
		title: msg`Trace every unit to its source.`,
		body: msg`Link first articles, nonconformances, CAPAs and calibrations to production. Open any serial number to see its materials, operators, measurements and deviations.`,
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
		title: msg`Manage every site on one ledger.`,
		body: msg`Run one facility or multiple legal entities and locations. Carbon handles entity-specific currencies, charts of accounts and taxes with consolidated reporting.`,
		points: [
			msg`Multi-entity accounting with intercompany transactions`,
			msg`Per-entity currency, COA and tax, consolidated books`,
			msg`Multi-location planning with inter-site transfers`,
		],
		shotLabel: msg`Multi-entity ledger / multi-site planning`,
		shot: "multi-entity",
		diagram: "entity-tree",
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
	"font-display tracking-[-0.015em] text-[clamp(2.125rem,4.4vw,3.875rem)] leading-[1.08]";

/** The page's two calls to action, repeated through most sections. */
function TrialActions({ className }: { className?: string }) {
	return (
		<div className={cn("flex flex-wrap gap-2.5", className)}>
			<Button asChild variant="accent" size="cta">
				<a href={APP_URL}>
					<AppCtaLabel signupLabel={<Trans>Start 30-Day Trial</Trans>} />
				</a>
			</Button>
			<Button asChild variant="accentOutline" size="cta">
				<Link to="/sales">
					<Trans>Talk to a Human</Trans>
				</Link>
			</Button>
		</div>
	);
}

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

/* -------------------------------------------------------------------------- */
/*  Sections                                                                   */
/* -------------------------------------------------------------------------- */

function Hero() {
	return (
		<section
			id="hero"
			className="relative overflow-hidden pt-24 sm:pt-36 lg:pt-44"
		>
			{/* Tighter gutter at 320px and below so the headline keeps its width.
			    Raw media query, not max-[320px]: — the `tall` raw screen in
			    tailwind.config.js suppresses Tailwind's min and max variants. */}
			<div
				className={cn(
					shell,
					"relative text-center [@media(max-width:320px)]:px-4",
				)}
			>
				<Link
					to="/self-hosted"
					className="group mb-8 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
				>
					<span aria-hidden className="relative flex size-1.5">
						<span className="absolute inline-flex size-full rounded-full bg-secondary opacity-75 motion-safe:animate-ping" />
						<span className="relative inline-flex size-1.5 rounded-full bg-secondary" />
					</span>
					<Trans>Deploy in our cloud, your cloud or on-prem</Trans>
					<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
				</Link>

				<h1 className="font-display tracking-[-0.025em] text-balance text-[clamp(2.75rem,6.2vw,6.25rem)] leading-[1.06] [@media(max-width:374px)]:text-[2.5rem]">
					{/* The break only applies from sm up; below that, text-balance
					    wraps the line evenly. */}
					<Trans>
						Build hardware at the{" "}
						<br className="hidden sm:inline" />
						<span className="text-secondary">speed of software</span>
					</Trans>
				</h1>

				<p className="mx-auto mt-8 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
					<Trans>
						Carbon combines ERP, MRP, MES and QMS. Plan materials, run the
						shop floor, manage quality and track actual costs in one system.
					</Trans>
				</p>

				<TrialActions className="mt-10 justify-center" />
			</div>

			<div className={cn(shell, "mt-32 sm:mt-44")}>
				<HeroDashboard />
			</div>
		</section>
	);
}

function HeroDashboard() {
	const { t } = useLingui();
	return (
		<div className="relative [perspective:2000px]">
			{/* glowing plane edge: an elliptical bloom centered on the edge line;
			    the card paints over its lower half */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-[4%] top-0 h-48 -translate-y-1/2"
				style={{
					background:
						"radial-gradient(50% 50% at 50% 50%, hsl(var(--secondary) / 0.18), transparent)",
				}}
			/>
			<div
				aria-hidden
				className="relative mx-[12%] h-px bg-gradient-to-r from-transparent via-secondary to-transparent"
			/>
			<div className="relative border border-b-0 border-border bg-card">
				<div className="relative overflow-hidden sm:h-[min(66vh,740px)]">
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

function Testimonial() {
	return (
		<section id="testimonial" className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<Reveal className="mx-auto max-w-3xl">
					<figure className="border border-border bg-card">
						<div className="flow-root p-8 sm:p-12">
							<svg
								aria-hidden
								viewBox="0 0 46 36"
								className="float-left mt-1.5 mr-4 mb-1 h-auto w-[52px] fill-secondary sm:mr-5 sm:w-[72px]"
							>
								<path d="M0 36V22C0 10 6 2 18 0l2 5c-7 2-10 7-10 12h10v19Z" />
								<path d="M26 36V22c0-12 6-20 18-22l2 5c-7 2-10 7-10 12h10v19Z" />
							</svg>
							<blockquote className="text-pretty text-xl text-foreground sm:text-[1.5rem] sm:leading-[1.5] leading-[1.55]">
								<Trans>
									Best ERP/MRP/MES system I've ever seen in a 22-year career
									across defense and automotive. Native Onshape integration
									means we synchronize all our data without extra PLM connectors
									— good UX, modern integrations, open source, open API and MCP,
									cloud or on-prem. We run our whole electric-vehicle
									engineering and manufacturing business on Carbon, and I
									couldn't imagine going back to a legacy system.
								</Trans>
							</blockquote>
						</div>
						<figcaption className="flex items-center gap-4 border-t border-border px-8 py-6 sm:px-12">
							<img
								src="/faces/liam.jpeg"
								alt="Liam Sill"
								className="size-12 shrink-0 rounded-full corner-squircle object-cover ring-1 ring-border"
							/>
							<div>
								<div className="font-display text-2xl leading-tight text-foreground">
									Liam Sill
								</div>
								<div className="mt-1 font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-muted-foreground">
									CTO · Minimal
								</div>
							</div>
							<img
								src="/logos/minimal.svg"
								alt="Minimal"
								className="ml-auto h-5 w-auto shrink-0 opacity-50 dark:invert"
							/>
						</figcaption>
					</figure>
				</Reveal>
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
							<Trans>Replace spreadsheets and disconnected systems.</Trans>
						</h2>
					</div>
					<TrialActions />
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
				<Reveal className="flex flex-wrap items-end justify-between gap-8">
					<h2 className={cn(heading, "mt-5 max-w-[26ch]")}>
						<Trans>Five systems, one database.</Trans>
					</h2>
					<TrialActions />
				</Reveal>

				<div className="mt-12 grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-2">
					{/* left — the five systems, stacked */}
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
								<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
									<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
										{m.code}
									</span>
								</div>
								<div className="mt-4 text-[17px] font-medium">
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
							<Trans>One record from CAD to cash.</Trans>
						</h2>
						<p className="mt-6 max-w-[38ch] text-base leading-relaxed text-muted-foreground">
							<Trans>
								Engineering, planning, production, quality and accounting update
								the same data. No re-keying or cross-system reconciliation.
							</Trans>
						</p>
					</div>
					<TrialActions />
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
					const diagram = "diagram" in f ? f.diagram : undefined;
					return (
					<Reveal
						key={f.id}
						className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14"
					>
						<div className={cn(f.flip && "lg:order-2")}>
							<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
								<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
									{i18n._(f.eyebrow)}
								</span>
							</div>
							<h3 className="mt-5 font-display tracking-[-0.01em] text-[clamp(1.75rem,3vw,2.625rem)] leading-[1.1]">
								{i18n._(f.title)}
							</h3>
							<p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
								{i18n._(f.body)}
							</p>
							<div className="mt-7 flex flex-col gap-2.5 text-sm leading-snug text-muted-foreground">
								{f.points.map((p, i) => (
									<div key={i}>→ {i18n._(p)}</div>
								))}
							</div>
						</div>
						<div
							className={cn(
								"relative overflow-hidden border border-border bg-screenshot p-2.5",
								f.flip && "lg:order-1",
							)}
						>
							<div className="relative overflow-hidden sm:h-[min(52vh,480px)]">
								{diagram === "entity-tree" ? (
									<EntityTree label={i18n._(f.shotLabel)} />
								) : shotLight && shotDark ? (
									<>
										<ZoomableImage
											className="dark:hidden"
											src={shotLight}
											alt={i18n._(f.shotLabel)}
										>
											<Screenshot
												src={shotLight}
												label={i18n._(f.shotLabel)}
											/>
										</ZoomableImage>
										<ZoomableImage
											className="hidden dark:block"
											src={shotDark}
											alt={i18n._(f.shotLabel)}
										>
											<Screenshot
												src={shotDark}
												label={i18n._(f.shotLabel)}
											/>
										</ZoomableImage>
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
		<section
			id="developers"
			className="theme-invert border-b border-border bg-background py-28 text-foreground sm:py-32"
		>
			<div className={shell}>
				<Reveal className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<h2 className={cn(heading, "mt-5 max-w-[40ch]")}>
							<Trans>Integrate every manufacturing workflow.</Trans>
						</h2>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button asChild variant="accent" size="cta">
							<a
								href="https://docs.carbon.ms/api/mcp"
								target="_blank"
								rel="noopener"
							>
								<Trans>MCP Docs</Trans>
								<Book />
							</a>
						</Button>
						<Button asChild variant="accentOutline" size="cta">
							<a
								href="https://docs.carbon.ms/api"
								target="_blank"
								rel="noopener"
							>
								<Trans>API Docs</Trans>
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
					<CodeExamples className="border-t-0" inverted />
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
							<Trans>Built for discrete manufacturing.</Trans>
						</h2>
					</div>
					<p className="max-w-[38ch] text-base leading-relaxed text-muted-foreground">
						<Trans>
							Configure Carbon for one-off builds, rate production and regulated
							work without changing the underlying data model.
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

const AUDIT_PROMPT = `Evaluate Carbon for my manufacturing business. Review the repository at https://github.com/crbnos/carbon and summarize its relevant capabilities and constraints. Then ask about my products, production process, compliance requirements, current systems, and goals. Finish with 3–5 specific ways Carbon could fit my operation.`;

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
						<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
							<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
								<Trans>Trusted</Trans>
							</span>
						</div>
						<h3 className="mt-5 font-display tracking-[-0.01em] text-[clamp(1.625rem,2.6vw,2.375rem)] leading-[1.1]">
							<Trans>Controls built into the data model.</Trans>
						</h3>
						<p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
							<Trans>
								Use append-only ledgers, granular permissions and complete record
								history to support regulated workflows.
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
						<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
							<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
								<Trans>Open source</Trans>
							</span>
						</div>
						<h3 className="mt-5 font-display tracking-[-0.01em] text-[clamp(1.625rem,2.6vw,2.375rem)] leading-[1.1]">
							<Trans>Evaluate the source before you deploy</Trans>
						</h3>
						<p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
							<Trans>
								Carbon's source is public. Use the prompt below to review it against
								your requirements.
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

const selfHostPillars = [
	{
		tag: "CMMC · ITAR",
		name: msg`Keep regulated data in your boundary`,
		desc: msg`Deploy in your VPC, on-prem or fully air-gapped. Keep CUI inside infrastructure you control while supporting CMMC and ITAR requirements.`,
	},
	{
		tag: "Your database",
		name: msg`Control the system of record`,
		desc: msg`ERP, MRP, MES and QMS share a Postgres database with row-level security. You control its network, encryption, backups and retention.`,
	},
	{
		tag: "Open source",
		name: msg`Review the code before deployment`,
		desc: msg`Inspect the application on GitHub, run your own security review and extend the AGPL-3.0 Community edition for your process.`,
	},
];

function SelfHost() {
	const { i18n } = useLingui();
	return (
		<section
			id="self-hosted"
			className="theme-invert border-b border-border bg-background py-28 text-foreground sm:py-32"
		>
			<div className={shell}>
				<Reveal className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
							<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
								<Trans>Self-hosted</Trans>
							</span>
						</div>
						<h2 className={cn(heading, "mt-6 max-w-[22ch]")}>
							<Trans>Run Carbon on infrastructure you control.</Trans>
						</h2>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button asChild variant="accent" size="cta">
							<Link to="/self-hosted">
								<Trans>Explore Self-Hosting</Trans>
								<ChevronRight />
							</Link>
						</Button>
						<Button asChild variant="accentOutline" size="cta">
							<a href={GITHUB_URL} target="_blank" rel="noopener">
								<Trans>View the Source</Trans>
							</a>
						</Button>
					</div>
				</Reveal>

				<Reveal className="mt-14 grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-3">
					{selfHostPillars.map((p) => (
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
					<h2 className="mb-12 mt-5 font-display tracking-[-0.01em] text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
						<Trans>Connect the tools your teams already use.</Trans>
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
					<Trans>30-day trial · No sales call</Trans>
				</div>
				<h2 className="mt-6 font-display tracking-[-0.02em] text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.08]">
					<Trans>Ship faster than your competitors can quote.</Trans>
				</h2>
				<p className="mx-auto mt-6 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
					<Trans>
						Create a workspace, import your data and connect your integrations.
						Self-host the open-source core or use the managed cloud.
					</Trans>
				</p>
				<TrialActions className="mt-10 justify-center" />
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
			<LogoStrip
				headline={<Trans>Hard tech unicorns build on Carbon.</Trans>}
				label={
					<Trans>And some of the world's most innovative manufacturers</Trans>
				}
			/>
			<Testimonial />
			<HappyPath />		
			<FeatureRows />
			<StatusQuo />
			<SelfHost />
			<OneModel />
			<Industries />
			<TrustOpen />
			<Agents />
			<Integrations />
			<StartCTA />
		</>
	);
}
