"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderTree,
    Image as ImageIcon,
    LogOut,
    Home,
    Package,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Portfolio', href: '/admin/portfolio', icon: ImageIcon },
    { name: 'Inventory', href: '/admin/inventory', icon: Package },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="w-72 bg-zinc-950/80 backdrop-blur-2xl text-white min-h-screen flex flex-col border-r border-zinc-900 shadow-2xl z-40">
            <div className="p-8 pb-12">
                <div className="relative group inline-block">
                    <h2 className="text-2xl font-serif font-bold text-white tracking-widest uppercase mb-1">REJOICE</h2>
                    <div className="h-0.5 w-0 group-hover:w-full bg-gold-500 transition-all duration-500" />
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Admin Console</p>
                </div>
            </div>

            <nav className="flex-1 px-6 space-y-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                        >
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 relative group overflow-hidden",
                                    isActive
                                        ? "bg-gold-500 text-burgundy-950 shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
                                        : "text-zinc-500 hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-accent"
                                        className="absolute inset-0 bg-gold-500 -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <item.icon size={22} className={cn("transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                                <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 pt-10 border-t border-zinc-900/50 space-y-4">
                <Link href="/">
                    <Button variant="outline" className="w-full justify-start gap-3 border-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl py-5">
                        <Home size={18} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Main Site</span>
                    </Button>
                </Link>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-red-500/60 hover:text-red-400 transition-colors text-[10px] uppercase tracking-widest font-bold"
                >
                    <LogOut size={16} />
                    Termination
                </button>
            </div>
        </aside>
    );
}
