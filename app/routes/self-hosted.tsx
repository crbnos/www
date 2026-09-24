import { Trans } from "@lingui/react/macro";
import { Check, ChevronRight, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import { LogoStrip } from "~/components/logo-strip";
import { Screenshot } from "~/components/screenshot";
import { Button } from "~/components/ui/button";
import { GithubLogo } from "~/components/ui/github-logo";
import { ZoomableImage } from "~/components/zoomable-image";
import { cn } from "~/lib/utils";
import { pageMeta } from "~/lib/seo";
import { REPO_URL, SITE_URL } from "~/lib/agent/site";

/**
 * The self-hosting surface, at a predictable URL, named the way a buyer in a
 * regulated program would search for it ("self-hosted manufacturing ERP",
 * "on-prem MES", "air-gapped ERP"). Everything here is true of Carbon as
 * shipped: it's open core (Community edition AGPL-3.0, Enterprise features and
 * air-gapped licensing under a commercial license), the stack is Docker +
 * Postgres, and the whole backend is reachable over REST and MCP. The page
 * reuses the home page's screenshot panels and customer strip so it reads as
 * the same product, then layers on the self-hosting story on top.
 */

const DESCRIPTION =
	"Own the stack: run Carbon on your own infrastructure — on-prem, in your VPC, or fully air-gapped. ERP, MRP, MES and QMS on Postgres you own, source available, with an AGPL-3.0 Community edition.";

const DOCS_URL = "https://docs.carbon.ms";

/* -------------------------------------------------------------------------- */
/*  FAQ (shared by the rendered section and the FAQPage JSON-LD)               */
/* -------------------------------------------------------------------------- */

const faqs = [
	{
		q: "Is Carbon open source?",
		a: "Yes. The Community edition — the core ERP, MRP, MES and QMS — is on GitHub under AGPL-3.0 and free to self-host. A private fork is fine under AGPL-3.0. You need a commercial license to use Enterprise features, or to keep your changes private from the people who use your modified version (AGPL-3.0 requires you to offer them the source). Either way, every line is in the public repository, so you can audit it before you deploy.",
	},
	{
		q: "Does Carbon help with CMMC compliance?",
		a: "Yes. Self-hosting Carbon keeps your CUI inside your own boundary, which is the foundation of a CMMC and NIST 800-171 program. When you run Carbon on our bring-your-own-cloud (BYOC) infrastructure, we guarantee the deployment is audit-ready and provide the compliance artifacts an assessor asks for — a System Security Plan (SSP), a Plan of Action & Milestones (POA&M), and the SPRS score inputs — mapped to how Carbon runs in your cloud.",
	},
	{
		q: "Can Carbon run fully air-gapped?",
		a: "Yes, with an Enterprise license. Carbon runs on Docker against a Postgres database you control, and air-gapped licensing lets it run inside a restricted network with no outbound calls — built for classified and ITAR-restricted programs.",
	},
	{
		q: "Is the self-hosted version the same as the cloud?",
		a: "It is the same codebase. The managed cloud at app.carbon.ms is this repository, operated by us. Self-hosting gives you the same ERP, MRP, MES and QMS on infrastructure you own; the same REST API and MCP server need a commercial license when self-hosting, and other Enterprise features unlock with one too.",
	},
	{
		q: "Can I bring my own AI models?",
		a: "Yes. The whole backend is exposed over a REST API and a built-in MCP server, so you point your own agents — Claude, ChatGPT, a local model — at your own data. API keys and the MCP server are a Business feature, so self-hosting them needs a commercial license. Nothing leaves your perimeter unless you send it.",
	},
	{
		q: "Do you help with deployment?",
		a: "For regulated and enterprise programs we offer white-glove deployment, migration and an SLA. Talk to sales and we'll scope it with your team.",
	},
];

export const meta: MetaFunction = ({ matches }) =>
	pageMeta(matches, {
		title: "Self-hosted Carbon — on-prem & air-gapped manufacturing ERP",
		description: DESCRIPTION,
		extra: [
			{
				"script:ld+json": {
					"@context": "https://schema.org",
					"@type": "FAQPage",
					url: `${SITE_URL}/self-hosted`,
					mainEntity: faqs.map((faq) => ({
						"@type": "Question",
						name: faq.q,
						acceptedAnswer: { "@type": "Answer", text: faq.a },
					})),
				},
			},
		],
	});

/* -------------------------------------------------------------------------- */
/*  Content                                                                    */
/* -------------------------------------------------------------------------- */

const principles = [
	{
		tag: "CMMC · NIST 800-171",
		name: "Built for your CMMC boundary",
		desc: "Keep CUI inside a boundary you control. We provide the SSP, POA&M and SPRS inputs for Enterprise deployments, mapped to how Carbon runs on your infrastructure.",
	},
	{
		tag: "Data ownership",
		name: "Your records, your database",
		desc: "BOMs, travelers, serial genealogy and costs live in a Postgres database you own — never copied to a vendor's cloud.",
	},
	{
		tag: "Complete control",
		name: "The whole layer is yours",
		desc: "You hold the network, the keys, the models and the backups — the whole layer is yours to secure, audit and control.",
	},
];

const walls = [
	{
		tag: "Data residency",
		name: "Your data never leaves your walls",
		desc: "Carbon runs against a Postgres database you own, on hardware you control. BOMs, travelers, serial genealogy and costs stay inside your perimeter — on-prem, in your VPC, or fully air-gapped.",
	},
	{
		tag: "Open source",
		name: "Audit the code before you deploy it",
		desc: "The whole application is on GitHub — the Community edition under AGPL-3.0. Read every line, run a security review, and extend it to fit your process — no black box sitting on your most sensitive records.",
	},
	{
		tag: "White-glove",
		name: "A team that deploys with you",
		desc: "For regulated and enterprise programs we scope the install, migrate your legacy data, and back it with an SLA — so a self-hosted deployment isn't a self-serve one.",
	},
];

const featureRows = [
	{
		id: "ledger",
		eyebrow: "Multi-entity · Multi-location",
		title: "Every site on one ledger you own.",
		body: "Run a single shop or a multi-national manufacturing engine from one Postgres database inside your perimeter. Per-entity currency, chart of accounts and tax; consolidated books; inter-site transfers — none of it leaving your network.",
		points: [
			"Multi-entity accounting with intercompany transactions",
			"Consolidated books across every location you run",
			"One schema, one backup, one system to secure",
		],
		shotLight: "/screenshots/multi-light.webp",
		shotDark: "/screenshots/multi-dark.webp",
		label: "Multi-entity ledger / multi-site planning",
		flip: false,
	},
	{
		id: "trace",
		eyebrow: "Quality & traceability",
		title: "Traceability that never leaves your network.",
		body: "Pull any serial number and get its full genealogy — material certs, operators, measurements, deviations — from a database that sits behind your own firewall. First article, NCR, CAPA and calibration on the same records as production.",
		points: [
			"Serial and lot genealogy, forwards and back",
			"NCR to CAPA workflow with sign-off",
			"Certificates generated from your own live data",
		],
		shotLight: "/screenshots/traceability-light.webp",
		shotDark: "/screenshots/traceability-dark.webp",
		label: "Quality / traceability record",
		flip: true,
	},
	{
		id: "floor",
		eyebrow: "Manufacturing execution",
		title: "The floor, running on your servers.",
		body: "Digital travelers, operator terminals, barcode tracking and finite-capacity scheduling — all executing against the copy of Carbon you host. No cloud dependency between the floor and the record.",
		points: [
			"Digital travelers with work instructions",
			"QR and barcode tracking on every unit",
			"Finite capacity scheduling that reacts",
		],
		shotLight: "/screenshots/mes-light.webp",
		shotDark: "/screenshots/mes-dark.webp",
		label: "Shop floor / job traveler",
		flip: false,
	},
];

const deployments = [
	{
		n: "01",
		name: "Docker",
		desc: "The whole stack — app, API, MCP server and Postgres — runs in Docker containers. Stand it up on a single box to evaluate, then scale out.",
	},
	{
		n: "02",
		name: "Your own cloud",
		desc: "Deploy into your own VPC on AWS, GCP or Azure, against managed Postgres. You keep the network, the keys and the backups.",
	},
	{
		n: "03",
		name: "On-prem & air-gapped",
		desc: "Run entirely inside your own network with no outbound calls — built for defense, ITAR-restricted and classified programs. Air-gapped licensing is an Enterprise feature.",
	},
];

const DEPLOY_SNIPPET = `# Clone the source and bring up the whole stack
git clone ${REPO_URL}.git
cd carbon
docker compose up -d

# App, API, MCP server and Postgres — all on your box.`;

const owns = [
	{
		tag: "Postgres",
		name: "One database, and it's yours",
		desc: "ERP, MRP, MES and QMS share a single Postgres schema with row-level security. No sync jobs between systems, no vendor data lake — just your database.",
	},
	{
		tag: "Your LLM",
		name: "Bring your own agents",
		desc: "Every table is a REST endpoint and a built-in MCP server exposes the whole backend. Point Claude, ChatGPT or a local model at your live data — inside your perimeter, on your keys. API keys and MCP are a Business feature, so self-hosting them needs a commercial license.",
	},
	{
		tag: "Your storage",
		name: "Files stay where you put them",
		desc: "Attachments, drawings and certificates live in object storage you control, behind signed URLs and access control — never a public bucket.",
	},
];

const parity = [
	"ERP — quotes, orders, purchasing, inventory and job costing",
	"MRP — demand, supply planning, BOM and routing versions",
	"MES — digital travelers, operator terminal, live scheduling",
	"QMS — first article, NCR/CAPA, calibration and genealogy",
	"REST API and MCP server across every module (commercial license to self-host)",
	"SSO / SAML, granular permissions and row-level security",
	"Multi-entity, multi-location, consolidated accounting",
	"ITAR-ready, CMMC and NIST 800-171 aligned deployment",
];

/* -------------------------------------------------------------------------- */
/*  Shared bits (mirror the home page's design language)                       */
/* -------------------------------------------------------------------------- */

const shell = "mx-auto w-full max-w-[1360px] px-6 sm:px-7";
const eyebrow =
	"font-mono text-sm uppercase leading-none tracking-[0.2em] text-muted-foreground";
const heading =
	"font-display tracking-[-0.015em] text-[clamp(2.125rem,4.4vw,3.875rem)] leading-[1.08]";

function Chip({ children }: { children: string }) {
	return (
		<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5 font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-secondary">
			{children}
		</span>
	);
}

/* -------------------------------------------------------------------------- */
/*  Sections                                                                   */
/* -------------------------------------------------------------------------- */

function Hero() {
	return (
		<section className="relative overflow-hidden pt-24 sm:pt-36 lg:pt-44">
			<div className={cn(shell, "relative")}>
				{/* The forced break only holds from sm up; on phones the headline
				    wraps naturally and text-balance evens out the lines. */}
				<h1 className="font-display tracking-[-0.02em] text-balance text-[clamp(2.5rem,5.6vw,5.5rem)] leading-[1.06]">
					Open-source ERP that runs{" "}
					<br className="hidden sm:inline" />
					<span className="text-secondary">inside your CMMC boundary</span>
				</h1>

				<p className="mt-8 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
					The whole system of record — ERP, MRP, MES and QMS — on Postgres you
					own. On-prem, in your VPC, or fully air-gapped. Open source, so you can
					audit every line before it ever touches your most sensitive records.
				</p>

				<div className="mt-10 flex flex-wrap gap-2.5">
					<Button asChild variant="accent" size="cta">
						<Link to="/sales">Get a license</Link>
					</Button>
					<Button asChild variant="accentOutline" size="cta">
						<a href={REPO_URL} target="_blank" rel="noopener">
							<GithubLogo className="size-4" />
							Star on GitHub
						</a>
					</Button>
				</div>

				{/* Framed hero visual — same panel treatment as the home page. */}
				<div className="relative mt-24 sm:mt-32 [perspective:2000px]">
					<div
						aria-hidden
						className="mx-[12%] h-px bg-gradient-to-r from-transparent via-secondary to-transparent"
						style={{ boxShadow: "0 0 34px 6px hsl(var(--secondary) / 0.35)" }}
					/>
					<div className="border border-b-0 border-border bg-card">
						<div className="relative overflow-hidden sm:h-[min(60vh,680px)]">
							<Screenshot
								className="dark:hidden"
								src="/screenshots/self-hosted-light.webp"
								label="Carbon running on your own servers"
								eager
							/>
							<Screenshot
								className="hidden dark:block"
								src="/screenshots/self-hosted-dark.webp"
								label="Carbon running on your own servers"
								eager
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function Principles() {
	return (
		<section className="border-b border-border">
			<div className={shell}>
				<div className="grid grid-cols-1 gap-px border-x border-border bg-border md:grid-cols-3">
					{principles.map((p) => (
						<div key={p.tag} className="flex flex-col gap-4 bg-background p-8 sm:p-10">
							<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
								<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
									{p.tag}
								</span>
							</div>
							<div className="text-xl font-medium tracking-[-0.01em]">
								{p.name}
							</div>
							<div className="text-sm leading-relaxed text-muted-foreground">
								{p.desc}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Walls() {
	return (
		<section className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<Chip>Built for CMMC</Chip>
				<h2 className={cn(heading, "mt-6 max-w-[20ch]")}>
					CMMC-compliant work stays inside your walls.
				</h2>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
					Defense and aerospace manufacturers handling CUI can't ship their
					record of production to someone else's cloud. Self-hosting Carbon
					keeps that data inside your own CMMC boundary — and for Enterprise
					deployments we hand you the SSP, POA&amp;M and SPRS inputs an assessor
					will ask for.
				</p>
				<div className="mt-14 grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-3">
					{walls.map((w) => (
						<div
							key={w.tag}
							className="flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-muted"
						>
							<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
								<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
									{w.tag}
								</span>
							</div>
							<div className="text-xl font-medium">{w.name}</div>
							<div className="text-sm leading-relaxed text-muted-foreground">
								{w.desc}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function FeatureRows() {
	return (
		<section className="border-b border-border py-28 sm:py-32">
			<div className={cn(shell, "flex flex-col gap-24 lg:gap-32")}>
				{featureRows.map((f) => (
					<div
						key={f.id}
						className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14"
					>
						<div className={cn(f.flip && "lg:order-2")}>
							<div className={eyebrow}>{f.eyebrow}</div>
							<h3 className="mt-5 font-display tracking-[-0.01em] text-[clamp(1.75rem,3vw,2.625rem)] leading-[1.1]">
								{f.title}
							</h3>
							<p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
								{f.body}
							</p>
							<div className="mt-7 flex flex-col gap-2.5 font-mono text-[13px] leading-snug text-muted-foreground">
								{f.points.map((p) => (
									<div key={p}>→ {p}</div>
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
								<ZoomableImage
									className="dark:hidden"
									src={f.shotLight}
									alt={f.label}
								>
									<Screenshot src={f.shotLight} label={f.label} />
								</ZoomableImage>
								<ZoomableImage
									className="hidden dark:block"
									src={f.shotDark}
									alt={f.label}
								>
									<Screenshot src={f.shotDark} label={f.label} />
								</ZoomableImage>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CopyBlock({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);
	useEffect(() => {
		if (!copied) return;
		const id = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(id);
	}, [copied]);
	return (
		<div className="relative border border-border bg-card">
			<button
				type="button"
				onClick={() => {
					navigator.clipboard?.writeText(code).then(
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
				{copied ? "Copied" : "Copy"}
			</button>
			<pre className="overflow-auto whitespace-pre-wrap px-4 py-4 pr-16 font-mono text-xs leading-[1.7] text-muted-foreground">
				{code}
			</pre>
		</div>
	);
}

function Deploy() {
	return (
		<section className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<div className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<Chip>Deploy it your way</Chip>
						<h2 className={cn(heading, "mt-6 max-w-[22ch]")}>
							One codebase, from a laptop to a cluster.
						</h2>
					</div>
					<p className="max-w-[38ch] text-base leading-relaxed text-muted-foreground">
						The same source runs from a single Docker host to a multi-region
						deployment in your own cloud. No proprietary runtime, no lock-in.
					</p>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-3">
					{deployments.map((d) => (
						<div
							key={d.n}
							className="flex flex-col gap-3 bg-card px-8 pb-10 pt-7 transition-colors hover:bg-muted"
						>
							<div className="font-mono text-[10px] leading-none text-secondary">
								{d.n}
							</div>
							<div className="mt-2 text-[19px] font-medium tracking-[-0.01em]">
								{d.name}
							</div>
							<div className="text-sm leading-relaxed text-muted-foreground">
								{d.desc}
							</div>
						</div>
					))}
				</div>

				<div className="mt-6">
					<CopyBlock code={DEPLOY_SNIPPET} />
				</div>
				<p className="mt-6 font-mono text-xs leading-relaxed text-muted-foreground">
					→ Full deployment guides live in the{" "}
					<a
						href={DOCS_URL}
						target="_blank"
						rel="noopener"
						className="text-secondary hover:underline"
					>
						documentation
					</a>
					.
				</p>
			</div>
		</section>
	);
}

function OwnItAll() {
	return (
		<section className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<Chip>Your stack, top to bottom</Chip>
				<h2 className={cn(heading, "mt-6 max-w-[24ch]")}>
					Own the database, the models, and the files.
				</h2>
				<div className="mt-14 grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-3">
					{owns.map((o) => (
						<div
							key={o.tag}
							className="flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-muted"
						>
							<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
								<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
									{o.tag}
								</span>
							</div>
							<div className="text-xl font-medium">{o.name}</div>
							<div className="text-sm leading-relaxed text-muted-foreground">
								{o.desc}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Parity() {
	return (
		<section className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<div className="grid grid-cols-1 gap-px border border-border bg-border lg:grid-cols-2">
					<div className="flex flex-col bg-muted p-10 sm:p-11">
						<h2 className="font-display tracking-[-0.01em] text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
							Nothing held back for the cloud.
						</h2>
						<p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-muted-foreground">
							Self-hosted Carbon is the same codebase that runs the managed
							cloud — the Community edition free under AGPL-3.0, Enterprise
							features unlocked with a commercial license.
						</p>
						<ul role="list" className="mt-8 flex flex-col divide-y divide-border/60">
							{parity.map((item) => (
								<li
									key={item}
									className="flex items-start gap-3 py-3.5 text-[15px] leading-relaxed text-foreground first:pt-0"
								>
									<Check
										className="mt-1 size-4 shrink-0 text-secondary"
										strokeWidth={2.5}
									/>
									<span>{item}</span>
								</li>
							))}
						</ul>
						<div className="mt-8 flex flex-wrap gap-2.5">
							<Button asChild variant="accent" size="cta">
								<Link to="/sales">Talk to sales</Link>
							</Button>
							<Button asChild variant="accentOutline" size="cta">
								<a
									href="https://docs.carbon.ms/docs/platform/self-hosting"
									target="_blank"
									rel="noopener"
								>
									Deploy it yourself
								</a>
							</Button>
						</div>
					</div>
					<div className="relative overflow-hidden bg-screenshot p-2.5">
						<div className="relative h-full overflow-hidden sm:min-h-[560px]">
							<ZoomableImage
								className="dark:hidden"
								src="/screenshots/bom-light.webp"
								alt="Part configurator and BOM tree"
							>
								<Screenshot
									src="/screenshots/bom-light.webp"
									label="Part configurator / BOM tree"
								/>
							</ZoomableImage>
							<ZoomableImage
								className="hidden dark:block"
								src="/screenshots/bom-dark.webp"
								alt="Part configurator and BOM tree"
							>
								<Screenshot
									src="/screenshots/bom-dark.webp"
									label="Part configurator / BOM tree"
								/>
							</ZoomableImage>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function OpenCore() {
	return (
		<section className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<div className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<Chip>Open source core</Chip>
						<h2 className={cn(heading, "mt-6 max-w-[22ch]")}>
							Read it. Run it. Extend it.
						</h2>
						<p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
							The whole application is on GitHub — a typed TypeScript monorepo
							on Postgres. The Community edition is licensed AGPL-3.0 and free
							to self-host; Enterprise modules and air-gapped licensing require a
							commercial license. Audit it against your security requirements
							before a single record ever lands in it.
						</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button asChild variant="accent" size="cta">
							<a href={REPO_URL} target="_blank" rel="noopener">
								<GithubLogo className="size-4" />
								Star on GitHub
							</a>
						</Button>
						<Button asChild variant="accentOutline" size="cta">
							<Link to="/developers">
								Developer surface
								<ChevronRight />
							</Link>
						</Button>
					</div>
				</div>
				<div className="mt-12 flex flex-wrap gap-6 font-mono text-xs uppercase leading-none text-muted-foreground">
					<span>TypeScript</span>
					<span>React</span>
					<span>Postgres</span>
					<span>RLS</span>
					<span>Docker</span>
					<span>REST + MCP</span>
					<span>AGPL-3.0 core</span>
				</div>
			</div>
		</section>
	);
}

function Faq() {
	return (
		<section className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<h2 className={cn(heading, "max-w-[18ch]")}>Common questions.</h2>
				<div className="mt-12 border-t border-border">
					{faqs.map((faq) => (
						<div
							key={faq.q}
							className="grid grid-cols-1 gap-3 border-b border-border py-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-10"
						>
							<h3 className="text-lg font-medium tracking-[-0.01em] text-foreground">
								{faq.q}
							</h3>
							<p className="max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">
								{faq.a}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function CTA() {
	return (
		<section className="relative overflow-hidden py-32 sm:py-36">
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
				<div className={eyebrow}>Run it on your infrastructure</div>
				<h2 className="mt-6 font-display tracking-[-0.02em] text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.08]">
					<span className="block">Your factory.</span>{" "}
					<span className="block">Your servers.</span>
				</h2>
				<p className="mx-auto mt-6 max-w-[56ch] text-balance text-lg leading-relaxed text-muted-foreground">
					Start from the source today, or have our team scope a deployment for
					your program.
				</p>
				<div className="mt-10 flex flex-wrap justify-center gap-2.5">
					<Button asChild variant="accent" size="cta">
						<Link to="/sales">Get a license</Link>
					</Button>
					<Button asChild variant="accentOutline" size="cta">
						<a href={REPO_URL} target="_blank" rel="noopener">
							<GithubLogo className="size-4" />
							Star on GitHub
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
}

export default function SelfHosted() {
	return (
		<>
			<Hero />
			<Principles />
			<LogoStrip
				headline={<Trans>Two hard tech unicorns build on Carbon.</Trans>}
				label={
					<Trans>And some of the world's most innovative manufacturers</Trans>
				}
			/>
			<Walls />
			<FeatureRows />
			<Deploy />
			<OwnItAll />
			<Parity />
			<OpenCore />
			<Faq />
			<CTA />
		</>
	);
}
