import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { useEffect, useState } from "react";
import { useMode } from "~/hooks/useMode";
import { cn } from "~/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Operations                                                                */
/* -------------------------------------------------------------------------- */

const API_URL = "https://app.carbon.ms/api/v1";
const MCP_URL = "https://app.carbon.ms/api/mcp";

type Classification = "READ" | "WRITE" | "DESTRUCTIVE";

type Operation = {
	module: string;
	name: string;
	classification: Classification;
	/** The plain-language request an MCP client would turn into this call. */
	prompt: MessageDescriptor;
	/** What the model passes to `search_tools` to find the operation. */
	search: string;
	body: Record<string, unknown>;
	response: unknown;
	/** What the service layer does on the way through — the part a raw table write skips. */
	trace: MessageDescriptor[];
};

// Real operations from the OpenAPI spec, with illustrative IDs and data.
const operations: Operation[] = [
	{
		module: "sales",
		name: "insertQuote",
		classification: "WRITE",
		prompt: msg`Draft a quote for Acme Aerospace.`,
		search: "create quote",
		body: { customerId: "cu_7Hq2mX" },
		response: { id: "qt_4Lw9sB", quoteId: "Q-000184" },
		trace: [
			msg`Key scope checked: sales · create`,
			msg`Input validated against the operation schema`,
			msg`Next quote number drawn from the sequence`,
			msg`Opportunity opened for the customer`,
			msg`Payment and shipping terms resolved from the customer`,
		],
	},
	{
		module: "production",
		name: "insertJob",
		classification: "WRITE",
		prompt: msg`Make 90 solar-array brackets, due October 24.`,
		search: "create job",
		body: {
			input: {
				itemId: "it_2Rk8vD",
				quantity: 90,
				dueDate: "2026-10-24",
				deadlineType: "Hard Deadline",
			},
		},
		response: { id: "jb_9Tz3cQ", jobId: "J-000412" },
		trace: [
			msg`Key scope checked: production · create`,
			msg`Input validated against the operation schema`,
			msg`Job number drawn from the sequence`,
			msg`The item's BOM and routing copied onto the job`,
			msg`Material quantities and costs recalculated`,
		],
	},
	{
		module: "production",
		name: "scheduleJob",
		classification: "WRITE",
		prompt: msg`Schedule J-000412 and tell me if anything slips.`,
		search: "schedule job",
		body: { jobId: "jb_9Tz3cQ" },
		response: {
			locationId: "lo_Hq1vTp",
			jobsScheduled: 1,
			jobsFailed: 0,
			conflictsDetected: 1,
			newlyLate: [
				{
					jobId: "jb_3Mw8kL",
					readableJobId: "J-000398",
					assignee: "Dana Ruiz",
					projectedCompletionAt: "2026-10-27T15:00:00Z",
				},
			],
		},
		trace: [
			msg`Key scope checked: production · update`,
			msg`Operations placed on work center capacity`,
			msg`Conflicts with existing jobs detected`,
			msg`Jobs pushed past their due date reported back`,
		],
	},
	{
		module: "inventory",
		name: "insertManualInventoryAdjustment",
		classification: "WRITE",
		prompt: msg`We found 12 extra M6 bolts in bin A-14. Fix the count.`,
		search: "inventory adjustment",
		body: {
			itemId: "it_6Pn4wK",
			adjustmentType: "Positive Adjmt.",
			quantity: 12,
			storageUnitId: "su_A14xQe",
			comment: "Cycle count",
		},
		response: { id: "il_3Ve7mB" },
		trace: [
			msg`Key scope checked: inventory · create`,
			msg`Input validated against the operation schema`,
			msg`Item ledger entry posted`,
			msg`On-hand quantity updated for the storage unit`,
		],
	},
	{
		module: "sales",
		name: "getSalesOrders",
		classification: "READ",
		prompt: msg`Which sales orders are ready to ship?`,
		search: "sales orders",
		body: { args: { status: "To Ship", limit: 25 } },
		response: {
			results: [
				{
					salesOrderId: "SO-000231",
					status: "To Ship",
					customerReference: "PO-88412",
					orderDate: "2026-09-28",
				},
				{
					salesOrderId: "SO-000236",
					status: "To Ship",
					customerReference: "PO-88507",
					orderDate: "2026-09-30",
				},
			],
			count: 2,
		},
		trace: [
			msg`Key scope checked: sales · view`,
			msg`Rows limited to your company and permissions`,
			msg`Lists come back with results and a total count for paging`,
		],
	},
	{
		module: "production",
		name: "deleteJob",
		classification: "DESTRUCTIVE",
		prompt: msg`Delete the draft job J-000415.`,
		search: "delete job",
		body: { jobId: "jb_5Xc2nR" },
		response: null,
		trace: [
			msg`Classified destructive, so a client can gate or exclude it`,
			msg`Key scope checked: production · delete`,
			msg`Job removed`,
		],
	},
];

