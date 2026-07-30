/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use carbon";
import { useLingui } from "@lingui/react/macro";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Check, Copy } from "lucide-react";
import { Highlight, Prism, type PrismTheme } from "prism-react-renderer";
import { useEffect, useState } from "react";
import { useMode } from "~/hooks/useMode";
import { cn } from "~/lib/utils";

// Register C# language with Prism (not included in default bundle)
const csharpGrammar = {
	comment: [
		{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true },
		{ pattern: /(^|[^\\:])\/\/.*/, lookbehind: true },
	],
	string: [
		{ pattern: /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/, greedy: true },
		{ pattern: /"(?:\\.|[^\\"\r\n])*"/, greedy: true },
	],
	keyword:
		/\b(?:abstract|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|var|virtual|void|volatile|while)\b/,
	number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)f?/i,
	operator: />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
	punctuation: /[{}[\];(),.:]/,
};

Object.assign(Prism.languages, { csharp: csharpGrammar });

const Tabs = TabsPrimitive.Root;

const darkEditorTheme = {
	plain: {
		color: "#F8F8F2",
		backgroundColor: "transparent",
	},
	styles: [
		{
			types: ["keyword"],
			style: {
				color: "#71deff",
			},
		},
		{
			types: ["function"],
			style: {
				color: "#9d72ff",
			},
		},
		{
			types: ["string"],
			style: {
				color: "#3CEEAE",
			},
		},
		{
			types: ["string-property"],
			style: {
				color: "#9D72FF",
			},
		},
		{
			types: ["number"],
			style: {
				color: "#FB3186",
			},
		},
		{
			types: ["comment"],
			style: {
				color: "#6B7280",
			},
		},
		{
			types: ["property"],
			style: {
				color: "#3CEEAE",
			},
		},
	],
} satisfies PrismTheme;

const lightEditorTheme = {
	plain: {
		color: "#1e293b",
		backgroundColor: "transparent",
	},
	styles: [
		{
			types: ["keyword"],
			style: {
				color: "#0284c7",
			},
		},
		{
			types: ["function"],
			style: {
				color: "#7c3aed",
			},
		},
		{
			types: ["string"],
			style: {
				color: "#059669",
			},
		},
		{
			types: ["string-property"],
			style: {
				color: "#7c3aed",
			},
		},
		{
			types: ["number"],
			style: {
				color: "#db2777",
			},
		},
		{
			types: ["comment"],
			style: {
				color: "#94a3b8",
			},
		},
		{
			types: ["property"],
			style: {
				color: "#059669",
			},
		},
	],
} satisfies PrismTheme;

const claudeCodeMcpCodeblock = `claude mcp add --transport http \\
  carbon https://app.carbon.ms/api/mcp \\
  --header "Authorization: Bearer crbn_*****************"
`;

const cursorMcpCodeblock = `// .cursor/mcp.json
{
  "mcpServers": {
    "carbon": {
      "url": "https://app.carbon.ms/api/mcp",
      "headers": {
        "Authorization": "Bearer crbn_*****************"
      }
    }
  }
}`;

const vscodeMcpCodeblock = `// .vscode/mcp.json
{
  "servers": {
    "carbon": {
      "type": "http",
      "url": "https://app.carbon.ms/api/mcp",
      "headers": {
        "Authorization": "Bearer crbn_*****************"
      }
    }
  }
}`;

const typescriptCodeBlock = `import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

const apiUrl = "https://rest.carbon.ms";
const apiKey = "crbn_*****************";

const carbon = createClient(apiUrl, apiKey);
`;

