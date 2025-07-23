import * as cookie from "cookie";
import type { Mode } from "~/types/validators";

const cookieName = "mode";

export function getMode(request: Request, hint?: Mode): Mode | null {
  const cookieHeader = request.headers.get("cookie");
  const parsed = cookieHeader
    ? cookie.parse(cookieHeader)[cookieName]
    : "light";
  if (parsed === "light" || parsed === "dark") return parsed;
  return hint ?? null;
}

export function setMode(mode: Mode | "system") {
  if (mode === "system") {
    return cookie.serialize(cookieName, "", { path: "/", maxAge: -1 });
  } else {
    return cookie.serialize(cookieName, mode, {
      path: "/",
      maxAge: 31536000,
    });
  }
}
