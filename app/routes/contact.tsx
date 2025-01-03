import { useFetcher } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@vercel/remix";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { getSlackClient } from "~/lib/slack.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const email = String(formData.get("email"));
  const company = String(formData.get("companyName"));
  const message = String(formData.get("message"));

  if (!name || !email || !company || !message) {
    return json(
      { success: false, message: "Invalid form submission" },
      { status: 400 }
    );
  }

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
            `*New Contact Form Submission* 🥁\n\n` +
            `*Contact Information*\n` +
            `• Name: ${name}\n` +
            `• Email: ${email}\n` +
            `• Company: ${company}\n\n` +
            `*Message*\n` +
            `${message}`,
        },
      },
    ],
  });

  return json({ success: true, message: "Form submitted successfully" });
}

export default function Contact() {
  const fetcher = useFetcher<typeof action>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (fetcher.data?.success) {
      setIsSubmitted(true);
    }
  }, [fetcher.data]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full flex-col px-4 md:px-6 lg:px-8 3xl:pt-32 4xl:pt-36 max-w-4xl pt-28">
        <div className="flex flex-col gap-4 lg:items-center lg:text-center mb-16">
          <h1 className="font-semibold text-6xl tracking-tight">Contact</h1>
        </div>
      </div>
      <div className="mx-auto flex flex-col px-4 w-full lg:w-form-lg max-w-4xl mb-28">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="animate-bounce">
              <Check className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold animate-fade-in">
              Thank you for your message!
            </h2>
            <p className="text-center text-muted-foreground animate-fade-in-delayed">
              We'll be in touch with you shortly.
            </p>
          </div>
        ) : (
          <fetcher.Form method="post" className="flex flex-col gap-5">
            <div className="relative flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative flex flex-1">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  data-1p-ignore="true"
                />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="relative flex flex-col gap-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative flex flex-1">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@acme.com"
                    required
                    autoComplete="email"
                    data-1p-ignore="true"
                  />
                </div>
              </div>

              <div className="relative flex flex-col gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative flex flex-1">
                  <Input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Acme, Inc."
                    required
                    autoComplete="organization"
                    data-1p-ignore="true"
                  />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col gap-2">
              <Label htmlFor="message">Message</Label>
              <div className="relative flex flex-1">
                <Textarea
                  id="message"
                  name="message"
                  placeholder="What can we help with?"
                  className="h-[113px]"
                  required
                />
              </div>
            </div>

            <div>
              <Button type="submit" disabled={fetcher.state !== "idle"}>
                Submit
              </Button>
            </div>
          </fetcher.Form>
        )}
      </div>
    </div>
  );
}
