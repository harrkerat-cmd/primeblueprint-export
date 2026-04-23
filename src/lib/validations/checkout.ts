import { z } from "zod";

export const checkoutSchema = z.object({
  requestId: z.string().min(1),
  packageId: z.enum(["STARTER", "PREMIUM"])
});