/* -------------------------------------------------------------------------- */
/*  Code samples, generated from each operation                               */
/* -------------------------------------------------------------------------- */

type Transport = "TypeScript" | "Python" | "Go" | "cURL" | "MCP";
const transports: Transport[] = ["TypeScript", "Python", "Go", "cURL", "MCP"];

const json = (value: unknown) => JSON.stringify(value, null, 2);
const indent = (text: string, by: string) => text.replace(/\n/g, `\n${by}`);
const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);
// JSON with bare keys, as you'd write the object in TypeScript.
const tsLiteral = (value: unknown) => json(value).replace(/"(\w+)":/g, "$1:");
// The JSON bodies here hold only strings, numbers, arrays and objects, all of
// which are already valid Python literals.
const pythonLiteral = (value: unknown) => json(value);

const mcpSetup = `claude mcp add --transport http carbon \\
  ${MCP_URL} \\
  --header "Authorization: Bearer $CARBON_API_KEY"`;

function sample(op: Operation, transport: Transport) {
	const path = `/${op.module}/${op.name}`;
	switch (transport) {
		case "MCP":
			return mcpSetup;
		case "cURL":
			return `curl ${API_URL}${path} \\
  -H "Authorization: Bearer $CARBON_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${indent(json(op.body), "  ")}'`;
		case "TypeScript":
			return `import { client } from "./client/client.gen";
import { ${capitalize(op.module)} } from "./client/sdk.gen";

client.setConfig({ auth: process.env.CARBON_API_KEY });

const { data } = await ${capitalize(op.module)}.${op.name}({
  body: ${indent(tsLiteral(op.body), "  ")},
});`;
		case "Python":
			return `import os
import httpx

carbon = httpx.Client(
    base_url="${API_URL}",
    headers={"Authorization": f"Bearer {os.environ['CARBON_API_KEY']}"},
)

data = carbon.post("${path}", json=${pythonLiteral(op.body)}).json()`;
		case "Go":
			return `body := strings.NewReader(\`${json(op.body)}\`)

req, _ := http.NewRequest("POST", "${API_URL}${path}", body)
req.Header.Set("Authorization", "Bearer "+os.Getenv("CARBON_API_KEY"))
req.Header.Set("Content-Type", "application/json")

res, err := http.DefaultClient.Do(req)`;
	}
}

const editorLanguage: Record<Transport, string> = {
	TypeScript: "tsx",
	Python: "python",
	Go: "go",
	cURL: "bash",
	MCP: "bash",
};

/* -------------------------------------------------------------------------- */
/*  Editor themes                                                             */
/* -------------------------------------------------------------------------- */

const darkEditorTheme = {
	plain: { color: "#F8F8F2", backgroundColor: "transparent" },
	styles: [
		{ types: ["keyword"], style: { color: "#71deff" } },
		{ types: ["function"], style: { color: "#9d72ff" } },
		{ types: ["string"], style: { color: "#3CEEAE" } },
		{ types: ["string-property", "property"], style: { color: "#9D72FF" } },
		{ types: ["number", "boolean"], style: { color: "#FB3186" } },
		{ types: ["comment"], style: { color: "#6B7280" } },
		{ types: ["punctuation", "operator"], style: { color: "#9CA3AF" } },
	],
} satisfies PrismTheme;

const lightEditorTheme = {
	plain: { color: "#1e293b", backgroundColor: "transparent" },
	styles: [
		{ types: ["keyword"], style: { color: "#0284c7" } },
		{ types: ["function"], style: { color: "#7c3aed" } },
		{ types: ["string"], style: { color: "#059669" } },
		{ types: ["string-property", "property"], style: { color: "#7c3aed" } },
		{ types: ["number", "boolean"], style: { color: "#db2777" } },
		{ types: ["comment"], style: { color: "#94a3b8" } },
		{ types: ["punctuation", "operator"], style: { color: "#64748b" } },
	],
} satisfies PrismTheme;

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                    */
/* -------------------------------------------------------------------------- */

const classificationTone: Record<Classification, string> = {
	READ: "text-muted-foreground",
	WRITE: "text-secondary",
	DESTRUCTIVE: "text-rose-500",
};
const classificationFill: Record<Classification, string> = {
	READ: "bg-muted-foreground/50",
	WRITE: "bg-secondary",
	DESTRUCTIVE: "bg-rose-500",
};

