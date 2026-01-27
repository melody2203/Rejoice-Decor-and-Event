import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-burgundy-950 text-white pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                {/* Brand & Mission */}
                <div className="md:col-span-1">
                    <Link href="/" className="flex flex-col mb-6">
                        <span className="text-2xl font-serif font-bold tracking-tight text-white">REJOICE</span>
                        <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-gold-500 -mt-1">Events & Decor</span>
                    </Link>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Crafting unforgettable moments with luxury decorations and premium event planning. Your vision, our expertise.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-serif font-bold mb-6 text-gold-500">Quick Links</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><Link href="/" className="hover:text-gold-500 transition-colors">Home</Link></li>
                        <li><Link href="/gallery" className="hover:text-gold-500 transition-colors">Past Works</Link></li>
                        <li><Link href="/rentals" className="hover:text-gold-500 transition-colors">Decor Rentals</Link></li>
                        <li><Link href="/about" className="hover:text-gold-500 transition-colors">About Us</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="text-lg font-serif font-bold mb-6 text-gold-500">Event Types</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li><span className="cursor-default">Weddings</span></li>
                        <li><span className="cursor-default">Birthdays</span></li>
                        <li><span className="cursor-default">Graduations</span></li>
                        <li><span className="cursor-default">Engagements</span></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-serif font-bold mb-6 text-gold-500">Get In Touch</h4>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li className="flex items-center gap-3">
                            <MapPin size={18} className="text-gold-500" />
                            <span>123 Elegance St, Luxury City</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-gold-500" />
                            <span>+1 (234) 567-890</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-gold-500" />
                            <span>info@rejoice-decor.com</span>
                        </li>
                    </ul>
                    <div className="flex gap-4 mt-8">
                        <Link href="#" className="p-2 bg-burgundy-900 rounded-full hover:bg-gold-500 hover:text-burgundy-950 transition-all">
                            <Instagram size={20} />
                        </Link>
                        <Link href="#" className="p-2 bg-burgundy-900 rounded-full hover:bg-gold-500 hover:text-burgundy-950 transition-all">
                            <Facebook size={20} />
                        </Link>
                        <Link href="#" className="p-2 bg-burgundy-900 rounded-full hover:bg-gold-500 hover:text-burgundy-950 transition-all">
                            <Twitter size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-burgundy-900 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                <p>© 2026 Rejoice Events & Decor. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
