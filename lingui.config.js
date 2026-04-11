import { defineConfig } from "@lingui/cli";

export default defineConfig({
	sourceLocale: "en",
	locales: ["en", "es", "de", "it", "ja", "zh", "fr", "pl", "pt", "ru"],
	fallbackLocales: {
		default: "en",
	},
	format: "po",
	catalogs: [
		{
			path: "locales/{locale}/www",
			include: ["app"],
			exclude: ["**/*.server.*", "**/*.test.*", "**/*.spec.*"],
		},
	],
});
