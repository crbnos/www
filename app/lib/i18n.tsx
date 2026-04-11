import { setupI18n } from "@lingui/core";
import { I18nProvider as LinguiProvider } from "@lingui/react";
import { type ReactNode, useMemo } from "react";
import { resolveLanguage } from "./locale";

type LocaleProviderProps = {
  locale?: string | null;
  catalog?: Record<string, string>;
  children: ReactNode;
};

export function LocaleProvider({
  locale,
  catalog,
  children,
}: LocaleProviderProps) {
  const language = resolveLanguage(locale);

  const i18n = useMemo(() => {
    const runtime = setupI18n();
    runtime.load(language, catalog ?? {});
    runtime.activate(language);
    return runtime;
  }, [catalog, language]);

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
}
