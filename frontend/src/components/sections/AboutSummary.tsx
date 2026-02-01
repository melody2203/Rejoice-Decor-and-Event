"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Globe } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        icon: Sparkles,
        title: "Sophisticated Design",
        description: "We blend modern aesthetics with timeless elegance to create stunning visuals."
    },
    {
        icon: Heart,
        title: "Personalized Touch",
        description: "We specialize in creating decor that reflects the uniqueness of every client, adding personal touches to every event."
    },
    {
        icon: Globe,
        title: "Cultural Service",
        description: "We honor and celebrate Ethiopian traditions, bringing authentic cultural elements to every event."
    }
];

const AboutSummary = () => {
    return (
        <section className="py-24 bg-white px-6 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold-50/30 blur-[100px] rounded-full -ml-48 -mt-48" />

            <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <span className="text-gold-600 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Our Story</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Redefining Events with <br /> Passion & Grace</h2>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        Rejoice Events & Decor is more than just a styling company. We are creators of memories, dedicated to transforming spaces into magical environments that capture the essence of your most precious moments.
                    </p>
                    <Link href="/about" className="text-gold-700 font-bold hover:text-gold-600 transition-colors inline-flex items-center gap-2 border-b-2 border-gold-600 pb-1">
                        Discover More About Us
                    </Link>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 rounded-[3rem] bg-[#FCF9F1] hover:bg-cream-100 transition-colors group border border-gray-100 hover:border-gold-200 backdrop-blur-sm"
                    >
                        <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-gold-200 transition-colors">
                            <feature.icon size={32} className="text-gold-600 group-hover:text-gold-700 transition-colors" />
                        </div>
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default AboutSummary;