const createOrderBlock = `// apps/erp/app/modules/sales/sales.service.ts 

export async function upsertSalesOrder(
  carbon: SupabaseClient<Database>,
  salesOrder:
    | (Omit<z.infer<typeof salesOrderValidator>, "id" | "salesOrderId"> & {
        salesOrderId: string;
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof salesOrderValidator>, "id" | "salesOrderId"> & {
        id: string;
        salesOrderId: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("id" in salesOrder) {
    return carbon
      .from("salesOrder")
      .update(sanitize(salesOrder))
      .eq("id", salesOrder.id)
      .select("id, salesOrderId");
  }

  const [customerPayment, customerShipping, employee, opportunity] =
    await Promise.all([
      getCustomerPayment(carbon, salesOrder.customerId),
      getCustomerShipping(carbon, salesOrder.customerId),
      getEmployeeJob(carbon, salesOrder.createdBy, salesOrder.companyId),
      carbon
        .from("opportunity")
        .insert([
          {
            companyId: salesOrder.companyId,
            customerId: salesOrder.customerId
          }
        ])
        .select("id")
        .single()
    ]);

  if (customerPayment.error) return customerPayment;
  if (customerShipping.error) return customerShipping;

  const {
    paymentTermId,
    invoiceCustomerId,
    invoiceCustomerContactId,
    invoiceCustomerLocationId
  } = customerPayment.data;

  const { shippingMethodId, shippingTermId } = customerShipping.data;

  const locationId = employee?.data?.locationId ?? null;

  if (salesOrder.currencyCode) {
    const currency = await getCurrencyByCode(
      carbon,
      salesOrder.companyId,
      salesOrder.currencyCode
    );
    if (currency.data) {
      salesOrder.exchangeRate = currency.data.exchangeRate ?? undefined;
      salesOrder.exchangeRateUpdatedAt = new Date().toISOString();
    }
  } else {
    salesOrder.exchangeRate = 1;
    salesOrder.exchangeRateUpdatedAt = new Date().toISOString();
  }

  const { requestedDate, promisedDate, ...orderData } = salesOrder;

  const order = await carbon
    .from("salesOrder")
    .insert([{ ...orderData, opportunityId: opportunity.data?.id }])
    .select("id, salesOrderId");

  if (order.error) {
    return order;
  }

  if (!order.data || order.data.length === 0) {
    return {
      error: {
        message: "Sales order insert returned no data",
        details:
          "The insert operation completed but returned an empty result set"
      } as PostgrestError,
      data: null
    };
  }

  const salesOrderId = order.data[0].id;

  const [shipment, payment] = await Promise.all([
    carbon.from("salesOrderShipment").insert([
      {
        id: salesOrderId,
        locationId: locationId,
        shippingMethodId: shippingMethodId,
        receiptRequestedDate: requestedDate,
        receiptPromisedDate: promisedDate,
        shippingTermId: shippingTermId,
        companyId: salesOrder.companyId
      }
    ]),
    carbon.from("salesOrderPayment").insert([
      {
        id: salesOrderId,
        invoiceCustomerId: invoiceCustomerId,
        invoiceCustomerContactId: invoiceCustomerContactId,
        invoiceCustomerLocationId: invoiceCustomerLocationId,
        paymentTermId: paymentTermId,
        companyId: salesOrder.companyId
      }
    ])
  ]);

  if (shipment.error) {
    await deleteSalesOrder(carbon, salesOrderId);
    return shipment;
  }
  if (payment.error) {
    await deleteSalesOrder(carbon, salesOrderId);
    return payment;
  }
  if (opportunity.error) {
    await deleteSalesOrder(carbon, salesOrderId);
    return opportunity;
  }

  return order;
}`;

const deleteOrderBlock = `// apps/erp/app/modules/sales/sales.service.ts
export async function deleteSalesOrder(
  carbon: SupabaseClient<Database>,
  salesOrderId: string
) {
  const { data, error } = await carbon.from("salesOrder").delete().eq("id", salesOrderId);
  
	return { data, error };
}`;

const getOrdersCodeBlock = `export async function getActiveSalesOrders(carbon: SupabaseClient<Database>) {
  const { data, error } = await carbon
    .from("salesOrder")
    .select(
      "*, salesOrderLine(*), salesOrderShipment(*), salesOrderPayment(*)",
      { count: "exact" }
    )
    .in("status", [
      "In Progress",
      "Needs Approval",
      "To Ship and Invoice",
      "To Ship",
      "To Invoice",
      "Confirmed"
    ]);

  return { data, error };
}`;

