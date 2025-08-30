"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/icons", label: "Icons" },
];

export function AdminNav() {
    const pathname = usePathname();
    return (
        <nav className="flex gap-2 mb-6">
            {items.map((i) => {
                const active = pathname.startsWith(i.href);
                return (
                    <Link
                        key={i.href}
                        href={i.href}
                        className={`px-3 py-2 rounded ${active ? "bg-yellow-400 text-black" : "bg-gray-200"}`}
                    >
                        {i.label}
                    </Link>
                );
            })}
        </nav>
    );
};