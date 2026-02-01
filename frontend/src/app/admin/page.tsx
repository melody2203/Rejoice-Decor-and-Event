"use client";

import { useAuth } from "@/hooks/useAuth";
import {
    LayoutDashboard,
    FolderTree,
    Image as ImageIcon,
    PlusCircle,
    Package,
    DollarSign,
    TrendingUp,
    Calendar,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/admin/stats");
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const COLORS = ['#D4AF37', '#956b23', '#3a270f', '#000000', '#71717A'];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-wider font-serif">
                        Executive Overview
                    </h1>
                    <p className="text-zinc-500 mt-2 font-light">Welcome back, {user?.email.split('@')[0]}. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/bookings">
                        <Button variant="outline" size="sm" className="border-zinc-800 text-zinc-400">
                            View Pipeline
                        </Button>
                    </Link>
                    <Link href="/admin/inventory">
                        <Button variant="gold" size="sm">
                            Add Asset
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={`${stats?.totalRevenue?.toLocaleString() || '0'} Birr`}
                    icon={DollarSign}
                    trend="+12% from last month"
                    color="gold"
                />
                <MetricCard
                    title="Active Bookings"
                    value={stats?.bookingStats?.find((s: any) => s.status === 'CONFIRMED')?._count?.id || '0'}
                    icon={Calendar}
                    color="gold"
                />
                <MetricCard
                    title="Top Asset"
                    value={stats?.topItems?.[0]?.name || 'None'}
                    icon={Package}
                    color="zinc"
                />
                <MetricCard
                    title="Pending Approvals"
                    value={stats?.bookingStats?.find((s: any) => s.status === 'PENDING')?._count?.id || '0'}
                    icon={AlertCircle}
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Graph */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-serif font-bold text-white uppercase tracking-widest">Revenue Growth</h3>
                        <TrendingUp className="text-gold-500" size={20} />
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.monthlyRevenue}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                                    itemStyle={{ color: '#D4AF37' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#D4AF37"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Sidebar Dashboard */}
                <div className="space-y-8">
                    {/* Booking Status Distribution */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl">
                        <h3 className="text-xs font-bold text-gold-500/50 uppercase tracking-[0.2em] mb-6">Booking Pipeline</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats?.bookingStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="_count.id"
                                        nameKey="status"
                                    >
                                        {stats?.bookingStats?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            {stats?.bookingStats?.map((entry: any, index: number) => (
                                <div key={entry.status} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-[10px] uppercase tracking-widest text-zinc-400">{entry.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Items */}
                    <div className="bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-[2rem] shadow-2xl backdrop-blur-xl">
                        <h3 className="text-xs font-bold text-gold-500/50 uppercase tracking-[0.2em] mb-6">Top Assets</h3>
                        <div className="space-y-4">
                            {stats?.topItems?.map((item: any, index: number) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-zinc-600 font-mono text-xs">0{index + 1}</span>
                                        <span className="text-zinc-200 text-sm">{item.name}</span>
                                    </div>
                                    <span className="text-gold-500 font-bold text-xs">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, trend, color }: any) {
    const colorClasses: any = {
        gold: "text-gold-500 bg-gold-500/10",
        zinc: "text-zinc-400 bg-zinc-400/10",
        amber: "text-amber-500 bg-amber-500/10"
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-[2rem] hover:border-gold-500/30 transition-all group relative overflow-hidden">
            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">{title}</h3>
                <p className="text-2xl font-serif font-bold text-white">{value}</p>
                {trend && (
                    <p className="text-[10px] text-zinc-600 mt-2 font-medium tracking-tight">
                        {trend}
                    </p>
                )}
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                <Icon size={120} />
            </div>
        </div>
    );
}
