"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User as UserIcon, LogOut, ChevronDown, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import CartDrawer from './CartDrawer';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Rentals', href: '/rentals' },
    { name: 'Booking', href: '/booking' },
    { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
                scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex flex-col">
                    <span className={cn(
                        "text-2xl font-serif font-bold tracking-tight transition-colors",
                        scrolled ? "text-gold-700" : "text-gold-900"
                    )}>
                        REJOICE
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-gold-600 -mt-1">
                        Events & Decor
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-gold-600 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 text-sm font-medium text-gold-900 border border-gold-100 px-4 py-2 rounded-full hover:bg-gold-50 transition-all"
                            >
                                <UserIcon size={16} />
                                <span className="max-w-[100px] truncate">{user.email.split('@')[0]}</span>
                                <ChevronDown size={14} className={cn("transition-transform", showUserMenu && "rotate-180")} />
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 border border-gray-50 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Signed in as</p>
                                        <p className="text-sm font-bold truncate text-gold-900">{user.email}</p>
                                    </div>
                                    {user.role === 'ADMIN' && (
                                        <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-700">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link href="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-700">
                                        My Bookings
                                    </Link>
                                    <button
                                        onClick={() => { logout(); setShowUserMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <LogOut size={14} />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" icon={UserIcon}>Log In</Button>
                        </Link>
                    )}

                    {/* Cart Trigger */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="p-2 text-gold-900 hover:bg-gold-50 rounded-full transition-all relative"
                    >
                        <ShoppingBag size={22} />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center space-x-4">
                    <button onClick={() => setIsCartOpen(true)} className="text-gold-900 p-2 relative">
                        <ShoppingBag size={22} />
                        {itemCount > 0 && <span className="absolute top-1 right-1 bg-gold-500 w-2 h-2 rounded-full" />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gold-900 p-2">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl p-6 flex flex-col space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            {user.role === 'ADMIN' && (
                                <Link href="/admin" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2">
                                    Admin Dashboard
                                </Link>
                            )}
                            <Link href="/bookings" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2">
                                My Bookings
                            </Link>
                            <button onClick={() => { logout(); setIsOpen(false); }} className="text-lg font-medium text-red-600 text-left">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                            <Button className="w-full" icon={UserIcon}>Log In</Button>
                        </Link>
                    )}
                </div>
            )}
            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
};

export default Navbar;
