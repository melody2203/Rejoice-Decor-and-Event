"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { items, removeItem, updateQuantity, total, itemCount } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-burgundy-950/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-burgundy-800" size={24} />
                                <h2 className="text-xl font-serif font-bold text-burgundy-950">Your Selection</h2>
                                <span className="bg-gold-100 text-gold-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                    {itemCount} items
                                </span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-burgundy-50 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingBag size={32} className="text-burgundy-200" />
                                    </div>
                                    <h3 className="text-lg font-serif font-bold text-burgundy-900 mb-2">The cart is empty</h3>
                                    <p className="text-sm text-gray-400 mb-8">Choose the finest pieces for your unforgettable celebration.</p>
                                    <Button variant="outline" onClick={onClose}>Continue Browsing</Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center text-[10px] text-burgundy-200 font-serif italic text-center p-2">
                                            {item.name}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between mb-1">
                                                <h4 className="text-sm font-bold text-burgundy-950">{item.name}</h4>
                                                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-3">${item.pricePerDay} / day</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-1 hover:bg-white rounded transition-all text-gray-500"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold text-burgundy-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-1 hover:bg-white rounded transition-all text-gray-500"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold text-burgundy-800">${item.pricePerDay * item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 bg-gray-50 border-t border-gray-100">
                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>${total}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Rental Duration</span>
                                        <span className="text-burgundy-700 font-medium italic">1 Day (Default)</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-serif font-bold text-burgundy-950 pt-3 border-t border-gray-200">
                                        <span>Estimated Total</span>
                                        <span>${total}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" onClick={onClose}>
                                    <Button className="w-full py-4 text-sm tracking-[0.2em]" icon={ArrowRight}>
                                        GO TO CHECKOUT
                                    </Button>
                                </Link>
                                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-tighter">
                                    Availability will be confirmed during checkout
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
