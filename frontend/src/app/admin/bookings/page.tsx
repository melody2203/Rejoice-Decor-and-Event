"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import { Calendar, Check, X, Clock, Filter, Search, User } from "lucide-react";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBookings = async () => {
        try {
            const res = await api.get("/bookings");
            setBookings(res.data);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === "ALL" || booking.status === filter;
        const matchesSearch = booking.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 uppercase tracking-wider font-serif">
                        <Calendar className="text-gold-500" />
                        Booking Pipeline
                    </h1>
                    <p className="text-zinc-500 mt-2 font-light">Manage event schedules and rental status.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by customer email or ID..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gold-500" />
                    <select
                        className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors appearance-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-800">
                            <th className="px-6 py-4 text-gold-500/80">Customer</th>
                            <th className="px-6 py-4 text-gold-500/80">Dates</th>
                            <th className="px-6 py-4 text-gold-500/80">Total</th>
                            <th className="px-6 py-4 text-gold-500/80">Status</th>
                            <th className="px-6 py-4 text-gold-500/80">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 animate-pulse">Loading bookings...</td>
                            </tr>
                        ) : filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No bookings found.</td>
                            </tr>
                        ) : (
                            filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-zinc-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                                <User size={14} className="text-zinc-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-xs">{booking.user.email}</p>
                                                <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">ID: {booking.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-zinc-300">
                                            <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                                            <p className="text-zinc-600">to {new Date(booking.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gold-500 font-bold font-mono">${parseFloat(booking.totalAmount).toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter ${booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                booking.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-[10px] text-zinc-500 italic truncate max-w-[150px]">
                                            {booking.items.map((i: any) => i.item.name).join(", ")}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
