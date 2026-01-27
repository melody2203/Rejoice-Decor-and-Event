"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FDFBF7] pt-20">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-burgundy-50/50 blur-[120px] rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gold-50/50 blur-[100px] rounded-full -ml-10 -mb-10" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 bg-burgundy-100 text-burgundy-800 text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-6">
                        Luxury Event Styling
                    </span>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-burgundy-950 leading-[1.1] mb-8">
                        Elegance in <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-burgundy-800 to-gold-600 italic">
                            Every Detail
                        </span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-lg mb-10 leading-relaxed">
                        Rejoice Events & Decor brings your dreams to life with sophisticated floral arrangements, premium rentals, and bespoke event styling for those who seek the extraordinary.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/gallery"
                            className="px-8 py-4 bg-burgundy-800 text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-burgundy-950 transition-all shadow-xl hover:shadow-2xl group"
                        >
                            Explore Our Work
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/rentals"
                            className="px-8 py-4 bg-white text-burgundy-900 border border-burgundy-100 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-md"
                        >
                            Rent Decor
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl skew-y-1">
                        <div className="absolute inset-0 bg-burgundy-900/10 z-10" />
                        <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center text-burgundy-300 font-serif italic text-2xl">
                            Premium event showcase image
                        </div>
                    </div>

                    {/* Floating badge */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-50 z-20 hidden md:block"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 font-bold text-xl">5★</div>
                            <div>
                                <p className="text-sm font-bold text-burgundy-950">Top Rated</p>
                                <p className="text-xs text-gray-400">Luxury Event Planners</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
