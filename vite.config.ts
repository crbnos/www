import { reactRouter } from "@react-router/dev/vite";
import { lingui } from "@lingui/vite-plugin";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
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
    noExternal: ["react-icons", "tailwind-merge", "@lingui/react", "@lingui/core"],
  },
  server: {
    port: 3003,
  },
  // Vite's dep scanner misses most of these (they're only discovered once a
  // page imports them). Each late discovery re-optimizes and reloads, which can
  // leave two copies of React on the page and crash Radix components with
  // "Cannot read properties of null (reading 'useContext')". Pre-bundle upfront.
  optimizeDeps: {
    include: [
      "@lingui/core",
      "@lingui/react",
      "@lingui/message-utils/compileMessage",
      "@marsidev/react-turnstile",
      "@radix-ui/react-accordion",
      "@radix-ui/react-context-menu",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-progress",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@upstash/redis",
      "@vercel/analytics/react",
      "class-variance-authority",
      "clsx",
      "cookie",
      "intl-parse-accept-language",
      "lucide-react",
      "motion/react",
      "prism-react-renderer",
      "tailwind-merge",
      "zod",
    ],
  },
  plugins: [
    babel({
      // `include` must be set explicitly: since vite-plugin-babel@1.7.0 the
      // default `include` is /\.jsx?$/ (no .tsx) and is applied BEFORE `filter`,
      // so .tsx files would otherwise skip babel-plugin-macros and the Lingui
      // <Trans>/useLingui macros would never be transformed (build fails with
      // "macro ... executed outside the context of compilation").
      include: /\.[jt]sx?$/,
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: ["babel-plugin-macros"],
      },
    }),
    lingui(),
    reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {},
});
