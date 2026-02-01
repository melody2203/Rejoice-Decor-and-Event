"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Project {
    id: string;
    title: string;
    description: string;
    imageUrls: string[];
    category: {
        name: string;
        slug: string;
    };
}

export default function PortfolioPage() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';

    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, catRes] = await Promise.all([
                    api.get('/portfolio/projects'),
                    api.get('/portfolio/categories')
                ]);

                // Use API data directly
                const apiProjects = projRes.data || [];
                setProjects(apiProjects);

                // Add hardcoded categories if not present (fallback for UI filtering)
                const apiCategories = catRes.data || [];
                const hardcodedCategories = [
                    { id: 'wedding-cat', name: 'Wedding', slug: 'wedding' },
                    { id: 'birthday-cat', name: 'Birthday', slug: 'birthday' },
                    { id: 'graduation-cat', name: 'Graduation', slug: 'graduation' },
                    { id: 'engagement-cat', name: 'Engagement', slug: 'engagement' },
                    { id: 'corporate-cat', name: 'Corporate', slug: 'corporate' }
                ];

                const combinedCategories = [...apiCategories];
                hardcodedCategories.forEach(hCat => {
                    if (!combinedCategories.some(cat => cat.slug === hCat.slug)) {
                        combinedCategories.unshift(hCat);
                    }
                });

                // Filter to include corporate as well
                const allowedCategories = ['wedding', 'birthday', 'graduation', 'engagement', 'corporate'];
                const filteredCategories = combinedCategories.filter(cat => allowedCategories.includes(cat.slug));

                setCategories(filteredCategories);
            } catch (err) {
                console.error('Failed to fetch portfolio data', err);
                setProjects([]); // Fallback to empty or maybe handled differently if needed
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter(p => p.category.slug === activeCategory);

    if (loading) {
        return (
            <div className="pt-32 pb-20 text-center">
                <p className="text-gray-500 font-serif italic text-xl">Discovering masterpieces...</p>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-gold-900 mb-6 underline decoration-gold-500 underline-offset-8">Our Portfolio</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto italic">
                        Explore our past works across different event categories. Each project is a testament to our dedication to elegance and detail.
                    </p>
                </header>

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-6 py-2 rounded-full border transition-all duration-300 ${activeCategory === 'all'
                            ? 'bg-gold-800 text-white border-gold-800 shadow-md'
                            : 'bg-white text-gold-900 border-gold-100 hover:border-gold-800'
                            }`}
                    >
                        All Works
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.slug)}
                            className={`px-6 py-2 rounded-full border transition-all duration-300 ${activeCategory === cat.slug
                                ? 'bg-gold-800 text-white border-gold-800 shadow-md'
                                : 'bg-white text-gold-900 border-gold-100 hover:border-gold-800'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Projects Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
                            >
                                <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                                    {project.imageUrls && project.imageUrls.length > 0 ? (
                                        <img
                                            src={project.imageUrls[0]}
                                            alt={project.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gold-300 italic font-serif text-2xl opacity-40">
                                            {project.category.name}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-x-4 bottom-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform flex items-center justify-center">
                                    <p className="text-sm font-bold text-gold-600 uppercase tracking-[0.2em]">{project.category.name}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl">
                        <p className="text-gray-500 font-serif italic text-lg">No projects found in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
