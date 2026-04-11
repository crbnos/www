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
  plugins: [
    babel({
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
