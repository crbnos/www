import { redirect } from "@vercel/remix";

export async function loader() {
  return redirect("https://cal.com/chase-carbon/carbon-introduction", 301);
}
