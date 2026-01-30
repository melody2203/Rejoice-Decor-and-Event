"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function MyBookingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/my-bookings');
            setBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="text-xl font-serif text-burgundy-900 animate-pulse">Loading your bookings...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="text-center">
                    <h1 className="text-2xl font-serif font-bold text-burgundy-950 mb-4">Please log in to view bookings</h1>
                    <Link href="/login">
                        <Button variant="gold">Login Now</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 bg-[#FDFBF7] min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-serif font-bold text-burgundy-950">My Bookings</h1>
                    <Link href="/rentals">
                        <Button variant="outline" size="sm">New Booking</Button>
                    </Link>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-sm border border-gray-50">
                        <Calendar className="mx-auto text-gray-200 mb-6" size={64} />
                        <p className="text-xl text-gray-400 font-serif italic">You haven't made any bookings yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-wrap items-start justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {booking.status}
                                            </span>
                                            <span className="text-xs text-gray-400 font-mono">#{booking.id.slice(0, 8)}</span>
                                        </div>

                                        <div className="flex items-center gap-8 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar size={16} className="text-burgundy-800" />
                                                <p>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Package size={16} className="text-burgundy-800" />
                                                <p>{booking.items.length} Items</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {booking.items.map((item: any) => (
                                                <span key={item.id} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded">
                                                    {item.item.name} (x{item.quantity})
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-right space-y-2 min-w-[120px]">
                                        <p className="text-2xl font-serif font-bold text-burgundy-950">${parseFloat(booking.totalAmount).toFixed(2)}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400">
                                            {booking.payments.length > 0 ? 'Payment Completed' : 'Payment Pending'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
