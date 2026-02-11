/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use carbon";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { Book, Check, ChevronRight, Copy } from "lucide-react";
import { Highlight, Prism, type PrismTheme } from "prism-react-renderer";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
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

const editorTheme = {
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

const typescriptCodeBlock = `import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { CARBON_API_URL, CARBON_PUBLIC_KEY, CARBON_API_KEY } from "~/env";

const carbon = createClient(CARBON_API_URL, CARBON_PUBLIC_KEY, {
	global: {
		headers: {
			"carbon-key": CARBON_API_KEY
		}
	}
});
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
url: str = os.environ.get("CARBON_API_URL")
key: str = os.environ.get("CARBON_PUBLIC_KEY")
def main() -> None:
    carbon: Client = create_client(
        url,
        key,
        headers={
            "carbon-key": os.environ.get("CARBON_API_KEY")
        }
    )
    response = (
        carbon.table("employees")
        .select("*")
        .execute()
    )
main()`;

const csharpClient = `using Supabase;
var url = Environment.GetEnvironmentVariable("CARBON_API_URL");
var publicKey = Environment.GetEnvironmentVariable("CARBON_PUBLIC_KEY");
var apiKey = Environment.GetEnvironmentVariable("CARBON_API_KEY");
var options = new Supabase.SupabaseOptions
{
    AutoConnectRealtime = true,
    Headers = new Dictionary<string, string>
    {
        { "carbon-key", apiKey }
    }
};
var carbon = new Supabase.Client(url, publicKey, options);
await carbon.InitializeAsync();
var employees = await carbon.From<Employee>().Select("*").Execute();`;

const curlOrderCodeBlock = `curl 'https://api.carbon.ms/rest/v1/employees?select=id' \\
-H "carbon-key: CARBON_API_KEY" \\
-H "apiKey: CARBON_PUBLIC_KEY" \\
-H "Authorization: Bearer CARBON_PUBLIC_KEY"'
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
} as const satisfies {
	[key: string]: Snippet[];
};

type Language = keyof typeof languagesList;
type SnippetName = (typeof languagesList)[Language][number]["name"];

const languages: { name: Language }[] = [
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
			"inline-flex items-center gap-1 justify-center whitespace-nowrap rounded-t-lg px-4 py-2 text-sm transition-all",
			"hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-50",
			"bg-transparent data-[state=active]:bg-zinc-800",
			"border border-b-0 border-transparent data-[state=active]:border-zinc-700",
			"text-zinc-500 data-[state=active]:text-zinc-100 font-medium",
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
									<span className="select-none text-zinc-600 mr-6 inline-block w-6 text-right">
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
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timer);
	}, [copied]);

	return (
		<button
			type="button"
			aria-label="Copy code snippet"
			className={cn(
				"p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors",
				className,
			)}
			onClick={() => {
				navigator.clipboard.writeText(textToCopy);
				setCopied(true);
			}}
		>
			{copied ? (
				<Check className="size-4 text-green-500" />
			) : (
				<Copy className="size-4 text-zinc-400" />
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
		<div className="flex flex-col justify-start min-w-[180px] text-sm pt-6 px-4 border-r border-zinc-800">
			<div className="flex flex-row lg:flex-col items-start gap-1">
				{snippets.map((snippet) => (
					<button
						key={snippet.name}
						type="button"
						onClick={() => setSnippet(snippet.name as SnippetName)}
						className={cn(
							"flex items-center cursor-pointer hover:bg-zinc-800 py-1.5 px-3 rounded-lg w-full text-left transition-colors",
							{
								"bg-zinc-800 text-zinc-100": currentSnippet === snippet.name,
								"text-zinc-500": currentSnippet !== snippet.name,
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
	const [language, setLanguage] = useState<Language>("TypeScript");
	const [snippet, setSnippet] = useState<SnippetName>("JS Client");

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
		<section className={cn("py-24", className)}>
			<div className="container max-w-6xl mx-auto px-4">
				<div className="flex flex-col gap-8 mb-12">
					<h3 className="text-muted-foreground uppercase text-sm leading-[140%] tracking-tighter text-center">
						API-First
					</h3>
					<h2 className="font-display text-foreground text-balance mx-auto max-w-3xl text-center font-medium tracking-tight leading-[115%] text-3xl md:text-4xl lg:text-5xl xl:text-6xl -mt-4">
						Built on a developer-friendly platform
					</h2>
					<p className="text-muted-foreground dark:text-foreground text-balance mx-auto max-w-2xl text-center font-medium tracking-tighter text-base md:text-lg">
						Carbon extends the Supabase client libraries to provide a
						strongly-typed, strongly-permissioned, realtime API for extending
						your system of record.
					</p>
					<div className="flex flex-col md:flex-row gap-4 justify-center">
						<Button variant="secondary" size="xl" asChild>
							<a
								href="https://app.carbon.ms/docs/api/js/intro"
								target="_blank"
								rel="noopener"
							>
								API Docs
								<Book />
							</a>
						</Button>
						<Button variant="outline" size="xl" asChild>
							<a
								href="https://github.com/crbnos/carbon/tree/main/examples"
								target="_blank"
								rel="noopener"
							>
								Code Examples
								<ChevronRight />
							</a>
						</Button>
					</div>
				</div>

				<div className="relative w-full rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
					<Tabs
						defaultValue={language}
						onValueChange={(l) => setLanguage(l as Language)}
						className="relative flex items-end h-14 px-4 border-b border-zinc-800 bg-zinc-950"
					>
						<TabsPrimitive.List className="flex items-end gap-2 overflow-x-auto">
							{languages.map(({ name }) => (
								<LanguageTrigger key={name} value={name}>
									{name}
								</LanguageTrigger>
							))}
						</TabsPrimitive.List>
					</Tabs>

					<div className="flex flex-col lg:flex-row overflow-x-auto min-h-[420px] bg-zinc-900">
						<SnippetSwitcher
							snippets={languagesList[language]}
							currentSnippet={snippet}
							setSnippet={setSnippet}
						/>
						<div className="relative flex w-full pt-4 pb-8 pl-4 lg:pl-8 pr-4 font-mono text-sm overflow-x-auto bg-zinc-900">
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
			</div>
		</section>
	);
}
