import { z } from "zod";

export const iconSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    url: z.string().url(),
});

export const iconUpsertSchema = iconSchema.partial({ id: true });

export type Icon = z.infer<typeof iconUpsertSchema>;