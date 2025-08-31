"use client";
import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FilePicker } from "@/components/admin/FilePicker";
import { confirm } from "@/components/admin/ConfirmDialog";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
        try {
            const data = await API.getCategories();
            setCategories(data);
        } catch (e: unknown) {
            console.log(e)
        } finally {
            setLoading(false);
        } })();
    }, []);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const name = String(fd.get("name"));
        const path = String(fd.get("path"));
        const file = fd.get("image") as File | null;
        if (!file) return;

        try {
            const { path: image } = await API.uploadFile(file);
            const created = await API.createCategory({ name, image, path });
            setCategories(prev => [...prev, created]);
            (e.target as HTMLFormElement).reset();
        } catch (error: unknown) {
  console.error('Error:', error);
}
    };   

    async function handleDelete(category: Category) {
        const ok = await confirm(`Delete category "${category.name}"? This may delete related products on the server.`);
        if (!ok) return;
        try {
            await API.deleteCategory(category.id);
            setCategories(prev => prev.filter(c => c.id !== category.id));
        } catch (error: unknown) {
  console.error('Error:', error);
}
    };   

    if (loading) return <div className="p-4">Loading…</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>
            <form onSubmit={handleCreate} className="space-y-4 mb-8 max-w-md">
                <div>
                    <label className="block mb-1">Name</label>
                    <Input name="name" required />
                </div>
                <div>
                    <label className="block mb-1">Image</label>
                    <FilePicker name="image" required />
                </div>
                <div>
                    <label className="block mb-1">Path</label>
                    <Input name="path" required />
                </div>
                <Button type="submit" className="bg-indigo-600 text-white">Create</Button>
            </form>
            <h2 className="text-xl font-semibold mb-4">Category List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {categories.map(c => (
                    <div key={c.id} className="border rounded p-4">
                        <h3 className="font-semibold">{c.name}</h3>
                        <img src={c.image} alt={c.name} className="w-full h-32 object-cover mt-2" />
                        <p className="text-sm text-gray-600 mt-2">Path: {c.path}</p>
                        <div className="flex gap-2 mt-2">
                            <Button onClick={() => handleDelete(c)} className="text-red-600">Delete</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};