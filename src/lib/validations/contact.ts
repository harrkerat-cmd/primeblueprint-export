import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please share your name."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(20, "Please add a little more detail.")
});

export type ContactInput = z.infer<typeof contactSchema>;
