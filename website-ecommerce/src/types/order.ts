import { z } from "zod";
import { productSchema, productVariantSchema } from "./product";

export const orderItemSchema = z.object({
    variant: productVariantSchema.nullable().optional(),
    productId: z.number(),
    quantity: z.number().int().positive(),
    price: z.number().nonnegative(),
    product: productSchema,
});

export const orderSchema = z.object({
    id: z.number(),
    userId: z.number(),
    totalPrice: z.number(),
    status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
    createdAt: z.string(),
    orderItems: z.array(orderItemSchema),
    shippingAddress: z.string(),
});