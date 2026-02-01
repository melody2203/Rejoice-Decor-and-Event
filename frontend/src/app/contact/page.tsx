"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';

const ContactPage = () => {
    return (
        <div className="pt-32 pb-24 bg-[#FDFBF7]">
            <div className="max-w-7xl mx-auto px-6">
                <header className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-serif font-bold text-gold-900 mb-6"
                    >
                        Get In Touch
                    </motion.h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mb-8" />
                    <p className="text-xl text-gray-500 font-serif italic max-w-2xl mx-auto">
                        We'd love to hear about your upcoming event and how we can make it extraordinary.
                    </p>
                </header>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gold-50">
                            <h2 className="text-3xl font-serif font-bold text-gold-900 mb-10">Contact Details</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin className="text-gold-700" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Our Location</p>
                                        <p className="text-lg text-gold-900 font-medium">Bole, Addis Ababa, Ethiopia</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <Phone className="text-gold-800" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                                        <p className="text-lg text-gold-900 font-medium">+251 945 737 700</p>
                                        <p className="text-lg text-gold-900 font-medium">+251 961 023 723</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 bg-gold-50 rounded-2xl flex items-center justify-center shrink-0">
                                        <Mail className="text-gold-800" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                                        <p className="text-lg text-gold-900 font-medium">hello@rejoicedecor.com</p>
                                        <p className="text-lg text-gold-900 font-medium">bookings@rejoicedecor.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {[Instagram, Facebook, MessageSquare].map((Icon, i) => (
                                <a key={i} href="#" className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 hover:bg-gold-500 hover:text-white transition-all">
                                    <Icon size={24} />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-gray-50"
                    >
                        <form className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-700/20 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                    <input type="email" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-800/10 outline-none transition-all" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Subject</label>
                                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-800/10 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Message</label>
                                <textarea rows={5} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-800/10 outline-none transition-all resize-none"></textarea>
                            </div>
                            <Button className="w-full py-5 rounded-2xl group shadow-lg shadow-gold-900/10" icon={Send}>
                                Send Message
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
