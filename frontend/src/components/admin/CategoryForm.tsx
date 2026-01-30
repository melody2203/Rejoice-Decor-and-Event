"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";

interface CategoryFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    onClose: () => void;
}

export function CategoryForm({ initialData, onSubmit, onClose }: CategoryFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        imageUrl: initialData?.imageUrl || "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Failed to submit category:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? "Edit Category" : "Add New Category"}
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Wedding Decor"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Slug (URL friendly)</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            placeholder="e.g. wedding-decor"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                        <textarea
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors h-24 resize-none shadow-inner"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of this category..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Image URL</label>
                        <input
                            type="text"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://cloudinary.com/..."
                        />
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                        <Button variant="outline" type="button" onClick={onClose} className="border-gold-500/20 text-zinc-400 hover:text-white">
                            Cancel
                        </Button>
                        <Button variant="gold" type="submit" loading={loading}>
                            {initialData ? "Update Category" : "Create Category"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
