import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Separate from vite.config.ts on purpose: the app config loads the React
 * Router plugin, which wants a route manifest and a server build. These tests
 * exercise plain modules, so they only need `~/*` path resolution.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["app/**/*.test.ts"],
  },
});
