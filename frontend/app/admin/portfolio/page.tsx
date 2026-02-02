"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Image as ImageIcon, ExternalLink } from "lucide-react";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function PortfolioPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);

    const fetchProjects = async () => {
        try {
            const res = await api.get("/portfolio/projects");
            setProjects(res.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSubmit = async (data: any) => {
        try {
            if (editingProject) {
                await api.put(`/portfolio/projects/${editingProject.id}`, data);
            } else {
                await api.post("/portfolio/projects", data);
            }
            fetchProjects();
        } catch (error) {
            console.error("Failed to save project:", error);
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await api.delete(`/portfolio/projects/${id}`);
            fetchProjects();
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 uppercase tracking-wider font-serif">
                        <ImageIcon className="text-gold-500" />
                        Manage Portfolio
                    </h1>
                    <p className="text-zinc-500 mt-2 font-light">Showcase your best event decorations and previous works.</p>
                </div>
                <Button
                    variant="gold"
                    onClick={() => {
                        setEditingProject(null);
                        setShowForm(true);
                    }}
                >
                    <Plus size={20} className="mr-2" />
                    New Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-2xl h-64 animate-pulse shadow-inner"></div>
                    ))
                ) : projects.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-950 border border-zinc-900 rounded-2xl shadow-inner font-light italic">
                        No projects found. Share your first masterpiece!
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-gold-500/30 transition-all flex flex-col shadow-xl">
                            <div className="relative aspect-video bg-zinc-950">
                                {project.imageUrls?.[0] ? (
                                    <img
                                        src={project.imageUrls[0]}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-800">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            setEditingProject(project);
                                            setShowForm(true);
                                        }}
                                        className="p-2 bg-black/60 text-white rounded-lg hover:text-gold-500 transition-colors backdrop-blur-sm"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="p-2 bg-black/60 text-white rounded-lg hover:text-red-500 transition-colors backdrop-blur-sm"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-gold-500 text-gold-950 text-[10px] font-bold rounded uppercase tracking-tighter shadow-md">
                                    {project.category?.name}
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-bold text-white line-clamp-1 group-hover:text-gold-500 transition-colors uppercase text-sm tracking-wide">{project.title}</h3>
                                    <span className="text-[10px] text-zinc-500 font-mono shrink-0 italic">
                                        {new Date(project.eventDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-zinc-500 text-xs line-clamp-2 mb-4 flex-1 font-light leading-relaxed">
                                    {project.description || "No description provided."}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800/50 pt-3">
                                    <span className="flex items-center gap-1 group-hover:text-zinc-300 transition-colors">
                                        <ImageIcon size={12} className="text-gold-500/50" />
                                        {project.imageUrls?.length || 0} Images
                                    </span>
                                    <a href={`/portfolio?slug=${project.category?.slug}`} target="_blank" className="flex items-center gap-1 hover:text-gold-500 transition-colors uppercase tracking-widest font-bold text-[9px] group/link">
                                        View on site <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showForm && (
                <ProjectForm
                    initialData={editingProject}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
