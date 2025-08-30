"use client";
import { useEffect, useMemo, useState } from "react";
import { API } from "@/lib/api";
import { Category, Icon, Product, ProductImage } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { FilePicker } from "@/components/admin/FilePicker";
import { Badge } from "@/components/ui/Badge";
import { VariantEditor } from "@/components/admin/VariantEditor";
import { IconSelector } from "@/components/admin/IconSelector";
import { confirm } from "@/components/admin/ConfirmDialog";

export default function ProductsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [icons, setIcons] = useState<Icon[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [editing, setEditing] = useState<Product | null>(null);
    const [selectedIconIds, setSelectedIconIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        (async () => {
            try {
                const [cats, prods, icons] = await Promise.all([
                API.getCategories(),
                API.getProducts(),
                API.getIcons(),
            ]);
                setCategories(cats);
                setProducts(prods);
                setIcons(icons);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);


    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const files = fd.getAll("images") as File[];
        const uploaded: ProductImage[] = [];
        
        for (const file of files) {
            if (file && file.size > 0) {
                const { path } = await API.uploadFile(file);
                uploaded.push({ url: path });
            }           
        }

        const payload = { 
            name: String(fd.get("name")),
            description: String(fd.get("description")),
            price: parseFloat(String(fd.get("price")) || "0"),
            articlenr: String(fd.get("articlenr")),
            categoryId: parseInt(String(fd.get("categoryId")), 10),
            isNew: Boolean(fd.get("isNew")),
            inStock: Boolean(fd.get("inStock")),
            deliveryCost: parseFloat(String(fd.get("deliveryCost")) || "0"),
            traits: String(fd.get("traits")) || "",
            images: uploaded,
            iconIds: selectedIconIds,
        } as const;

        try {
            const created = await API.createProduct(payload);
            setProducts(prev => [created, ...prev]);
            (e.target as HTMLFormElement).reset();
            setSelectedIconIds([]);
        } catch (err: any) {
            setError(err.message);
        }
    }

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editing) return;

        const fd = new FormData(e.currentTarget);
        const files = fd.getAll("images") as File[];
        const newUploads: ProductImage[] = [];

        for (const file of files) {
            if (file && file.size > 0) {
                const { path } = await API.uploadFile(file);
                newUploads.push({ url: path, productId: editing.id });
            }
        }
        const payload = {
            name: String(fd.get("name")),
            description: String(fd.get("description")),
            price: parseFloat(String(fd.get("price")) || "0"),
            articlenr: String(fd.get("articlenr")),
            categoryId: parseInt(String(fd.get("categoryId")), 10),
            isNew: Boolean(fd.get("isNew")),
            inStock: Boolean(fd.get("inStock")),
            deliveryCost: parseFloat(String(fd.get("deliveryCost")) || "0"),
            traits: String(fd.get("traits")) || "",
            images: newUploads.length ? newUploads : editing.images,
            iconIds: selectedIconIds,
        } as const;

        try {
            const updated = await API.updateProduct(editing.id, payload);
            setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
            setEditing(null);
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            setError(err.message);
        }
    }


    async function handleDelete(product: Product) {
        const ok = await confirm(`Delete product "${product.name}"?`);
        if (!ok) return;
        
        try {
            await API.deleteProduct(product.id);
            setProducts(prev => prev.filter(p => p.id !== product.id));
        } catch (err: any) {
            setError(err.message);
        }
    }


    if (loading) return <div className="p-4">Loading…</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={editing ? handleUpdate : handleCreate} className="space-y-4 mb-8">
                <div className="flex gap-4 flex-wrap">
                    <div className="w-64">
                        <label className="block mb-1">Name</label>
                        <Input name="name" defaultValue={editing?.name} required />
                    </div>
                    <div className="w-40">
                        <label className="block mb-1">Price</label>
                        <Input name="price" type="number" step="0.01" defaultValue={editing?.price} required />
                    </div>
                    <div className="w-40">
                        <label className="block mb-1">Shipping</label>
                        <Input name="deliveryCost" type="number" step="0.01" defaultValue={editing?.deliveryCost ?? 6.95} required />
                    </div>
                    <div className="w-56">
                        <label className="block mb-1">Article #</label>
                        <Input name="articlenr" defaultValue={editing?.articlenr} required />
                    </div>
                    <div className="w-56">
                        <label className="block mb-1">Category</label>
                        <Select name="categoryId" defaultValue={editing?.categoryId?.toString() ?? ""} required>
                            <option value="" disabled>Select…</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="w-full md:w-2/3">
                    <label className="block mb-1">Description</label>
                    <Textarea name="description" defaultValue={editing?.description} required />
                </div>
                <div className="w-full md:w-2/3">
                    <label className="block mb-1">Traits</label>
                    <Textarea name="traits" placeholder="Waterdicht, UV-bescherming, Ademend" defaultValue={editing?.traits} />
                </div>
                <div>
                    <label className="block mb-1">Icons</label>
                    <IconSelector icons={icons} selected={editing ? (editing.iconIds ?? []) : selectedIconIds} onChange={(ids) => editing ? setEditing({ ...editing, iconIds: ids }) : setSelectedIconIds(ids)} />
                </div>
                <div className="w-64">
                    <label className="block mb-1">Images</label>
                    <FilePicker name="images" multiple required={!editing} />
                    {editing?.images?.length ? (
                        <ul className="flex gap-2 mt-2 flex-wrap">
                            {editing.images.map(img => (
                                <li key={img.url}>
                                    <img src={img.url} className="w-24 h-24 object-cover rounded" />
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
                <div className="flex gap-2">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="isNew" defaultChecked={editing?.isNew} /> New
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="inStock" defaultChecked={editing?.inStock} /> In stock
                    </label>
                </div>
                {editing && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-semibold mb-2">Variants</h3>
                        <VariantEditor
                            productId={editing.id}
                            variants={editing.variants}
                            onAdd={async (name, price) => {
                                await API.addVariant(editing.id, { name, price });
                                const refreshed = await API.getProducts();
                                setProducts(refreshed);
                                const fresh = refreshed.find(p => p.id === editing.id) || null;
                                setEditing(fresh);
                            }}
                            onUpdate={async (variantId, patch) => {
                                await API.updateVariant(editing.id, variantId, patch);
                                const refreshed = await API.getProducts();
                                setProducts(refreshed);
                                setEditing(refreshed.find(p => p.id === editing.id) || null);
                            }}
                            onDelete={async (variantId) => {
                                await API.deleteVariant(editing.id, variantId);
                                const refreshed = await API.getProducts();
                                setProducts(refreshed);
                                setEditing(refreshed.find(p => p.id === editing.id) || null);
                            }}
                        />
                    </div>
                )}
                <div className="flex gap-3">
                    <Button type="submit" className="bg-indigo-600 text-white">{editing ? "Update" : "Create"}</Button>
                    {editing && (
                        <Button type="button" onClick={() => { setEditing(null); setSelectedIconIds([]); }} className="bg-gray-200">Cancel</Button>
                    )}
                </div>
            </form>
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => (
                    <div key={p.id} className="border rounded p-4">
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{p.description}</p>
                        <p className="font-semibold mt-2">€{p.price.toFixed(2)}</p>
                        <p className="text-sm mt-1">Artikel: {p.articlenr}</p>
                        <div className="flex gap-2 mt-2">
                            {p.isNew && <Badge tone="green">Nieuw</Badge>}
                            {p.inStock ? <Badge tone="blue">In voorraad</Badge> : <Badge tone="red">Niet in voorraad</Badge>}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button onClick={() => { setEditing(p); setSelectedIconIds(p.iconIds ?? []); }} className="text-blue-600">Wijzig</Button>
                            <Button onClick={() => handleDelete(p)} className="text-red-600">Verwijder</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};