import { z } from 'zod';

export const collectionCheckoutSchema = z.object({
  productSlug: z.string().min(1),
  email: z.string().email(),
  customerName: z.string().min(1).max(120).optional().or(z.literal(''))
});
