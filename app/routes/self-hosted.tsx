import { Trans } from "@lingui/react/macro";
import { Check, ChevronRight, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { MetaFunction } from "react-router";
import { ByocConsole } from "~/components/byoc-console";
import { LogoStrip } from "~/components/logo-strip";
import { EntityTree } from "~/components/entity-tree";
import { Screenshot } from "~/components/screenshot";
import { Button } from "~/components/ui/button";
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
 * Postgres, and the whole backend is reachable over REST and MCP. BYOC is the
 * managed middle ground: we deploy and operate Carbon inside the customer's
 * own cloud account from a control plane, so they get self-hosting's data
 * ownership without running it themselves. The page
 * reuses the home page's screenshot panels and customer strip so it reads as
 * the same product, then layers on the self-hosting story on top.
 */

const DESCRIPTION =
	"Run Carbon in your cloud account, on-prem or air-gapped. Keep ERP, MRP, MES and QMS data in a Postgres database you control, with managed BYOC and self-managed options.";

const DOCS_URL = "https://docs.carbon.ms";

/* -------------------------------------------------------------------------- */
/*  FAQ (shared by the rendered section and the FAQPage JSON-LD)               */
/* -------------------------------------------------------------------------- */

const faqs = [
	{
		q: "Is Carbon open source?",
		a: "Yes. The Community edition includes the core ERP, MRP, MES and QMS and is available on GitHub under AGPL-3.0. Enterprise features and alternative licensing require a commercial agreement.",
	},
	{
		q: "How does Carbon support CMMC requirements?",
		a: "Self-hosting keeps CUI inside an infrastructure boundary you control. For Enterprise BYOC deployments, we provide deployment-specific inputs for your System Security Plan, POA&M and SPRS score. Your organization remains responsible for its full CMMC program and assessment.",
	},
	{
		q: "Can Carbon run fully air-gapped?",
		a: "Yes. With an Enterprise license, Carbon runs in a restricted network without outbound calls. The application is containerized and uses a Postgres database you control.",
	},
	{
		q: "What is bring-your-own-cloud (BYOC)?",
		a: "BYOC is managed self-hosting. Carbon deploys the application and data services into your cloud account, then operates releases, certificates and monitoring through a control plane. You approve upgrades and retain control of the infrastructure and data.",
	},
	{
		q: "Is the self-hosted version the same as the cloud?",
		a: "Yes. Managed cloud and self-hosted deployments use the same codebase. The Community edition includes core manufacturing functions; the REST API, MCP server and other Enterprise features require a commercial license when self-hosted.",
	},
	{
		q: "Can I bring my own AI models?",
		a: "Yes. Connect hosted or local models through Carbon's REST API and built-in MCP server. Both use Carbon identities and permissions. Self-hosted API keys and MCP access require a commercial license.",
	},
	{
		q: "Do you help with deployment?",
		a: "Yes. BYOC includes deployment and operations in your cloud account. Enterprise engagements can also include data migration, custom integrations, training and an SLA.",
	},
];

export const meta: MetaFunction = ({ matches }) =>
	pageMeta(matches, {
		title: "Self-hosted Carbon — BYOC, on-prem & air-gapped manufacturing ERP",
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
		name: "Keep CUI in your security boundary",
		desc: "Run Carbon inside infrastructure you control. Enterprise BYOC includes deployment-specific inputs for your SSP, POA&M and SPRS score.",
	},
	{
		tag: "Data ownership",
		name: "Store records in your database",
		desc: "BOMs, travelers, serial genealogy and costs remain in a Postgres database in your account or network.",
	},
	{
		tag: "Complete control",
		name: "Control the complete deployment",
		desc: "Set the network, encryption keys, identity provider, AI models, backup policy and retention rules.",
	},
];

const byoc = [
	{
		tag: "Provisioning",
		name: "Provision environments on demand",
		desc: "Connect your cloud account, choose a region and deploy an isolated environment for staging, production or a specific site.",
	},
	{
		tag: "Forks",
		name: "Deploy your own fork",
		desc: "Build and release a customized Carbon fork through the same staging and production pipeline as the standard distribution.",
	},
	{
		tag: "Single-tenant",
		name: "Single-tenant by design",
		desc: "Each deployment has its own application, database and object storage in your cloud account. Application data is not copied into Carbon's managed cloud.",
	},
];

const walls = [
	{
		tag: "Data residency",
		name: "Keep production data in your environment",
		desc: "Run Carbon against Postgres in your VPC, data center or isolated network. BOMs, travelers, genealogy and costs stay inside that boundary.",
	},
	{
		tag: "Open source",
		name: "Review the code before deployment",
		desc: "Inspect the application on GitHub, run your security review and extend the AGPL-3.0 Community edition for your process.",
	},
	{
		tag: "White-glove",
		name: "Deployment and migration support",
		desc: "Enterprise engagements can include architecture, installation, legacy data migration, training and an SLA.",
	},
];

const featureRows = [
	{
		id: "ledger",
		eyebrow: "Multi-entity · Multi-location",
		title: "Run every site on one ledger.",
		body: "Manage one facility or multiple entities and locations from Postgres inside your perimeter. Configure currency, chart of accounts and tax by entity, then consolidate reporting and inter-site transfers.",
		points: [
			"Multi-entity accounting with intercompany transactions",
			"Consolidated books across every location you run",
			"One schema, one backup, one system to secure",
		],
		diagram: "entity-tree",
		label: "Multi-entity ledger / multi-site planning",
		flip: false,
	},
	{
		id: "trace",
		eyebrow: "Quality & traceability",
		title: "Keep traceability inside your network.",
		body: "Open any serial number to see its material certificates, operators, measurements and deviations. First articles, NCRs, CAPAs and calibrations link to the same production records.",
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
		title: "Run the shop floor on your servers.",
		body: "Serve digital travelers, operator terminals, barcode tracking and finite-capacity schedules from the Carbon instance you host. Production does not depend on Carbon's managed cloud.",
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
		name: "Managed BYOC",
		desc: "Carbon deploys into your cloud account and operates upgrades, certificates and monitoring. Application data remains in your account.",
	},
	{
		n: "02",
		name: "Docker",
		desc: "Run the application, API and MCP server in containers with Postgres. Start on one host, then move to a clustered deployment.",
	},
	{
		n: "03",
		name: "Self-managed cloud",
		desc: "Operate Carbon in your AWS, Google Cloud or Azure VPC with managed Postgres. You manage the network, keys, backups and releases.",
	},
	{
		n: "04",
		name: "On-prem & air-gapped",
		desc: "Operate without outbound calls inside an isolated network. Air-gapped deployment and licensing are Enterprise features.",
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
		name: "One database for every module",
		desc: "ERP, MRP, MES and QMS share a Postgres schema with row-level security. There are no synchronization jobs between separate product databases.",
	},
	{
		tag: "Your LLM",
		name: "Connect your own AI models",
		desc: "Use the REST API and built-in MCP server with hosted or local models. Requests stay inside your deployment and use Carbon permissions. Self-hosted API keys and MCP require a commercial license.",
	},
	{
		tag: "Your storage",
		name: "Store files in your object storage",
		desc: "Keep attachments, drawings and certificates in object storage you control, protected by signed URLs and application access rules.",
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
		<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5 font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
			{children}
		</span>
	);
}

/** The page's two calls to action, repeated through most sections. */
function LicenseActions({ className }: { className?: string }) {
	return (
		<div className={cn("flex flex-wrap gap-2.5", className)}>
			<Button asChild variant="accent" size="cta">
				<Link to="/pricing?mode=self-hosted">View Self-Hosted Pricing</Link>
			</Button>
			<Button asChild variant="accentOutline" size="cta">
				<Link to="/sales">Contact Sales</Link>
			</Button>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*  Sections                                                                   */
/* -------------------------------------------------------------------------- */

function Hero() {
	return (
		<section className="relative overflow-hidden pt-24 sm:pt-36 lg:pt-44">
			<div className={cn(shell, "relative")}>
				<div className="text-center">
					<h1 className="font-display tracking-[-0.02em] text-balance text-[clamp(2.5rem,5.6vw,5.5rem)] leading-[1.06]">
						Self-hosted ERP on your infrastructure
					</h1>

					<p className="mx-auto mt-8 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
						Deploy ERP, MRP, MES and QMS in your cloud account, on-prem or
						air-gapped. Keep the application and Postgres data inside a boundary
						you control.
					</p>

					<LicenseActions className="mt-10 justify-center" />
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

function Byoc() {
	return (
		<section className="border-b border-border py-28 sm:py-32">
			<div className={shell}>
				<div className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<Chip>Bring your own cloud</Chip>
						<h2 className={cn(heading, "mt-6 max-w-[20ch]")}>
							Your cloud account, operated by Carbon.
						</h2>
						<p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted-foreground">
							BYOC deploys Carbon into your cloud account. We operate releases,
							certificates and monitoring while you retain control of the account,
							network and data.
						</p>
					</div>
					<LicenseActions />
				</div>

				<div className="mt-14 border border-border sm:h-[min(64vh,520px)]">
					<ByocConsole label="Carbon BYOC control plane: environments running in your own cloud account" />
				</div>

				<div className="grid grid-cols-1 gap-px border border-t-0 border-border bg-border lg:grid-cols-3">
					{byoc.map((b) => (
						<div
							key={b.tag}
							className="flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-muted"
						>
							<div className="font-mono text-[10px] uppercase leading-none tracking-wide text-secondary">
								<span className="inline-block bg-secondary/10 dark:bg-secondary-surface px-3 py-1.5">
									{b.tag}
								</span>
							</div>
							<div className="text-xl font-medium">{b.name}</div>
							<div className="text-sm leading-relaxed text-muted-foreground">
								{b.desc}
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
				<Chip>CMMC · NIST 800-171</Chip>
				<h2 className={cn(heading, "mt-6 max-w-[20ch]")}>
					Keep CUI inside your security boundary.
				</h2>
				<p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">
					Self-host Carbon to keep production records and CUI in infrastructure
					you control. Enterprise BYOC deployments include system-specific
					inputs for your SSP, POA&amp;M and SPRS score.
				</p>
				<LicenseActions className="mt-10" />
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
							<Chip>{f.eyebrow}</Chip>
							<h3 className="mt-5 font-display tracking-[-0.01em] text-[clamp(1.75rem,3vw,2.625rem)] leading-[1.1]">
								{f.title}
							</h3>
							<p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
								{f.body}
							</p>
							<div className="mt-7 flex flex-col gap-2.5 text-sm leading-snug text-muted-foreground">
								{f.points.map((p) => (
									<div key={p}>→ {p}</div>
								))}
							</div>
							<LicenseActions className="mt-10" />
						</div>
						<div
							className={cn(
								"relative overflow-hidden border border-border bg-screenshot p-2.5",
								f.flip && "lg:order-1",
							)}
						>
							<div className="relative overflow-hidden sm:h-[min(52vh,480px)]">
								{"diagram" in f ? (
									<EntityTree label={f.label} />
								) : (
									<>
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
									</>
								)}
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
							One codebase across every deployment model.
						</h2>
					</div>
					<div className="flex flex-col gap-8">
						<p className="max-w-[38ch] text-base leading-relaxed text-muted-foreground">
							Run the same application on one Docker host, a private cloud cluster
							or an isolated on-prem network.
						</p>
						<div className="flex flex-wrap gap-2.5">
							<Button asChild variant="accent" size="cta">
								<Link to="/pricing?mode=self-hosted">View Pricing</Link>
							</Button>
							<Button asChild variant="accentOutline" size="cta">
								<a
									href={`${DOCS_URL}/docs/platform/self-hosting`}
									target="_blank"
									rel="noopener"
								>
									Read the Docs
									<ChevronRight />
								</a>
							</Button>
						</div>
					</div>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
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
				<div className="flex flex-wrap items-end justify-between gap-8">
					<div>
						<Chip>Your stack, top to bottom</Chip>
						<h2 className={cn(heading, "mt-6 max-w-[24ch]")}>
							Control the data, models and storage.
						</h2>
					</div>
					<LicenseActions />
				</div>
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
					{/* Muted at 30%, mixed over the page background rather than made
					    transparent — a translucent cell would let the grid's bg-border
					    show through and swallow the divider line. */}
					<div className="flex flex-col bg-[color-mix(in_srgb,hsl(var(--muted))_30%,hsl(var(--background)))] p-10 sm:p-11">
						<h2 className="font-display tracking-[-0.01em] text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.1]">
							Use the same product in every environment.
						</h2>
						<p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-muted-foreground">
							Managed cloud and self-hosted Carbon use the same codebase. The
							Community edition is available under AGPL-3.0; a commercial license
							unlocks Enterprise features for self-hosted deployments.
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
						<LicenseActions className="mt-8" />
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
							Inspect, deploy and extend the source.
						</h2>
						<p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
							Carbon is a TypeScript monorepo backed by Postgres. Self-host the
							Community edition under AGPL-3.0, or use a commercial license for
							Enterprise modules and air-gapped deployments. Review the code
							against your security requirements before rollout.
						</p>
					</div>
					<LicenseActions />
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
				<div className={eyebrow}>Choose your deployment model</div>
				<h2 className="mt-6 font-display tracking-[-0.02em] text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.08]">
					<span className="block">Your factory.</span>{" "}
					<span className="block">Your servers.</span>
				</h2>
				<p className="mx-auto mt-6 max-w-[56ch] text-balance text-lg leading-relaxed text-muted-foreground">
					Deploy the Community edition yourself or work with our team on BYOC,
					on-prem and air-gapped Enterprise deployments.
				</p>
				<LicenseActions className="mt-10 justify-center" />
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
				headline={<Trans>Hard tech unicorns build on Carbon.</Trans>}
				label={
					<Trans>And some of the world's most innovative manufacturers</Trans>
				}
			/>
			<Byoc />
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
