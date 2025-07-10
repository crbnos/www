import { redirect } from "@vercel/remix";

export async function loader() {
  return redirect("https://calendly.com/chase-carbon/carbon-introduction", 301);
}
