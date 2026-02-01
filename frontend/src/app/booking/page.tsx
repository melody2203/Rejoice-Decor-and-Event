"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Package, CreditCard, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const eventTypes = ["Wedding", "Birthday", "Graduation", "Engagement", "Others"];

const paymentMethods = [
    { id: 'telebirr', name: 'Telebirr', icon: '📱' },
    { id: 'cbe_birr', name: 'CBE Birr', icon: '🏦' },
    { id: 'cbe_transfer', name: 'Commercial Bank of Ethiopia', icon: '💳' },
    { id: 'awash_bank', name: 'Awash Bank', icon: '🏗️' },
];

const BookingPage = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        eventType: '',
        startDate: '',
        endDate: '',
        location: '',
        decorPackage: 'Standard',
        customRequest: '',
        paymentMethod: '',
        referenceNumber: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [bookingId, setBookingId] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (step === 1 && (!formData.eventType || !formData.startDate || !formData.endDate)) {
            setError('Please fill in all basic details');
            return;
        }
        if (step === 2 && !formData.location) {
            setError('Please provide event location');
            return;
        }
        setError('');
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        if (!user) {
            router.push('/login?redirect=/booking');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // 1. Create Booking
            const bookingRes = await api.post('/bookings', {
                startDate: formData.startDate,
                endDate: formData.endDate,
                eventType: formData.eventType,
                location: formData.location,
                decorPackage: formData.decorPackage,
                customRequest: formData.customRequest,
                items: [] // For now, simple booking without specific rental items
            });

            const newBookingId = bookingRes.data.id;
            setBookingId(newBookingId);

            // 2. Submit Payment Proof if manual
            if (formData.paymentMethod && formData.referenceNumber) {
                await api.post('/bookings/confirm-payment', {
                    bookingId: newBookingId,
                    paymentMethod: formData.paymentMethod,
                    referenceNumber: formData.referenceNumber
                });
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to process booking. Please check dates and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return <div className="pt-40 text-center font-serif italic text-gold-900">Loading...</div>;

    if (success) {
        return (
            <div className="pt-40 pb-24 px-6 min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-xl text-center border border-gold-50"
                >
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="text-green-500" size={48} />
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-gold-900 mb-4">Booking Received!</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Your request has been submitted successfully. Our team will review your details and contact you shortly.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-2xl mb-8 flex items-center justify-between text-sm">
                        <span className="text-gray-400">Order ID:</span>
                        <span className="font-mono font-bold text-gold-900">#{bookingId.slice(0, 8)}</span>
                    </div>
                    <Button onClick={() => router.push('/bookings')} className="w-full py-4 rounded-2xl">
                        View My Bookings
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 bg-[#FDFBF7] min-h-screen px-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-gold-900 mb-4">Book Your Event</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mb-6" />
                    <p className="text-gray-500 font-serif italic">Secure your date for an unforgettable celebration.</p>
                </header>

                <div className="bg-white rounded-[3.5rem] shadow-xl border border-gold-50 overflow-hidden">
                    {/* Progress Bar */}
                    <div className="bg-gold-900 px-12 py-6 flex justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2",
                                    step >= i ? "bg-gold-500 border-gold-500 text-white" : "bg-transparent border-gold-700 text-gold-700"
                                )}>
                                    {i}
                                </div>
                                <span className={cn(
                                    "hidden sm:inline text-[10px] uppercase tracking-widest font-bold",
                                    step >= i ? "text-white" : "text-gold-700"
                                )}>
                                    {i === 1 ? "Details" : i === 2 ? "Customization" : "Prepayment"}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="p-12 md:p-16">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gold-950 uppercase tracking-widest flex items-center gap-2">
                                                <Package size={16} className="text-gold-600" /> Event Type
                                            </label>
                                            <select
                                                name="eventType"
                                                value={formData.eventType}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-700/10 outline-none"
                                            >
                                                <option value="">Select Event Type</option>
                                                {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-gold-950 uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={16} className="text-gold-600" /> Event Dates
                                            </label>
                                            <div className="flex flex-col gap-4 w-full">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold px-1">Start Date</p>
                                                        <input
                                                            type="date"
                                                            name="startDate"
                                                            value={formData.startDate}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-xs focus:ring-2 focus:ring-gold-800/10 outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold px-1">End Date</p>
                                                        <input
                                                            type="date"
                                                            name="endDate"
                                                            value={formData.endDate}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-xs focus:ring-2 focus:ring-gold-800/10 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gold-950 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={16} className="text-gold-600" /> Location / Venue Name
                                        </label>
                                        <input
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Hilton Hotel, Addis Ababa"
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-800/10 outline-none"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gold-950 uppercase tracking-widest">Decor Package</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {["Essential", "Standard", "Premium"].map(pkg => (
                                                <button
                                                    key={pkg}
                                                    onClick={() => setFormData(prev => ({ ...prev, decorPackage: pkg }))}
                                                    className={cn(
                                                        "p-6 rounded-[2rem] border-2 transition-all text-center",
                                                        formData.decorPackage === pkg ? "border-gold-500 bg-gold-50" : "border-gray-100 hover:border-gold-200"
                                                    )}
                                                >
                                                    <p className="font-serif font-bold text-gold-900">{pkg}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">Starting from 25,000 Birr</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gold-950 uppercase tracking-widest">Custom Requests (Optional)</label>
                                        <textarea
                                            name="customRequest"
                                            value={formData.customRequest}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Tell us about your specific vision, color themes, etc."
                                            className="w-full bg-gray-50 border-none rounded-3xl py-4 px-6 focus:ring-2 focus:ring-gold-800/10 outline-none resize-none"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-gold-50 p-8 rounded-[2.5rem] mb-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-gold-900 font-bold uppercase tracking-widest text-xs">Prepayment Amount (50%)</span>
                                            <span className="text-2xl font-serif font-bold text-gold-900">Custom Birr</span>
                                        </div>
                                        <p className="text-xs text-gold-700/60 leading-relaxed italic">
                                            We require a 50% prepayment to secure your event date. The remaining balance can be settled 1 week before the event.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gold-950 uppercase tracking-widest">Select Payment Method</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {paymentMethods.map(pm => (
                                                <button
                                                    key={pm.id}
                                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: pm.id }))}
                                                    className={cn(
                                                        "p-4 rounded-2xl border-2 transition-all flex items-center gap-4",
                                                        formData.paymentMethod === pm.id ? "border-gold-500 bg-gold-50" : "border-gray-50 hover:bg-gray-50"
                                                    )}
                                                >
                                                    <span className="text-xl">{pm.icon}</span>
                                                    <span className="text-xs font-bold text-gold-900 text-left leading-tight">{pm.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {formData.paymentMethod && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                            <div className="bg-gold-50 p-6 rounded-2xl border border-gold-200">
                                                <p className="text-xs font-bold text-gold-800 mb-2 uppercase tracking-widest">Payment Instructions</p>
                                                <p className="text-sm text-gold-950">
                                                    Please transfer your prepayment to the selected account and enter the reference/transaction number below.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Transaction Reference Number</label>
                                                <input
                                                    name="referenceNumber"
                                                    value={formData.referenceNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter reference number"
                                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-gold-800/10 outline-none"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm">
                                <AlertCircle size={18} /> {error}
                            </motion.div>
                        )}

                        <div className="mt-12 flex justify-between gap-4">
                            {step > 1 && (
                                <Button variant="outline" onClick={prevStep} className="px-8 rounded-2xl" icon={ChevronLeft}>
                                    Back
                                </Button>
                            )}
                            {step < 3 ? (
                                <Button onClick={nextStep} className="ml-auto px-12 rounded-2xl group" icon={ChevronRight}>
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    loading={isSubmitting}
                                    className="ml-auto px-12 rounded-2xl shadow-lg shadow-gold-900/10"
                                >
                                    Complete Booking
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
