"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import { Plus, Edit2, Trash2, FolderTree } from "lucide-react";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const fetchCategories = async () => {
        try {
            const res = await api.get("/portfolio/categories");
            setCategories(res.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (data: any) => {
        try {
            if (editingCategory) {
                await api.put(`/portfolio/categories/${editingCategory.id}`, data);
            } else {
                await api.post("/portfolio/categories", data);
            }
            fetchCategories();
        } catch (error) {
            console.error("Failed to save category:", error);
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category? This might affect projects linked to it.")) return;
        try {
            await api.delete(`/portfolio/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 uppercase tracking-wider font-serif">
                        <FolderTree className="text-gold-500" />
                        Manage Categories
                    </h1>
                    <p className="text-zinc-500 mt-2 font-light">Create and organize event categories for your catalog.</p>
                </div>
                <Button
                    variant="gold"
                    onClick={() => {
                        setEditingCategory(null);
                        setShowForm(true);
                    }}
                >
                    <Plus size={20} className="mr-2" />
                    Add Category
                </Button>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-800">
                            <th className="px-6 py-4 text-gold-500/80">Name</th>
                            <th className="px-6 py-4 text-gold-500/80">Slug</th>
                            <th className="px-6 py-4 text-gold-500/80 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                                    <div className="animate-pulse flex items-center justify-center gap-3 text-gold-500">
                                        <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" />
                                        Loading categories...
                                    </div>
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-zinc-500 font-light italic">
                                    No categories found. Start by adding one!
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-zinc-800/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-white group-hover:text-gold-500 transition-colors uppercase text-sm tracking-wide">{category.name}</div>
                                        {category.description && (
                                            <div className="text-xs text-zinc-500 mt-1 line-clamp-1 font-light">{category.description}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-zinc-500 font-mono text-xs italic tracking-tighter">/{category.slug}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(category);
                                                    setShowForm(true);
                                                }}
                                                className="p-2 text-zinc-500 hover:text-gold-500 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
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
                <CategoryForm
                    initialData={editingCategory}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
