"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import {
    Calendar,
    Check,
    X,
    Clock,
    Filter,
    Search,
    User,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Info,
    Package
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

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

    const handleUpdateStatus = async (id: string, status: string) => {
        setIsUpdating(true);
        try {
            await api.patch(`/bookings/${id}/status`, { status });
            await fetchBookings();
            if (selectedBooking?.id === id) {
                setSelectedBooking((prev: any) => ({ ...prev, status }));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === "ALL" || booking.status === filter;
        const matchesSearch = booking.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-wider font-serif">
                        Booking Pipeline
                    </h1>
                    <p className="text-zinc-500 mt-2 font-light">Monitor and manage all rental requests.</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/30 p-4 rounded-3xl border border-zinc-800 backdrop-blur-md">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search customer email or ID..."
                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter size={16} className="text-gold-500" />
                    <div className="flex bg-zinc-800/50 rounded-xl p-1 border border-zinc-700/50">
                        {["ALL", "PENDING", "CONFIRMED", "COMPLETED"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${filter === s ? "bg-gold-500 text-gold-950" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-900/80 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-zinc-800">
                            <th className="px-8 py-6">Customer</th>
                            <th className="px-8 py-6">Rental Period</th>
                            <th className="px-8 py-6 text-right">Investment</th>
                            <th className="px-8 py-6">Current Status</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/30 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 animate-pulse font-serif italic">Curating results...</td>
                            </tr>
                        ) : filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 font-serif italic">No bookings match your criteria.</td>
                            </tr>
                        ) : (
                            filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-zinc-800/20 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-gold-500 font-serif">
                                                {booking.user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-xs">{booking.user.email}</p>
                                                <p className="text-[10px] text-zinc-500 font-mono tracking-tighter">REF: {booking.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-xs text-zinc-300 flex flex-col gap-1">
                                            <span className="flex items-center gap-2">
                                                <Calendar size={12} className="text-gold-500/50" />
                                                {format(new Date(booking.startDate), "MMM dd, yyyy")}
                                            </span>
                                            <span className="text-[10px] text-zinc-600 pl-5">to {format(new Date(booking.endDate), "MMM dd, yyyy")}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="text-white font-serif font-bold">{parseFloat(booking.totalAmount).toLocaleString()} Birr</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => setSelectedBooking(booking)}
                                            className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-500 hover:text-gold-500"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-12 space-y-10">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-wider">Booking Details</h2>
                                    <p className="text-zinc-500 text-sm font-light">Reference ID: {selectedBooking.id}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Customer</p>
                                            <p className="text-white font-medium">{selectedBooking.user.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Schedule</p>
                                            <p className="text-white font-medium">
                                                {format(new Date(selectedBooking.startDate), "MMM dd")} - {format(new Date(selectedBooking.endDate), "MMM dd, yyyy")}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Investment</p>
                                            <p className="text-2xl font-serif font-bold text-white">{parseFloat(selectedBooking.totalAmount).toLocaleString()} Birr</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gold-500 uppercase tracking-widest mb-3">Line Items</p>
                                        <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                            {selectedBooking.items.map((i: any) => (
                                                <div key={i.id} className="flex items-center justify-between text-zinc-400 text-xs">
                                                    <span className="truncate pr-4">{i.item.name}</span>
                                                    <span className="text-zinc-600 font-mono">x{i.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-zinc-800 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Current Workflow Status</p>
                                        <StatusBadge status={selectedBooking.status} />
                                    </div>

                                    <div className="flex gap-3">
                                        {selectedBooking.status === "PENDING" && (
                                            <Button
                                                variant="gold"
                                                size="sm"
                                                onClick={() => handleUpdateStatus(selectedBooking.id, "CONFIRMED")}
                                                loading={isUpdating}
                                            >
                                                Confirm Booking
                                            </Button>
                                        )}
                                        {selectedBooking.status === "CONFIRMED" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-green-500/20 text-green-500"
                                                onClick={() => handleUpdateStatus(selectedBooking.id, "COMPLETED")}
                                                loading={isUpdating}
                                            >
                                                Mark Completed
                                            </Button>
                                        )}
                                        {["PENDING", "CONFIRMED"].includes(selectedBooking.status) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-red-500/20 text-red-500"
                                                onClick={() => handleUpdateStatus(selectedBooking.id, "CANCELLED")}
                                                loading={isUpdating}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: any = {
        CONFIRMED: { class: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle2 },
        CANCELLED: { class: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
        PENDING: { class: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: Clock },
        COMPLETED: { class: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Check }
    };

    const config = configs[status] || configs.PENDING;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter border ${config.class}`}>
            <Icon size={10} />
            {status}
        </span>
    );
}
