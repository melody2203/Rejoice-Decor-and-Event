"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Rentals', href: '/rentals' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
                scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex flex-col">
                    <span className={cn(
                        "text-2xl font-serif font-bold tracking-tight transition-colors",
                        scrolled ? "text-burgundy-800" : "text-burgundy-950"
                    )}>
                        REJOICE
                    </span>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-gold-600 -mt-1">
                        Events & Decor
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-burgundy-700 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button className="bg-burgundy-800 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-burgundy-900 transition-all shadow-md hover:shadow-lg">
                        BOOK NOW
                    </button>
                </div>

                <div className="md:hidden flex items-center space-x-4">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-burgundy-900 p-2">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

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
                    <button className="bg-burgundy-800 text-white w-full py-3 rounded-md text-lg font-semibold">
                        BOOK NOW
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
