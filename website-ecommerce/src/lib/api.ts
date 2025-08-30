import { apiFetch } from "./fetcher";
import { categorySchema } from "@/types/category";
import { iconSchema } from "@/types/icon";
import { orderSchema } from "@/types/order";
import { productSchema, productUpsertSchema } from "@/types/product";
import type { ProductInput } from "@/types/product";


export const API = {
// Categories
getCategories: () => apiFetch("/api/categories", { schema: categorySchema.array() }),
createCategory: (input: { name: string; image: string; path: string }) =>
apiFetch("/api/categories", { method: "POST", body: JSON.stringify(input), schema: categorySchema }),
deleteCategory: (id: number) => apiFetch(`/api/categories/${id}`, { method: "DELETE" }),


// Products
getProducts: () => apiFetch("/api/products", { schema: productSchema.array() }),
createProduct: (input: ProductInput) =>
apiFetch("/api/products", { method: "POST", body: JSON.stringify(productUpsertSchema.parse(input)), schema: productSchema }),
updateProduct: (id: number, input: ProductInput) =>
apiFetch(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(productUpsertSchema.parse(input)), schema: productSchema }),
deleteProduct: (id: number) => apiFetch(`/api/products/${id}`, { method: "DELETE" }),


addVariant: (productId: number, input: { name: string; price?: number }) =>
apiFetch(`/api/products/${productId}/variants`, { method: "POST", body: JSON.stringify(input) }),
updateVariant: (productId: number, variantId: number, input: { name?: string; price?: number; inStock?: boolean }) =>
apiFetch(`/api/products/${productId}/variants/${variantId}`, { method: "PATCH", body: JSON.stringify(input) }),
deleteVariant: (productId: number, variantId: number) =>
apiFetch(`/api/products/${productId}/variants/${variantId}`, { method: "DELETE" }),


// Orders
getOrders: () => apiFetch("/api/orders", { schema: orderSchema.array() }),
updateOrderStatus: (id: number, status: string) =>
apiFetch(`/api/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),


// Icons
getIcons: () => apiFetch("/api/icons", { schema: iconSchema.array() }),
createIcon: (input: { name: string; url: string }) =>
apiFetch("/api/icons", { method: "POST", body: JSON.stringify(input), schema: iconSchema }),
deleteIcon: (id: number) => apiFetch(`/api/icons/${id}`, { method: "DELETE" }),


// Uploads
uploadFile: async (file: File) => {
const fd = new FormData();
fd.append("file", file);
const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
if (!res.ok) throw new Error("Upload failed");
return (await res.json()) as { path: string };
},
deleteFile: (path: string) => apiFetch("/api/upload", { method: "DELETE", body: JSON.stringify({ path }) }),
};