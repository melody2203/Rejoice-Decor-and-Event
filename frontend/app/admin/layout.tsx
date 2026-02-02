"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

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
            <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A]">
                <div className="text-gold-500 text-xl animate-pulse font-serif uppercase tracking-widest flex items-center gap-3">
                    <div className="w-3 h-3 bg-gold-500 rounded-full animate-ping" />
                    Refining Console...
                </div>
            </div>
        );
    }

    if (!user || user.role !== "ADMIN") {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="admin-view"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
