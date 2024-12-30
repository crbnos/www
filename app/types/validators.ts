import { z } from "zod";

export type Mode = "light" | "dark";

export const modeValidator = z.object({
  mode: z.enum(["light", "dark", "system"]),
});