const pythonClient = `import os
from supabase import create_client, Client
from supabase.client import ClientOptions
url: str = "https://rest.carbon.ms"
key: str = "crbn_*****************"
def main() -> None:
    carbon: Client = create_client(
        url,
        key,
    )
    response = (
        carbon.table("employees")
        .select("*")
        .execute()
    )
main()`;

const csharpClient = `using Supabase;
var url = "https://rest.carbon.ms";
var apiKey = "crbn_*****************";
var carbon = new Supabase.Client(url, apiKey);
await carbon.InitializeAsync();
var employees = await carbon.From<Employee>().Select("*").Execute();`;

const curlOrderCodeBlock = `curl 'https://rest.carbon.ms/employees?select=id' \\
-H "Authorization: Bearer crbn_*****************"'
`;

type Snippet = {
	name: string;
	codeBlock: string;
	editorLanguage: string;
};

const languagesList = {
	TypeScript: [
		{
			name: "JS Client",
			codeBlock: typescriptCodeBlock,
			editorLanguage: "tsx",
		},
		{
			name: "Get Orders",
			codeBlock: getOrdersCodeBlock,
			editorLanguage: "tsx",
		},
		{
			name: "Delete Order",
			codeBlock: deleteOrderBlock,
			editorLanguage: "tsx",
		},
		{
			name: "Create Order",
			codeBlock: createOrderBlock,
			editorLanguage: "tsx",
		},
	],
	Python: [
		{
			name: "Python Client",
			codeBlock: pythonClient,
			editorLanguage: "python",
		},
	],
	"C#": [
		{
			name: "C# Client",
			codeBlock: csharpClient,
			editorLanguage: "csharp",
		},
	],
	cURL: [
		{
			name: "cURL",
			codeBlock: curlOrderCodeBlock,
			editorLanguage: "bash",
		},
	],
	MCP: [
		{
			name: "Claude Code",
			codeBlock: claudeCodeMcpCodeblock,
			editorLanguage: "bash",
		},
		{
			name: "Cursor",
			codeBlock: cursorMcpCodeblock,
			editorLanguage: "json",
		},
		{
			name: "VS Code",
			codeBlock: vscodeMcpCodeblock,
			editorLanguage: "json",
		},
	],
} as const satisfies {
	[key: string]: Snippet[];
};

type Language = keyof typeof languagesList;
type SnippetName = (typeof languagesList)[Language][number]["name"];

const languages: { name: Language }[] = [
	{ name: "MCP" },
	{ name: "TypeScript" },
	{ name: "Python" },
	{ name: "C#" },
	{ name: "cURL" },
];

