"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import { ShoppingBag, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Item {
    id: string;
    name: string;
    description: string;
    pricePerDay: number;
    pricePerWeekend?: number | null;
    durationNotes?: string | null;
    totalStock: number;
    imageUrl: string;
    categoryId: string;
}

export default function RentalsPage() {
    const { addItem } = useCart();
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsRes, catsRes] = await Promise.all([
                    api.get('/inventory'),
                    api.get('/inventory/categories')
                ]);
                setItems(itemsRes.data);
                setCategories(catsRes.data);
            } catch (err) {
                console.error('Failed to fetch rentals:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory ? item.categoryId === selectedCategory : true;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-12 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gold-950 mb-2 uppercase tracking-tight">Rental Catalog</h1>
                    <p className="text-gray-500 max-w-2xl font-medium">
                        Premium event decor inventory for professional setup and personal celebrations.
                    </p>
                </header>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <nav className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                                "px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all border",
                                selectedCategory === null
                                    ? "bg-gold-700 text-white border-gold-700"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gold-200"
                            )}
                        >
                            All Inventory
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all border",
                                    selectedCategory === cat.id
                                        ? "bg-gold-700 text-white border-gold-700"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gold-200"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </nav>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pl-12 pr-4 text-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Item Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg aspect-[3/4] animate-pulse" />
                        ))}
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="group bg-white rounded-lg border border-gray-100 flex flex-col h-full hover:border-gold-200 hover:shadow-sm transition-all duration-300"
                            >
                                {/* Small Product Image */}
                                <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-lg border-b border-gray-50">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ShoppingBag size={24} />
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="mb-2">
                                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-gold-700 transition-colors leading-tight">
                                            {item.name}
                                        </h3>
                                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Pricing & Duration */}
                                    <div className="mt-auto pt-3 border-t border-gray-50 space-y-2">
                                        <div className="flex flex-col gap-0.5">
                                            {item.pricePerDay && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Daily</span>
                                                    <span className="text-sm font-bold text-gold-900">{Number(item.pricePerDay).toLocaleString()} Birr</span>
                                                </div>
                                            )}
                                            {item.pricePerWeekend && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Weekend</span>
                                                    <span className="text-sm font-bold text-gold-900">{Number(item.pricePerWeekend).toLocaleString()} Birr</span>
                                                </div>
                                            )}
                                        </div>

                                        {item.durationNotes && (
                                            <p className="text-[10px] text-gold-900 font-medium bg-gold-50 px-2 py-0.5 rounded inline-block">
                                                {item.durationNotes}
                                            </p>
                                        )}

                                        <button
                                            onClick={() => addItem(item)}
                                            className="w-full mt-2 bg-gold-600 hover:bg-gold-700 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded transition-colors"
                                        >
                                            Request Rental
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={40} />
                        <p className="text-gray-500 font-medium italic">No items matching your selection.</p>
                        <button
                            className="mt-4 text-gold-700 text-sm font-bold underline"
                            onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                        >
                            Reset Catalog
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
