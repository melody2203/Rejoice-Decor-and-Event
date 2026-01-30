"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

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

const GalleryPreview = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/portfolio/projects?limit=5');
                setProjects(res.data);
            } catch (err) {
                console.error('Failed to fetch projects', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <section className="py-24 px-6 bg-white text-center">
                <p className="text-gray-500 font-serif italic">Loading our masterpieces...</p>
            </section>
        );
    }

    // fallback layout if no projects
    if (projects.length === 0) {
        return null;
    }

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-burgundy-950 mb-4">Our Masterpieces</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto" />
                    <p className="mt-6 text-gray-500 max-w-2xl mx-auto">
                        A glimpse into the extraordinary transformations we&apos;ve created for our clients.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {projects.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative h-80 overflow-hidden rounded-2xl bg-gray-100 shadow-lg"
                        >
                            {/* Image placeholder - normally you'd use item.imageUrls[0] */}
                            <div className="absolute inset-0 bg-burgundy-900/10 group-hover:bg-burgundy-950/40 transition-all duration-500 z-10" />
                            {item.imageUrls && item.imageUrls.length > 0 ? (
                                <img
                                    src={item.imageUrls[0]}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full w-full text-burgundy-200 font-serif italic text-lg opacity-40">
                                    {item.category.name}
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-1">{item.category.name}</p>
                                <h3 className="text-xl font-serif font-bold text-white">{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="/portfolio"
                        className="inline-block px-8 py-3 bg-burgundy-900 text-white font-semibold rounded-full hover:bg-burgundy-800 transition-colors shadow-md"
                    >
                        View Full Portfolio
                    </a>
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;
