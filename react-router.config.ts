import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  ssr: true,
  // Ship the full route manifest to the client at load instead of lazily
  // discovering routes via /__manifest ("Fog of War", the RR7 default).
  // On Vercel, routes with `config.runtime: "nodejs"` (contact, the learn+
  // layout that wraps blog articles) are served by a separate function, so the
  // lazy /__manifest request can't resolve them and client navigation throws
  // `No route matches URL "..."`. Discovering everything up front avoids that.
  routeDiscovery: { mode: "initial" },
  presets: process.env.VERCEL ? [vercelPreset()] : undefined,
} satisfies Config;
