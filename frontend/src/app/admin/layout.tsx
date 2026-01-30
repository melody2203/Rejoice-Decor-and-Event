"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== "ADMIN")) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="text-gold-500 text-xl animate-pulse font-serif uppercase tracking-widest flex items-center gap-3">
                    <div className="w-3 h-3 bg-gold-500 rounded-full animate-ping" />
                    Loading Admin Console...
                </div>
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-black text-white">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
