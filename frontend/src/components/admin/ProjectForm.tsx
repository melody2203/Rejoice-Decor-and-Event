"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { X, Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";

interface ProjectFormProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    onClose: () => void;
}

export function ProjectForm({ initialData, onSubmit, onClose }: ProjectFormProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        categoryId: initialData?.categoryId || "",
        imageUrls: initialData?.imageUrls || [],
        eventDate: initialData?.eventDate ? new Date(initialData.eventDate).toISOString().split('T')[0] : "",
    });
    const [newImageUrl, setNewImageUrl] = useState("");
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
        if (!formData.categoryId) {
            alert("Please select a category");
            return;
        }
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Failed to submit project:", error);
        } finally {
            setLoading(false);
        }
    };

    const addImageUrl = () => {
        if (newImageUrl && !formData.imageUrls.includes(newImageUrl)) {
            setFormData({
                ...formData,
                imageUrls: [...formData.imageUrls, newImageUrl]
            });
            setNewImageUrl("");
        }
    };

    const removeImageUrl = (index: number) => {
        const updatedUrls = [...formData.imageUrls];
        updatedUrls.splice(index, 1);
        setFormData({ ...formData, imageUrls: updatedUrls });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between shadow-lg">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? "Edit Project" : "Post New Work"}
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Project Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Elegant White Wedding"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                            <select
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Event Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
                                value={formData.eventDate}
                                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                        <textarea
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors h-24 resize-none shadow-inner"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the event and decor details..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1 text-gold-500">Image URL (Cloudinary)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold-500 transition-colors shadow-inner"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="Paste Cloudinary link here..."
                            />
                            <Button type="button" onClick={addImageUrl} variant="outline" className="border-gold-500/30 text-gold-500 px-3">
                                <Plus size={20} />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {formData.imageUrls.map((url: string, index: number) => (
                                <div key={index} className="relative group rounded-lg overflow-hidden border border-zinc-800 aspect-video shadow-md">
                                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImageUrl(index)}
                                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3 sticky bottom-0 bg-zinc-900 pb-2">
                        <Button variant="outline" type="button" onClick={onClose} className="border-gold-500/20 text-zinc-400 hover:text-white">
                            Cancel
                        </Button>
                        <Button variant="gold" type="submit" loading={loading}>
                            {initialData ? "Update Project" : "Save Project"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
