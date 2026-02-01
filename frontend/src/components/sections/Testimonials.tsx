"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Abel Tekle",
        role: "Groom",
        content: "Rejoice Decor transformed our wedding venue into a dream. Their attention to detail and traditional Ethiopian touches were perfect.",
        rating: 5
    },
    {
        name: "Sara Yilma",
        role: "Event Planner",
        content: "The quality of their rental items is unmatched in Addis. Highly professional and always on time.",
        rating: 5
    },
    {
        name: "Dawit Berhane",
        role: "Corporate Client",
        content: "Our anniversary gala was stunning. They really understood our brand and delivered a sophisticated atmosphere.",
        rating: 5
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-[#FCF9F1] px-6 relative overflow-hidden">
            {/* Soft decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold-100/20 blur-[100px] rounded-full -ml-48 -mt-48" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <span className="text-gold-600 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Testimonials</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">What Our Clients Say</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-10 rounded-[3rem] bg-white border border-gray-100 backdrop-blur-sm relative group hover:border-gold-200 transition-colors"
                        >
                            <Quote className="absolute top-8 right-8 text-gold-200 group-hover:text-gold-400 transition-colors" size={48} />
                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-gold-500 text-gold-500" />
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-8 leading-relaxed relative z-10">
                                "{t.content}"
                            </p>
                            <div>
                                <p className="font-serif font-bold text-gray-900">{t.name}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{t.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
