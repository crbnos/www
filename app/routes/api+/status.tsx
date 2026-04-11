import { data } from "react-router";

export const config = { runtime: "edge" };

export async function loader() {
  try {
    const response = await fetch(
      "https://status.carbon.ms/api/status-page/production"
    );
    const json = await response.json();
    return data(
      { incident: json.incident ?? null },
      { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } }
    );
  } catch {
    return data({ incident: null }, { status: 502 });
  }
}
