"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { Calendar, CreditCard, ChevronLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '@/components/sections/PaymentForm';

const paymentMethods = [
    { id: 'telebirr', name: 'Telebirr', icon: '📱' },
    { id: 'cbe_birr', name: 'CBE Birr', icon: '🏦' },
    { id: 'cbe_transfer', name: 'Commercial Bank of Ethiopia', icon: '💳' },
    { id: 'awash_bank', name: 'Awash Bank', icon: '🏗️' },
    { id: 'stripe', name: 'Online (Card/Stripe)', icon: '💳' },
];

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutContent />
        </Elements>
    );
}

function CheckoutContent() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return router.push('/login');
        if (!startDate || !endDate) return setError('Please select event dates');
        if (!paymentMethod) return setError('Please select a payment method');
        if (paymentMethod !== 'stripe' && !referenceNumber) return setError('Please enter your payment reference/transaction number');

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

            const res = await api.post('/bookings', bookingData);
            const booking = res.data;
            setBookingId(booking.id);

            if (paymentMethod === 'stripe') {
                // Create Payment Intent for Stripe
                const intentRes = await api.post('/bookings/create-intent', { bookingId: booking.id });
                setClientSecret(intentRes.data.clientSecret);
            } else {
                // Manual payment onfirmation
                await api.post('/bookings/confirm-payment', {
                    bookingId: booking.id,
                    paymentMethod,
                    referenceNumber
                });
                setIsSuccess(true);
                clearCart();
            }
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
                    <h1 className="text-3xl font-serif font-bold text-gold-950 mb-4">Request Sent!</h1>
                    <p className="text-gray-500 mb-10 leading-relaxed">
                        Your selection has been submitted. Our team will review the availability and contact you shortly to finalize the details and payment.
                    </p>
                    <Link href="/bookings">
                        <Button className="w-full" variant="gold">View My Bookings</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 bg-[#FDFBF7] min-h-screen">
            <div className="max-w-6xl mx-auto">
                <Link href="/rentals" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gold-700 transition-colors mb-12 group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Continue Browsing
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-4xl font-serif font-bold text-gold-950 mb-8">Booking Details</h2>

                            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gold-900 ml-4">Event Start</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                required
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-gold-800/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-gold-900 ml-4">Event End</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="date"
                                                required
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-gold-800/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gold-50/50 rounded-2xl">
                                    <p className="text-sm text-gold-900 italic font-serif">
                                        "Please note that submitting this request does not guarantee availability. Our stylists will reach out within 24 hours."
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gold-950 mb-6">Payment Preference</h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {paymentMethods.map(pm => (
                                        <button
                                            key={pm.id}
                                            onClick={() => setPaymentMethod(pm.id)}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left",
                                                paymentMethod === pm.id ? "border-gold-500 bg-gold-50" : "border-gray-50 hover:bg-white hover:border-gold-100"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-xl",
                                                paymentMethod === pm.id ? "bg-gold-500 text-white" : "bg-gray-100"
                                            )}>
                                                {pm.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gold-900">{pm.name}</p>
                                                {pm.id === 'stripe' && (
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mt-1">International Cards</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {paymentMethod && paymentMethod !== 'stripe' && (
                                    <div className="space-y-4 bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm animate-in fade-in slide-in-from-top-4">
                                        <div className="bg-gold-50 p-6 rounded-2xl border border-gold-200">
                                            <p className="text-xs font-bold text-gold-800 mb-2 uppercase tracking-widest">Payment Instructions</p>
                                            <p className="text-sm text-gold-950">
                                                Please transfer the total amount to the selected bank/wallet and enter the transaction reference number below.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 ml-4">Reference Number</label>
                                            <input
                                                required
                                                value={referenceNumber}
                                                onChange={(e) => setReferenceNumber(e.target.value)}
                                                placeholder="Enter transaction reference number"
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-gold-800/10 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-xl sticky top-32">
                            <h3 className="text-xl font-serif font-bold text-gold-950 mb-8 border-b border-gray-50 pb-4">Order Summary</h3>

                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <div className="text-gray-600">
                                            <p className="font-bold text-gold-900">{item.name}</p>
                                            <p className="text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="font-bold text-gold-950">{item.pricePerDay * item.quantity} Birr</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 border-t border-gray-50 pt-6 mb-8">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{total} Birr</span>
                                </div>
                                <div className="flex justify-between text-lg font-serif font-bold text-gold-950">
                                    <span>Total Due</span>
                                    <span>{total} Birr</span>
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs text-center mb-4">{error}</p>}

                            {clientSecret ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                                        <p className="text-[10px] uppercase tracking-widest text-gold-500 mb-2">Secure Payment Required</p>

                                        {clientSecret === 'mock_secret' ? (
                                            <div className="space-y-4">
                                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs">
                                                    <strong>Development Mode:</strong> Payment is bypassed.
                                                </div>
                                                <Button
                                                    className="w-full py-3"
                                                    variant="gold"
                                                    onClick={() => {
                                                        setIsSuccess(true);
                                                        clearCart();
                                                    }}
                                                >
                                                    Simulate Successful Payment
                                                </Button>
                                            </div>
                                        ) : (
                                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                                <PaymentForm
                                                    bookingId={bookingId!}
                                                    onSuccess={() => {
                                                        setIsSuccess(true);
                                                        clearCart();
                                                    }}
                                                    onError={(msg) => setError(msg)}
                                                />
                                            </Elements>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    className="w-full py-5 rounded-3xl"
                                    variant="gold"
                                    loading={isLoading}
                                    onClick={handleCreateBooking}
                                    disabled={items.length === 0}
                                >
                                    PROCEED TO PAYMENT
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
