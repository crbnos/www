import * as cookie from "cookie";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import { localeCookieName, resolveLanguage } from "~/lib/locale";

export function getLocale(request: Request): string {
  const cookieHeader = request.headers.get("cookie");
  const localeCookie = cookieHeader
    ? cookie.parse(cookieHeader)[localeCookieName]
    : undefined;

  if (localeCookie) {
    return localeCookie;
  }

  const acceptLanguage = request.headers.get("accept-language");
  const locales = parseAcceptLanguage(acceptLanguage, {
    validate: Intl.DateTimeFormat.supportedLocalesOf,
  });

  return locales?.[0] ?? "en";
}

export function setLocale(locale: string) {
  const language = resolveLanguage(locale);
  return cookie.serialize(localeCookieName, language, {
    domain:
      process.env.VERCEL_ENV === "production" ? ".carbon.ms" : undefined,
    path: "/",
    maxAge: 31536000,
  });
}
