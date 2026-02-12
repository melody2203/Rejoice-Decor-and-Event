"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Globe, Award, Users, Star } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="pt-32 pb-24 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Hero Section */}
                <section className="text-center mb-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-gold-900 mb-8"
                    >
                        Our Story of Elegance
                    </motion.h1>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-32 h-1 bg-gold-500 mx-auto mb-12"
                    />
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic"
                    >
                        Rejoice Events & Decor was born from a passion for transforming moments into masterpieces.
                        We believe that every celebration deserves a touch of extraordinary beauty.
                    </motion.p>
                </section>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-16 mb-32">
                    <motion.div
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: -30 }}
                        viewport={{ once: true }}
                        className="bg-white p-12 rounded-[3rem] shadow-sm border border-gold-50"
                    >
                        <Heart className="text-gold-500 mb-6" size={40} />
                        <h2 className="text-3xl font-serif font-bold text-gold-900 mb-6">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To provide unparalleled event styling and decoration services that reflect our clients'
                            unique personalities and dreams. We strive for perfection in every petal, fabric, and light.
                        </p>
                    </motion.div>
                    <motion.div
                        whileInView={{ opacity: 1, x: 0 }}
                        initial={{ opacity: 0, x: 30 }}
                        viewport={{ once: true }}
                        className="bg-gold-900 p-12 rounded-[3rem] shadow-xl text-white"
                    >
                        <Star className="text-gold-400 mb-6" size={40} />
                        <h2 className="text-3xl font-serif font-bold mb-6 text-gold-50">Our Vision</h2>
                        <p className="text-white/80 leading-relaxed">
                            To be Ethiopia's most sought-after luxury event decorator, known for innovation,
                            sophistication, and creating unforgettable atmospheres that linger in memories forever.
                        </p>
                    </motion.div>
                </div>

                {/* Why Rejoice */}
                <section className="text-center mb-20">
                    <h2 className="text-4xl font-serif font-bold text-gold-900 mb-16">Why Rejoice?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[
                            { icon: Sparkles, title: "Sophisticated Design", desc: "We blend modern aesthetics with timeless elegance to create stunning visuals." },
                            { icon: Heart, title: "Personalized Touch", desc: "We specialize in creating decor that reflects the uniqueness of every client." },
                            { icon: Globe, title: "Cultural Service", desc: "We honor and celebrate Ethiopian traditions, bringing authentic cultural elements to every event." }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6 border border-gray-50">
                                    <stat.icon className="text-gold-700" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gold-900 mb-3">{stat.title}</h3>
                                <p className="text-gray-500 max-w-[250px]">{stat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
