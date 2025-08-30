import { AdminNav } from "@/components/admin/AdminNav";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin</h1>
            <AdminNav />
            {children}
        </div>
    );
};