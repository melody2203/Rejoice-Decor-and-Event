"use client";

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BookingItem {
    id: string;
    item: {
        name: string;
        pricePerDay: number;
    };
    quantity: number;
}

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    totalAmount: number;
    createdAt: string;
    items: BookingItem[];
}

export default function BookingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings/my-bookings');
                setBookings(res.data);
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchBookings();
    }, [user, authLoading, router]);

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'CONFIRMED': return 'bg-green-50 text-green-700 border-green-100';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
            case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status: Booking['status']) => {
        switch (status) {
            case 'PENDING': return <Clock size={14} />;
            case 'CONFIRMED': return <CheckCircle size={14} />;
            case 'CANCELLED': return <XCircle size={14} />;
            case 'COMPLETED': return <CheckCircle size={14} />;
            default: return null;
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="w-12 h-12 border-4 border-burgundy-100 border-t-burgundy-800 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 bg-[#FDFBF7] min-h-screen">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-burgundy-950 mb-4">My Bookings</h1>
                    <p className="text-gray-500 italic font-serif">Track your luxury event requests and confirmations.</p>
                </header>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-50 shadow-sm">
                        <Calendar className="mx-auto text-burgundy-100 mb-6" size={64} />
                        <h2 className="text-2xl font-serif font-bold text-burgundy-950 mb-4">No bookings found</h2>
                        <p className="text-gray-400 mb-10 max-w-sm mx-auto">You haven&apos;t started any event requests yet. Visit our rentals to begin.</p>
                        <Link href="/rentals">
                            <Button>Browse Rentals</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-8 md:p-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-gray-50">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5",
                                                    getStatusColor(booking.status)
                                                )}>
                                                    {getStatusIcon(booking.status)}
                                                    {booking.status}
                                                </span>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                                                    Requested on {new Date(booking.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h2 className="text-lg font-bold text-burgundy-950">Order #{booking.id.slice(0, 8).toUpperCase()}</h2>
                                        </div>

                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total Estimated</p>
                                            <p className="text-2xl font-bold text-burgundy-800">${booking.totalAmount}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-burgundy-900 mb-4 flex items-center gap-2">
                                                <Calendar size={14} className="text-gold-500" />
                                                Event Period
                                            </h3>
                                            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                                                <div className="text-center">
                                                    <p className="text-[10px] text-gray-400 uppercase">From</p>
                                                    <p className="font-bold text-burgundy-950">{new Date(booking.startDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="h-8 w-px bg-gray-200" />
                                                <div className="text-center">
                                                    <p className="text-[10px] text-gray-400 uppercase">To</p>
                                                    <p className="font-bold text-burgundy-950">{new Date(booking.endDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-burgundy-900 mb-4 flex items-center gap-2">
                                                <Package size={14} className="text-gold-500" />
                                                Selected Pieces
                                            </h3>
                                            <ul className="space-y-3">
                                                {booking.items.map((bi) => (
                                                    <li key={bi.id} className="flex justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            <span className="font-bold text-burgundy-950">{bi.quantity}x</span> {bi.item.name}
                                                        </span>
                                                        <span className="font-medium text-gray-400">${bi.item.pricePerDay * bi.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-gray-50 flex justify-end">
                                        <Button variant="ghost" size="sm" className="text-gray-400">View Full Details</Button>
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
