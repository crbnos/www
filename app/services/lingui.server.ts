import { resolveLanguage } from "~/lib/locale";
import type { Messages } from "@lingui/core";

const catalogLoaders = import.meta.glob("../../locales/*/www.mjs", {
  import: "messages",
}) as Record<string, () => Promise<Messages>>;

export async function loadLinguiCatalog(locale: string | null | undefined) {
  const language = resolveLanguage(locale);
  const catalogPath = `../../locales/${language}/www.mjs`;
  const load = catalogLoaders[catalogPath];
  return load ? load() : {};
}
