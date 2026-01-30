"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { Calendar, CreditCard, ChevronLeft, Success } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return router.push('/login');
        if (!startDate || !endDate) return setError('Please select event dates');

        setIsLoading(true);
        setError('');

        try {
            const bookingData = {
                startDate,
                endDate,
                items: items.map(item => ({
                    itemId: item.id,
                    quantity: item.quantity
                }))
            };

            await api.post('/bookings', bookingData);
            setIsSuccess(true);
            clearCart();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to submit booking request.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-6">
                <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-xl border border-gray-50">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Calendar className="text-green-600" size={32} />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-burgundy-950 mb-4">Request Sent!</h1>
                    <p className="text-gray-500 mb-10 leading-relaxed">
                        Your selection has been submitted. Our team will review the availability and contact you shortly to finalize the details and payment.
                    </p>
                    <Link href="/bookings">
                        <Button className="w-full">View My Bookings</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 bg-[#FDFBF7] min-h-screen">
            <div className="max-w-6xl mx-auto">
                <Link href="/rentals" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-burgundy-700 transition-colors mb-12 group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Continue Browsing
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-4xl font-serif font-bold text-burgundy-950 mb-8">Booking Details</h2>

                            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-burgundy-900 ml-4">Event Start</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                required
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-burgundy-800/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-burgundy-900 ml-4">Event End</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                required
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-burgundy-800/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-burgundy-50/50 rounded-2xl">
                                    <p className="text-sm text-burgundy-900 italic font-serif">
                                        "Please note that submitting this request does not guarantee availability. Our stylists will reach out within 24 hours."
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-burgundy-950 mb-6">Payment Preference</h2>
                            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm">
                                <div className="flex items-center gap-4 p-4 border-2 border-burgundy-800 rounded-2xl bg-burgundy-50/20">
                                    <div className="w-10 h-10 bg-burgundy-700 text-white rounded-full flex items-center justify-center">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-burgundy-900">Online Secure Payment</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-1">Stripe Integration Pending</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-xl sticky top-32">
                            <h3 className="text-xl font-serif font-bold text-burgundy-950 mb-8 border-b border-gray-50 pb-4">Order Summary</h3>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <div className="text-gray-600">
                                            <p className="font-bold text-burgundy-900">{item.name}</p>
                                            <p className="text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="font-bold text-burgundy-950">${item.pricePerDay * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-gray-50 pt-6 mb-8">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Subtotal</span>
                                    <span>${total}</span>
                                </div>
                                <div className="flex justify-between text-lg font-serif font-bold text-burgundy-950">
                                    <span>Total Due</span>
                                    <span>${total}</span>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

                            <Button
                                className="w-full py-5 rounded-3xl"
                                variant="gold"
                                loading={isLoading}
                                onClick={handleSubmit}
                                disabled={items.length === 0}
                            >
                                REQUEST BOOKING
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
