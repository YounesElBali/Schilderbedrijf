import { z } from "zod";

const absoluteUrl = /^https?:\/\//i;
const relPath = /^\/[^\s]+$/; // starts with "/" and no spaces

export const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  image: z.string()
    .trim()
    .refine(v => absoluteUrl.test(v) || relPath.test(v), {
      message: "image must be an absolute URL (https://...) or a leading-slash relative path (/images/...)"
    }),
  // If you store slugs, prefer /^[a-z0-9-_]+$/; if you store routes, allow leading slash:
  path: z.string()
    .trim()
    .refine(v => /^[A-Za-z0-9/_-]+$/.test(v), { message: "Invalid path" }),
});

export const categoryUpsertSchema = categorySchema.partial({ id: true });
export type Category = z.infer<typeof categorySchema>;