const LanguageTrigger = ({
	className,
	value,
	children,
	...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) => (
	<TabsPrimitive.Trigger
		value={value}
		className={cn(
			"inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 font-mono text-[13px] transition-colors",
			"disabled:pointer-events-none disabled:opacity-50",
			"text-muted-foreground hover:text-foreground",
			"data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[inset_0_2px_0] data-[state=active]:shadow-secondary",
			className,
		)}
		{...props}
	>
		{children}
	</TabsPrimitive.Trigger>
);

function CodeEditor({
	codeBlock,
	language,
	theme,
}: {
	codeBlock: string;
	language: string;
	theme?: PrismTheme;
}) {
	return (
		<Highlight theme={theme} code={codeBlock} language={language}>
			{({ tokens, getLineProps, getTokenProps }) => {
				const lineCount = tokens.length;
				const gutterPadLength = Math.max(String(lineCount).length, 2);
				return (
					<pre key={codeBlock} className="leading-7 text-sm">
						{tokens.map((line, i) => {
							const lineNumber = i + 1;
							const paddedLineGutter = String(lineNumber).padStart(
								gutterPadLength,
								" ",
							);
							return (
								<div key={`${codeBlock}-line-${i}`} {...getLineProps({ line })}>
									<span className="select-none text-muted-foreground/40 mr-6 inline-block w-6 text-right">
										{paddedLineGutter}
									</span>
									{line.map((token, key) => (
										<span
											key={`${codeBlock}-token-${i}-${key}`}
											{...getTokenProps({ token })}
										/>
									))}
								</div>
							);
						})}
					</pre>
				);
			}}
		</Highlight>
	);
}

function CopyCodeButton({
	textToCopy,
	className,
}: {
	textToCopy: string;
	className?: string;
}) {
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
				navigator.clipboard.writeText(textToCopy);
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

function SnippetSwitcher({
	snippets,
	currentSnippet,
	setSnippet,
}: {
	snippets: readonly Snippet[];
	currentSnippet: SnippetName;
	setSnippet: React.Dispatch<React.SetStateAction<SnippetName>>;
}) {
	return (
		<div className="flex flex-col justify-start min-w-[180px] text-sm pt-6 px-4 border-b lg:border-b-0 lg:border-r border-border">
			<div className="flex flex-row lg:flex-col items-start gap-1 overflow-x-auto">
				{snippets.map((snippet) => (
					<button
						key={snippet.name}
						type="button"
						onClick={() => setSnippet(snippet.name as SnippetName)}
						className={cn(
							"flex shrink-0 items-center cursor-pointer py-1.5 px-3 w-full text-left transition-colors",
							{
								"bg-muted text-foreground shadow-[inset_2px_0_0] shadow-secondary":
									currentSnippet === snippet.name,
								"text-muted-foreground hover:text-foreground":
									currentSnippet !== snippet.name,
							},
						)}
					>
						{snippet.name}
					</button>
				))}
			</div>
		</div>
	);
}

export function CodeExamples({ className }: { className?: string }) {
	const mode = useMode();
	const [language, setLanguage] = useState<Language>("TypeScript");
	const [snippet, setSnippet] = useState<SnippetName>("JS Client");
	const editorTheme = mode === "dark" ? darkEditorTheme : lightEditorTheme;

	useEffect(() => {
		setSnippet(languagesList[language][0].name);
	}, [language]);

	function getLanguage({
		language,
		snippet,
	}: {
		language: Language;
		snippet: SnippetName;
	}) {
		const snippets = languagesList[language];
		const currentSnippet = snippets.find((f) => f.name === snippet);
		return currentSnippet?.editorLanguage || "tsx";
	}

	function getCodeBlock({
		language,
		snippet,
	}: {
		language: Language;
		snippet: SnippetName;
	}) {
		const snippets = languagesList[language];
		const currentSnippet = snippets.find((f) => f.name === snippet);
		return currentSnippet?.codeBlock || "";
	}

	return (
		<div
			className={cn(
				"relative w-full border border-border bg-card text-foreground",
				className,
			)}
		>
			<Tabs
				defaultValue={language}
				onValueChange={(l) => setLanguage(l as Language)}
				className="relative flex items-end h-14 border-b border-border bg-background"
			>
				<TabsPrimitive.List className="flex items-end overflow-x-auto">
					{languages.map(({ name }) => (
						<LanguageTrigger key={name} value={name}>
							{name}
						</LanguageTrigger>
					))}
				</TabsPrimitive.List>
			</Tabs>

			<div className="flex flex-col lg:flex-row overflow-x-auto min-h-[420px]">
				<SnippetSwitcher
					snippets={languagesList[language]}
					currentSnippet={snippet}
					setSnippet={setSnippet}
				/>
				<div className="relative flex w-full pt-4 pb-8 pl-4 lg:pl-8 pr-4 font-mono text-sm overflow-x-auto">
					<CodeEditor
						language={getLanguage({ language, snippet })}
						theme={editorTheme}
						codeBlock={getCodeBlock({ language, snippet })}
					/>
					<CopyCodeButton
						textToCopy={getCodeBlock({ language, snippet })}
						className="absolute top-4 right-4"
					/>
				</div>
			</div>
		</div>
	);
}
