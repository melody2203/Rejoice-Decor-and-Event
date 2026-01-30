"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { X, Package, DollarSign, List } from "lucide-react";
import api from "@/lib/api";

interface InventoryFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    onClose: () => void;
}

export function InventoryForm({ initialData, onSubmit, onClose }: InventoryFormProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        categoryId: initialData?.categoryId || "",
        totalStock: initialData?.totalStock?.toString() || "",
        pricePerDay: initialData?.pricePerDay?.toString() || "",
        imageUrl: initialData?.imageUrl || "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/portfolio/categories");
                setCategories(res.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Failed to submit inventory item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider font-serif">
                        {initialData ? "Edit Item" : "Add Inventory Item"}
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gold-500/80 mb-1 ml-1">Item Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner text-sm"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Gold Tiffany Chair"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gold-500/80 mb-1 ml-1">Total Stock</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner text-sm"
                                    value={formData.totalStock}
                                    onChange={(e) => setFormData({ ...formData, totalStock: e.target.value })}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gold-500/80 mb-1 ml-1">Price / Day</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner text-sm"
                                    value={formData.pricePerDay}
                                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gold-500/80 mb-1 ml-1">Category</label>
                        <div className="relative">
                            <List className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <select
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner text-sm appearance-none"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gold-500/80 mb-1 ml-1">Description</label>
                        <textarea
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors h-24 resize-none shadow-inner text-sm"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the item..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gold-500/80 mb-1 ml-1">Image URL</label>
                        <input
                            type="text"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner text-sm"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://cloudinary.com/..."
                        />
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                        <Button variant="outline" type="button" onClick={onClose} className="border-gold-500/20 text-zinc-500 hover:text-white">
                            Cancel
                        </Button>
                        <Button variant="gold" type="submit" loading={loading}>
                            {initialData ? "Update Item" : "Add to Inventory"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
