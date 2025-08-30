"use client";
import { useEffect, useMemo, useState } from "react";
import { API } from "@/lib/api";
import { Order, ShippingAddress } from "@/types";
import { Select } from "@/components/ui/Select";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setOrders(await API.getOrders());
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const processed = useMemo(() => orders.map(o => ({ ...o, shippingParsed: parseShipping(o.shippingAddress) })), [orders]);


    async function updateStatus(id: number, status: Order["status"]) {
        try {
            await API.updateOrderStatus(id, status);
            setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
        } catch (e: any) {
            setError(e.message);
        }
    }

    if (loading) return <div>Loading…</div>;
    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="space-y-4 w-full lg:w-4/5">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            {processed.map(order => (
                <div key={order.id} className="border rounded p-4">
                    <p className="font-semibold text-lg">Order #{order.id} – Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="overflow-x-auto mt-2">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">Product</th>
                                    <th className="text-right py-2">Aantal</th>
                                    <th className="text-right py-2">Prijs / stuk</th>
                                    <th className="text-right py-2">Totaal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems.map((item, idx) => (
                                    <tr key={idx} className="border-b">
                                        <td className="py-2">
                                            <div>
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-gray-500">Artikel: {item.product.articlenr}</p>
                                                <p className="text-gray-500">Variant: {item.variant?.name ?? "-"}</p>
                                            </div>
                                        </td>
                                        <td className="text-right py-2">{item.quantity}</td>
                                        <td className="text-right py-2">€{item.price.toFixed(2)}</td>
                                        <td className="text-right py-2">€{(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold">
                                    <td colSpan={3} className="text-right py-2">Totaal:</td>
                                    <td className="text-right py-2">€{order.totalPrice.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="text-sm text-gray-700 mt-3">
                        <p className="font-semibold">Gebruiker</p>
                        <p>Voornaam: {order.shippingParsed.firstName} – Achternaam: {order.shippingParsed.lastName}</p>
                        {order.shippingParsed.company && <p>Bedrijf: {order.shippingParsed.company}</p>}
                        <p>{order.shippingParsed.street}, {order.shippingParsed.postalCode} {order.shippingParsed.city}</p>
                        <p>Telefoon: {order.shippingParsed.phone}</p>
                    </div>
                    <div className="mt-3">
                        <Select value={order.status} onChange={e => updateStatus(order.id, e.target.value as Order["status"])}>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </Select>
                    </div>
                </div>
            ))}
        </div>
    );
};

function parseShipping(json: string): ShippingAddress {
    try {
        return JSON.parse(json);
    } catch {
        return { firstName: "", lastName: "", street: "", postalCode: "", city: "", phone: "", country: "Nederland" };
    }
};