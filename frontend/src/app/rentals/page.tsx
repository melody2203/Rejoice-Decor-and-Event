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
    totalStock: number;
    imageUrl: string;
    categoryId: string;
}

export default function RentalsPage() {
    const { addItem } = useCart();
    const [items, setItems] = useState<Item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsRes, catsRes] = await Promise.all([
                    api.get('/inventory'),
                    api.get('/portfolio/categories')
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

    const filteredItems = selectedCategory
        ? items.filter(item => item.categoryId === selectedCategory)
        : items;

    return (
        <div className="pt-32 pb-24 px-6 bg-[#FDFBF7] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-burgundy-950 mb-4">Decor Rentals</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mb-6" />
                    <p className="text-gray-500 max-w-2xl mx-auto italic font-serif">
                        Exquisite pieces curated for your most precious celebrations.
                    </p>
                </header>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={cn(
                                "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                                selectedCategory === null
                                    ? "bg-burgundy-800 text-white shadow-lg"
                                    : "bg-white text-gray-500 hover:bg-gray-100"
                            )}
                        >
                            All Pieces
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                                    selectedCategory === cat.id
                                        ? "bg-burgundy-800 text-white shadow-lg"
                                        : "bg-white text-gray-500 hover:bg-gray-100"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search decor..."
                            className="w-full bg-white border-none rounded-full py-3 pl-12 pr-6 text-sm shadow-sm focus:ring-2 focus:ring-burgundy-800/10 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Item Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] h-96 animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col h-full"
                            >
                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                    <div className="absolute inset-0 bg-burgundy-900/5 group-hover:bg-burgundy-900/10 transition-all duration-500 z-10" />
                                    <div className="w-full h-full flex items-center justify-center text-burgundy-200 font-serif italic">
                                        {item.name}
                                    </div>
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-burgundy-800 shadow-sm uppercase tracking-wider">
                                            {item.totalStock} in stock
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-serif font-bold text-burgundy-950 mb-2 truncate group-hover:text-burgundy-800 transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-6 line-clamp-2 italic leading-relaxed">
                                        {item.description || "A centerpiece of timeless beauty and craftsmanship."}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Daily Rate</p>
                                            <p className="text-xl font-bold text-burgundy-950">${item.pricePerDay}</p>
                                        </div>
                                        <Button
                                            size="sm"
                                            icon={ShoppingBag}
                                            variant="outline"
                                            className="rounded-xl"
                                            onClick={() => addItem(item)}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm border border-dashed border-burgundy-100">
                        <ShoppingBag className="mx-auto text-burgundy-100 mb-4" size={48} />
                        <p className="text-gray-400 font-serif italic text-lg">No pieces found in this collection.</p>
                        <Button variant="ghost" className="mt-4" onClick={() => setSelectedCategory(null)}>Clear Filters</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
