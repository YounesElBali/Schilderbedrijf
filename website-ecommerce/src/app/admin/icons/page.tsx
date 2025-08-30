"use client";
import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import { Icon } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FilePicker } from "@/components/admin/FilePicker";
import { confirm } from "@/components/admin/ConfirmDialog";

export default function IconsPage() {
    const [icons, setIcons] = useState<Icon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setIcons(await API.getIcons());
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
        const name = String(fd.get("name"));
        const file = fd.get("image") as File | null;
        if (!file) return;
        
        try {
            const { path } = await API.uploadFile(file);
            const created = await API.createIcon({ name, url: path });
            setIcons(prev => [...prev, created]);
            (e.target as HTMLFormElement).reset();
        } catch (e: any) {
            setError(e.message);
        }
    }

    async function handleDelete(id: number) {
        if (!(await confirm("Delete icon?"))) return;
        await API.deleteIcon(id);
        setIcons(prev => prev.filter(i => i.id !== id));
    }

    if (loading) return <div>Loading…</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Iconen</h2>
            <form onSubmit={handleCreate} className="grid gap-3 max-w-md mb-6">
                <div>
                    <label className="block mb-1">Naam</label>
                    <Input name="name" required placeholder="Bijv. UV-bestendig" />
                </div>
                <div>
                    <label className="block mb-1">Afbeelding</label>
                    <FilePicker name="image" required />
                </div>
                <Button type="submit" className="bg-blue-600 text-white">Toevoegen</Button>
            </form>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {icons.map(icon => (
                    <div key={icon.id} className="border p-2 rounded flex flex-col items-center text-center">
                        <img src={icon.url} alt={icon.name} className="w-16 h-16 object-contain mb-2" />
                        <p className="text-sm font-medium">{icon.name}</p>
                        <Button onClick={() => handleDelete(icon.id)} className="text-red-600 mt-2">Verwijderen</Button>
                    </div>
                ))}
            </div>
        </div>
);
};