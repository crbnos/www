import { json, type ActionFunctionArgs } from "@vercel/remix";
import { z } from "zod";
import { getSlackClient } from "~/lib/slack.server";

export const config = { runtime: "nodejs" };

const contactInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(1, "Company name is required"),
});

const answersSchema = z.object({
  ownership: z.enum(["buy", "rent"]),
  hosting: z.enum(["self-hosted", "managed-hosting", ""]),
  tenancy: z.enum(["multi-tenant", "single-tenant", ""]),
  support: z.enum(["limited", "dedicated", "priority", ""]),
  customDev: z.enum(["none", "portal", "shop-floor", "integrations", ""]),
  contactInfo: contactInfoSchema,
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const answersJson = formData.get("answers");

  if (!answersJson || typeof answersJson !== "string") {
    return json(
      { success: false, message: "Invalid form submission" },
      { status: 400 }
    );
  }

  let answers;
  try {
    answers = answersSchema.parse(JSON.parse(answersJson));
  } catch (error) {
    return json(
      { success: false, message: "Invalid form data" },
      { status: 400 }
    );
  }

  const formatAnswer = (key: string, value: string) => {
    const labels: Record<string, string> = {
      buy: "Buy the Source Code",
      rent: "Software as a Service",
      "self-hosted": "Self-Hosted",
      "managed-hosting": "Managed Hosting",
      "multi-tenant": "Multi-Tenant",
      "single-tenant": "Single-Tenant",
      limited: "Limited Support",
      dedicated: "Dedicated Support",
      priority: "Feature Prioritization",
      none: "None Required",
      portal: "Customer Portal/Website",
      "shop-floor": "Shop Floor Apps",
      integrations: "Integrations",
    };

    return labels[value] || value;
  };

  const slackClient = getSlackClient();
  await slackClient.sendMessage({
    channel: "#leads",
    text: "New lead 🎉",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text:
            `*New Lead Details* 🎯\n\n` +
            `*Contact Information*\n` +
            `• Name: ${answers.contactInfo.name}\n` +
            `• Email: ${answers.contactInfo.email}\n` +
            `• Company: ${answers.contactInfo.company}\n\n` +
            `*Requirements*\n` +
            `• Ownership Model: ${formatAnswer(
              "ownership",
              answers.ownership
            )}\n` +
            `${
              answers.hosting
                ? `• Hosting Preference: ${formatAnswer(
                    "hosting",
                    answers.hosting
                  )}\n`
                : ""
            }` +
            `${
              answers.tenancy
                ? `• Database: ${formatAnswer("tenancy", answers.tenancy)}\n`
                : ""
            }` +
            `${
              answers.support
                ? `• Support Level: ${formatAnswer(
                    "support",
                    answers.support
                  )}\n`
                : ""
            }` +
            `${
              answers.customDev
                ? `• Custom Development: ${formatAnswer(
                    "customDev",
                    answers.customDev
                  )}`
                : ""
            }`,
        },
      },
    ],
  });

  return json({ success: true, message: "Form submitted successfully" });
}
