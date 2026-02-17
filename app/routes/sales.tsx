import { redirect } from "@vercel/remix";

export async function loader() {
  return redirect("https://calendly.com/chase-carbon-introduction/30min", 301);
}
