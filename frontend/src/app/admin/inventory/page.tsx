"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Package, Search } from "lucide-react";
import { InventoryForm } from "@/components/admin/InventoryForm";

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchInventory = async () => {
        try {
            const res = await api.get("/inventory");
            setItems(res.data);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleSubmit = async (data: any) => {
        try {
            if (editingItem) {
                await api.put(`/inventory/${editingItem.id}`, data);
            } else {
                await api.post("/inventory", data);
            }
            fetchInventory();
        } catch (error) {
            console.error("Failed to save inventory item:", error);
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await api.delete(`/inventory/${id}`);
            fetchInventory();
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 uppercase tracking-wider font-serif">
                        <Package className="text-gold-500" />
                        Inventory Management
                    </h1>
                    <p className="text-zinc-500 mt-2 font-light">Track stock levels and pricing for all decor rentals.</p>
                </div>
                <Button
                    variant="gold"
                    onClick={() => {
                        setEditingItem(null);
                        setShowForm(true);
                    }}
                >
                    <Plus size={20} className="mr-2" />
                    New Item
                </Button>
            </div>

            <div className="relative group max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-gold-500 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search by name or category..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-500/50 transition-all shadow-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-800">
                            <th className="px-6 py-4 text-gold-500/80">Item</th>
                            <th className="px-6 py-4 text-gold-500/80">Category</th>
                            <th className="px-6 py-4 text-gold-500/80">Stock</th>
                            <th className="px-6 py-4 text-gold-500/80">Price / Day</th>
                            <th className="px-6 py-4 text-gold-500/80 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                    <div className="animate-pulse flex items-center justify-center gap-3 text-gold-500">
                                        <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" />
                                        Loading inventory...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 font-light italic">
                                    No items found.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-zinc-800/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} className="w-10 h-10 rounded-lg object-cover border border-zinc-800" alt="" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600">
                                                    <Package size={20} />
                                                </div>
                                            )}
                                            <div className="font-semibold text-white uppercase text-xs tracking-wider">{item.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded uppercase tracking-tighter">
                                            {item.category?.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-white font-mono">{item.totalStock}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gold-500 font-bold">${parseFloat(item.pricePerDay).toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setShowForm(true);
                                                }}
                                                className="p-2 text-zinc-500 hover:text-gold-500 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <InventoryForm
                    initialData={editingItem}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