function ClassificationBadge({
	value,
	className,
}: {
	value: Classification;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 font-mono text-[10px] uppercase leading-none tracking-wide",
				classificationTone[value],
				className,
			)}
		>
			<span
				aria-hidden
				className={cn("size-1.5 rounded-full", classificationFill[value])}
			/>
			{value}
		</span>
	);
}

function Code({ code, language, theme }: {
	code: string;
	language: string;
	theme: PrismTheme;
}) {
	return (
		<Highlight theme={theme} code={code} language={language}>
			{({ tokens, getLineProps, getTokenProps }) => (
				<pre className="font-mono text-[13px] leading-6">
					{tokens.map((line, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: lines are positional
						<div key={i} {...getLineProps({ line })}>
							<span className="mr-5 inline-block w-5 select-none text-right text-muted-foreground/40">
								{i + 1}
							</span>
							{line.map((token, key) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: tokens are positional
								<span key={key} {...getTokenProps({ token })} />
							))}
						</div>
					))}
				</pre>
			)}
		</Highlight>
	);
}

function CopyButton({ text, className }: { text: string; className?: string }) {
	const { t } = useLingui();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timer);
	}, [copied]);

	return (
		<button
			type="button"
			aria-label={t`Copy code snippet`}
			className={cn(
				"inline-flex items-center justify-center border border-border bg-background p-2 text-muted-foreground transition-colors hover:text-foreground",
				className,
			)}
			onClick={() => {
				navigator.clipboard.writeText(text);
				setCopied(true);
			}}
		>
			{copied ? (
				<Check className="size-4 text-secondary" strokeWidth={2.5} />
			) : (
				<Copy className="size-4" strokeWidth={2} />
			)}
		</button>
	);
}

const rise = "motion-safe:animate-cb-rise";

