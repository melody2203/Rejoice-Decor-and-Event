"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

const BookingCTA = () => {
    const router = useRouter();

    return (
        <section className="py-24 bg-[#FDFBF7] relative overflow-hidden px-6">
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed" />

            <div className="max-w-5xl mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-12 md:p-20 rounded-[4rem] border border-gold-50 bg-white shadow-2xl relative overflow-hidden"
                >
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-gold-900 mb-8">Ready to create unforgettable <br /> memories with Us?</h2>
                    <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto leading-relaxed italic">
                        "Your celebration deserves nothing less than perfection. Let's make it happen together."
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button
                            onClick={() => router.push('/booking')}
                            className="bg-gold-500 hover:bg-gold-600 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-lg shadow-gold-500/20"
                        >
                            Book Your Date Now
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/contact')}
                            className="border-gold-100 text-gold-900 hover:bg-gray-50 px-12 py-5 rounded-2xl text-lg font-bold"
                        >
                            Contact Us
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold-200/20 blur-[100px] rounded-full -ml-48 -mt-48" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-100/30 blur-[100px] rounded-full -mr-48 -mb-48" />
        </section>
    );
};

export default BookingCTA;
