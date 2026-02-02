"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';

const RentalsPreview = () => {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await api.get('/inventory');
                setItems(res.data.slice(0, 4)); // Show top 4
            } catch (err) {
                console.error('Failed to fetch rental items', err);
            }
        };
        fetchItems();
    }, []);

    return (
        <section className="py-24 bg-[#FCF9F1] px-6 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 blur-[100px] rounded-full -mr-48 -mt-48" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-gold-600 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Premium Rentals</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold-900 mb-6">Exquisite Decor at <br /> Your Fingertips</h2>
                        <p className="text-gray-600 leading-relaxed italic border-l-2 border-gold-500/30 pl-6">
                            "Beyond styling, we offer our premium inventory and specialized decor tools for rent to fellow decorators and event professionals. Let's elevate every event together."
                        </p>
                    </div>
                    <Link href="/rentals" className="flex items-center gap-2 text-gold-700 font-bold hover:text-gold-600 transition-all group">
                        Browse Full Inventory <ArrowRight size={20} className="text-gold-500 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.length > 0 ? items.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white border border-gold-50 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
                        >
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Package size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-gold-900 border border-gold-50">
                                    ETB {item.pricePerDay}/day
                                </div>
                            </div>
                            <div className="p-8">
                                <p className="text-[10px] uppercase tracking-widest text-gold-600 font-bold mb-2">{item.category?.name || 'Decor'}</p>
                                <h3 className="text-lg font-serif font-bold text-gold-900 mb-4">{item.name}</h3>
                                <Link href="/rentals" className="text-xs font-bold text-gray-400 group-hover:text-gold-700 transition-colors flex items-center gap-1">
                                    Rent Now <ArrowRight size={14} />
                                </Link>
                            </div>
                        </motion.div>
                    )) : (
                        // Skeleton/Placeholder
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-gray-50 aspect-[3/4] rounded-[2.5rem] animate-pulse" />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default RentalsPreview;
