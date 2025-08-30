import { z } from "zod";

const absoluteUrl = /^https?:\/\//i;
const relPath = /^\/[^\s]+$/;

export const productVariantSchema = z.object({
    id: z.number(),
    productId: z.number(),
    name: z.string().min(1),
    price: z.number().positive().optional().nullable(),
    inStock: z.boolean(),
});

export const productImageSchema = z.object({
  id: z.number().optional(),
  url: z.string()
    .trim()
    .refine(v => absoluteUrl.test(v) || relPath.test(v), {
      message: "url must be an absolute URL or a leading-slash relative path"
    }),
  productId: z.number().optional(),
});
export const productSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    price: z.number().nonnegative(),
    images: z.array(productImageSchema).default([]),
    description: z.string().min(1),
    isNew: z.boolean(),
    inStock: z.boolean(),
    deliveryCost: z.number().nonnegative(),
    articlenr: z.string().min(1),
    variants: z.array(productVariantSchema).optional(),
    traits: z.string().default(""),
    categoryId: z.number(),
    iconIds: z.array(z.number()).optional(),
});

export const productUpsertSchema = productSchema.partial({ id: true, images: true, variants: true }).extend({
    images: z.array(productImageSchema).optional(),
});

export type ProductInput = z.infer<typeof productUpsertSchema>;
