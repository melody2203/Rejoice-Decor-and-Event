"use client";

import React from 'react';
import { motion } from 'framer-motion';

const samples = [
    { id: 1, title: 'Royal Wedding', category: 'Wedding', span: 'col-span-1 row-span-2' },
    { id: 2, title: 'Gold Anniversary', category: 'Engagement', span: 'col-span-1 row-span-1' },
    { id: 3, title: 'Crystal Birthday', category: 'Birthday', span: 'col-span-1 row-span-1' },
    { id: 4, title: 'Floral Graduation', category: 'Graduation', span: 'col-span-1 row-span-2' },
    { id: 5, title: 'Silk Backdrop', category: 'Wedding', span: 'col-span-2 row-span-1' },
];

const GalleryPreview = () => {
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {samples.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl bg-gray-100",
                                item.span
                            )}
                        >
                            <div className="absolute inset-0 bg-burgundy-900/20 group-hover:bg-burgundy-950/40 transition-all duration-500 z-10" />
                            <div className="flex items-center justify-center h-full w-full text-burgundy-200 font-serif italic text-lg opacity-40">
                                {item.category}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-1">{item.category}</p>
                                <h3 className="text-xl font-serif font-bold text-white">{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;

// Inline component helper
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
