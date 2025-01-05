import { vitePlugin as remix } from "@remix-run/dev";
import { vercelPreset } from "@vercel/remix/vite";
import path from "node:path";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === "SOURCEMAP_ERROR") {
          return;
        }

        defaultHandler(warning);
      },
      external: ["./app/lib/blog.local.server"],
    },
  },
  define: {
    global: "globalThis",
  },
  ssr: {
    noExternal: ["react-icons", "tailwind-merge"],
  },
  server: {
    port: 3003,
  },
  plugins: [
    remix({
      presets: [vercelPreset()],
      future: {
        v3_fetcherPersist: false,
        v3_lazyRouteDiscovery: false,
        v3_relativeSplatPath: false,
        v3_routeConfig: false,
        v3_singleFetch: false,
        v3_throwAbortReason: false,
      },
      ignoredRouteFiles: ["**/.*"],
      serverModuleFormat: "esm",
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes, {
          // eslint-disable-next-line no-undef
          appDir: path.resolve(__dirname, "app"),
        });
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {},
});
