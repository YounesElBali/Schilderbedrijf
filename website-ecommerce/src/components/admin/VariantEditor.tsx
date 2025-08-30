"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductVariant } from "@/types";

export function VariantEditor({ productId, variants, onAdd, onUpdate, onDelete,}: {
    productId: number;
    variants: ProductVariant[] | undefined;
    onAdd: (name: string, price?: number) => void;
    onUpdate: (variantId: number, patch: Partial<ProductVariant>) => void;
    onDelete: (variantId: number) => void;
    }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState<string>("");


    return (
        <div className="space-y-2">
            <div className="space-y-2">
                {variants && variants.length > 0 ? (
                    variants.map(v => (
                        <div key={v.id} className="flex items-center gap-2 border p-2 rounded">
                            <Input value={v.name} onChange={e => onUpdate(v.id, { name: e.target.value })} className="w-48" />
                            <Input type="number" step="0.01" value={v.price ?? ""} onChange={e => onUpdate(v.id, { price: e.target.value ? parseFloat(e.target.value) : undefined })} className="w-32" />
                            <label className="flex items-center gap-1">
                                <input type="checkbox" checked={v.inStock} onChange={e => onUpdate(v.id, { inStock: e.target.checked })} />
                                In stock
                            </label>
                            <Button onClick={() => onDelete(v.id)} className="text-red-600">Delete</Button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No variants yet.</p>
                )}
            </div>
            <div className="flex items-end gap-2">
                <div>
                    <label className="block text-sm">Variant name</label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Size 10" className="w-48" />
                </div>
                <div>
                    <label className="block text-sm">Price (optional)</label>
                    <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-32" />
                </div>
                <Button onClick={() => { if (!name.trim()) return; onAdd(name.trim(), price ? parseFloat(price) : undefined); setName(""); setPrice(""); }}>Add variant</Button>
            </div>
        </div>
    );
};