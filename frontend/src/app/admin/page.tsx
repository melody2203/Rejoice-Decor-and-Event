import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FolderTree, Image as ImageIcon, PlusCircle, Package } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface DashboardStat {
    name: string;
    icon: any;
    count: string;
    href: string;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStat[]>([
        { name: 'Categories', icon: FolderTree, count: '...', href: '/admin/categories' },
        { name: 'Portfolio Projects', icon: ImageIcon, count: '...', href: '/admin/portfolio' },
        { name: 'Inventory Items', icon: Package, count: '...', href: '/admin/inventory' },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [categoriesRes, projectsRes, inventoryRes] = await Promise.all([
                    api.get("/portfolio/categories"),
                    api.get("/portfolio/projects"),
                    api.get("/inventory")
                ]);
                setStats([
                    { name: 'Categories', icon: FolderTree, count: categoriesRes.data.length.toString(), href: '/admin/categories' },
                    { name: 'Portfolio Projects', icon: ImageIcon, count: projectsRes.data.length.toString(), href: '/admin/portfolio' },
                    { name: 'Inventory Items', icon: Package, count: inventoryRes.data.length.toString(), href: '/admin/inventory' },
                ]);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white uppercase tracking-wider font-serif">Welcome back, {user?.email.split('@')[0]}</h1>
                <p className="text-zinc-500 mt-2 font-light">Manage your events, inventory, and portfolio from here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-2xl hover:border-gold-500/50 transition-all group shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <stat.icon className="text-gold-500 mb-4" size={32} />
                                <h3 className="text-xl font-semibold text-white tracking-wide">{stat.name}</h3>
                                <p className="text-zinc-500 text-sm mt-1">{stat.count} items</p>
                            </div>
                            <Link href={stat.href}>
                                <div className="bg-zinc-800 p-2 rounded-lg group-hover:bg-gold-500 group-hover:text-burgundy-950 transition-colors shadow-md">
                                    <PlusCircle size={20} />
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Quick Actions */}
                <div className="bg-gold-500/5 border border-gold-500/10 p-6 rounded-2xl md:col-span-2 lg:col-span-1 shadow-inner flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-gold-500 mb-4 uppercase tracking-widest text-xs font-bold">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link href="/admin/categories">
                            <Button variant="gold" className="w-full">
                                Add New Category
                            </Button>
                        </Link>
                        <Link href="/admin/portfolio">
                            <Button variant="outline" className="w-full border-gold-500/20 text-white hover:border-gold-500">
                                Post New Work
                            </Button>
                        </Link>
                        <Link href="/admin/inventory">
                            <Button variant="outline" className="w-full border-gold-500/20 text-white hover:border-gold-500">
                                Add Inventory
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                    <LayoutDashboard className="text-gold-500" />
                    System Overview
                </h3>
                <p className="text-zinc-500 font-light leading-relaxed max-w-2xl">
                    The booking and inventory management systems are currently under development.
                    You can use the sidebar to navigate between available management tools.
                </p>
            </div>
        </div>
    );
}
