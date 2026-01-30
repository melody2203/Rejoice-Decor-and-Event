"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderTree, Image as ImageIcon, LogOut, Home, Package, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

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
        <aside className="w-64 bg-zinc-950 text-white min-h-screen flex flex-col border-r border-zinc-900">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gold-500 tracking-tight">Admin Console</h2>
                <p className="text-zinc-500 text-xs mt-1">Rejoice Events & Decor</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                isActive
                                    ? "bg-gold-500 text-burgundy-950"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            )}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-800 space-y-2">
                <Link href="/">
                    <Button variant="outline" className="w-full justify-start gap-3 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Home size={20} />
                        Main Site
                    </Button>
                </Link>
                <Button
                    variant="outline"
                    onClick={logout}
                    className="w-full justify-start gap-3 border-zinc-800 text-red-400 hover:text-red-300 hover:bg-zinc-800"
                >
                    <LogOut size={20} />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
