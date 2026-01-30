"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import { Mail, Lock, ArrowLeft, Send } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError("Passwords don't match");
        }

        setIsLoading(true);

        try {
            await register({ email, password });
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-6 py-12 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gold-50/50 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-burgundy-50/50 blur-[100px] rounded-full" />

            <div className="w-full max-w-md relative z-10">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-burgundy-700 transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-12 border border-gray-50">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif font-bold text-burgundy-950 mb-2">Create Account</h1>
                        <p className="text-gray-400 text-sm">Join Rejoice for exclusive event styling</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 flex items-center justify-center text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-burgundy-900 ml-4">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-full py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-burgundy-800/20 outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-burgundy-900 ml-4">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-full py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-burgundy-800/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-burgundy-900 ml-4">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-full py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-burgundy-800/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="gold"
                            className="w-full py-4 rounded-full"
                            loading={isLoading}
                            icon={Send}
                        >
                            Sign Up
                        </Button>
                    </form>

                    <p className="text-center mt-10 text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-gold-600 font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