/** An MCP client finding and calling the operation through the three meta-tools. */
function McpTranscript({ op }: { op: Operation }) {
	const { i18n } = useLingui();
	const id = `${op.module}.${op.name}`;
	const calls = [
		{ tool: "search_tools", args: { query: op.search, module: op.module } },
		{ tool: "describe_tool", args: { name: id } },
		{ tool: "call_tool", args: { name: id, arguments: op.body } },
	];
	return (
		<div className="flex flex-col gap-4">
			<div className={cn("flex items-start gap-3", rise)}>
				<span className="mt-0.5 shrink-0 font-mono text-[10px] uppercase leading-5 tracking-wide text-muted-foreground">
					<Trans>You</Trans>
				</span>
				<p className="bg-muted px-3 py-1.5 text-sm leading-5">
					{i18n._(op.prompt)}
				</p>
			</div>
			<ol className="flex flex-col gap-2.5 border-l border-border pl-4 font-mono text-[12.5px] leading-5">
				{calls.map((c, i) => (
					<li
						key={c.tool}
						className={cn("flex min-w-0 flex-col gap-0.5", rise)}
						style={{ animationDelay: `${(i + 1) * 280}ms` }}
					>
						<span className="text-secondary">{c.tool}</span>
						<span className="whitespace-pre-wrap break-all text-muted-foreground">
							{JSON.stringify(c.args)}
						</span>
					</li>
				))}
			</ol>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*  Console                                                                   */
/* -------------------------------------------------------------------------- */

const ADVANCE_MS = 8000;

/**
 * Pick an operation on the left, see it called over MCP or HTTP on the right,
 * with the response and what the service layer did along the way. Until the
 * visitor picks something, it walks through the operations on its own — the
 * progress bar's `animationend` drives the advance, so hovering (which pauses
 * the bar) pauses the walk too.
 */
export function ApiConsole({ className }: { className?: string }) {
	const { i18n } = useLingui();
	const mode = useMode();
	const theme = mode === "dark" ? darkEditorTheme : lightEditorTheme;

	const [index, setIndex] = useState(0);
	const [transport, setTransport] = useState<Transport>("TypeScript");
	const [auto, setAuto] = useState(true);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setAuto(false);
		}
	}, []);

	const op = operations[index];
	const code = sample(op, transport);
	const key = `${index}-${transport}`;

	return (
		<div
			className={cn(
				"group/console grid grid-cols-1 border border-border bg-card text-foreground lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]",
				className,
			)}
		>
			{/* Operation rail */}
			<div className="flex flex-col border-b border-border lg:border-b-0 lg:border-r">
				<div className="flex h-12 items-center border-b border-border bg-background px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
					<Trans>Operations</Trans>
				</div>
				<ul className="flex gap-px overflow-x-auto lg:flex-col lg:overflow-visible">
					{operations.map((o, i) => {
						const active = i === index;
						return (
							<li key={`${o.module}.${o.name}`} className="shrink-0">
								<button
									type="button"
									aria-pressed={active}
									onClick={() => {
										setAuto(false);
										setIndex(i);
									}}
									className={cn(
										"relative flex w-full flex-col gap-1.5 px-5 py-3.5 text-left transition-colors",
										active
											? "bg-muted"
											: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
									)}
								>
									<span className="font-mono text-[12.5px] leading-none">
										<span className="text-muted-foreground">{o.module}.</span>
										<span className={active ? "text-foreground" : undefined}>
											{o.name}
										</span>
									</span>
									<ClassificationBadge value={o.classification} />
									{active && (
										<span
											aria-hidden
											className="absolute inset-y-0 left-0 w-0.5 bg-secondary"
										/>
									)}
									{active && auto && (
										<span
											aria-hidden
											onAnimationEnd={() =>
												setIndex((n) => (n + 1) % operations.length)
											}
											style={
												{
													"--progress-duration": `${ADVANCE_MS}ms`,
												} as React.CSSProperties
											}
											className="absolute inset-x-0 bottom-0 h-px origin-left animate-cb-progress bg-secondary/60 group-hover/console:[animation-play-state:paused]"
										/>
									)}
								</button>
							</li>
						);
					})}
				</ul>
				<a
					href="https://docs.carbon.ms/api"
					target="_blank"
					rel="noopener"
					className="mt-auto hidden items-center justify-between border-t border-border px-5 py-4 text-sm text-muted-foreground transition-colors hover:text-foreground lg:flex"
				>
					<Trans>Browse every operation</Trans>
					<ArrowUpRight className="size-4" aria-hidden />
				</a>
			</div>

			{/* Request + response */}
			<div className="flex min-w-0 flex-col">
				<div className="flex h-12 items-stretch justify-between border-b border-border bg-background">
					<div
						role="group"
						aria-label="Transport"
						className="flex items-stretch overflow-x-auto"
					>
						{transports.map((t) => (
							<button
								key={t}
								type="button"
								aria-pressed={transport === t}
								onClick={() => setTransport(t)}
								className={cn(
									"whitespace-nowrap px-4 font-mono text-[13px] transition-colors",
									transport === t
										? "bg-card text-foreground shadow-[inset_0_2px_0] shadow-secondary"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{t}
							</button>
						))}
					</div>
					<div className="hidden items-center gap-2 pr-5 font-mono text-[12px] text-muted-foreground sm:flex">
						<span className="text-secondary">POST</span>
						<span className="truncate">
							/api/v1/{op.module}/{op.name}
						</span>
					</div>
				</div>

				<div className="relative overflow-x-auto md:min-h-[300px] px-5 py-6 lg:px-8">
					{transport === "MCP" ? (
						<div key={key} className="flex flex-col gap-6 pr-12">
							<McpTranscript op={op} />
							<div className="flex flex-col gap-2">
								<span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
									<Trans>Connect Claude Code, Cursor, Codex or ChatGPT</Trans>
								</span>
								<Code code={code} language="bash" theme={theme} />
							</div>
						</div>
					) : (
						<div key={key} className={cn("pr-12", rise)}>
							<Code
								code={code}
								language={editorLanguage[transport]}
								theme={theme}
							/>
						</div>
					)}
					<CopyButton text={code} className="absolute right-4 top-4" />
				</div>

				<div className="grid grid-cols-1 border-t border-border md:grid-cols-2">
					<div className="flex min-w-0 flex-col border-b border-border md:border-b-0 md:border-r">
						<div className="flex h-10 items-center gap-3 border-b border-border px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground lg:px-8">
							<Trans>Response</Trans>
							<span className="text-secondary">200</span>
						</div>
						<div
							key={key}
							className={cn(
								"max-h-[260px] overflow-auto md:min-h-[200px] px-5 py-4 lg:px-8",
								rise,
							)}
							style={{ animationDelay: "900ms" }}
						>
							<Code code={json(op.response)} language="json" theme={theme} />
						</div>
					</div>
					<div className="flex min-w-0 flex-col">
						<div className="flex h-10 items-center border-b border-border px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground lg:px-8">
							<Trans>Service layer</Trans>
						</div>
						<ol key={key} className="flex flex-col gap-3 px-5 py-5 text-sm lg:px-8">
							{op.trace.map((line, i) => (
								<li
									key={line.id}
									className={cn("flex items-start gap-2.5", rise)}
									style={{ animationDelay: `${900 + i * 140}ms` }}
								>
									<Check
										aria-hidden
										className="mt-0.5 size-4 shrink-0 text-secondary"
										strokeWidth={2.5}
									/>
									<span className="leading-5">{i18n._(line)}</span>
								</li>
							))}
						</ol>
					</div>
				</div>
			</div>
		</div>
	);
}
