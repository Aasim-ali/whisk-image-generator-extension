'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { User, LogOut, CreditCard, Menu, X, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Pricing', href: '/plans' },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-500",
            scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm py-3" : "bg-transparent py-6"
        )}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 transition-transform active:scale-95 group">
                    <span className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-black text-xl font-black shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                        W
                    </span>
                    <span className="text-xl font-black text-gray-900 tracking-tight">Whisk</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-2 bg-gray-50/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "relative px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                                pathname === link.href
                                    ? "text-gray-900 bg-white shadow-sm ring-1 ring-gray-100"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-white hover:bg-gray-50 border border-gray-100 shadow-sm transition-all"
                            >
                                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-black font-black text-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-gray-900">{user.name}</span>
                            </button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden p-2 ring-1 ring-black/5"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50 mb-2">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Signed in as</p>
                                            <p className="text-sm font-black text-gray-900 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/plans"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            <CreditCard size={18} />
                                            Subscription
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-black text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <LogOut size={18} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button asChild variant="ghost" className="font-bold text-gray-500 hover:text-gray-900">
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button asChild className="btn-primary px-8">
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-900 transition-transform active:scale-90"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
                            {user && (
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black font-black text-lg">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 leading-none mb-1">{user.name}</p>
                                        <p className="text-xs text-gray-500 font-bold">{user.email}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl text-lg font-black transition-all",
                                            pathname === link.href
                                                ? "bg-primary text-black"
                                                : "text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        {link.name}
                                        <ChevronRight size={20} className={cn(pathname === link.href ? "text-black" : "text-gray-300")} />
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                                {user ? (
                                    <Button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        variant="destructive"
                                        className="h-14 font-black rounded-2xl shadow-lg shadow-red-500/10"
                                    >
                                        Sign Out
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild variant="outline" className="h-14 font-black rounded-2xl shadow-sm">
                                            <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                                        </Button>
                                        <Button asChild className="btn-primary h-14 font-black rounded-2xl shadow-lg">
                                            <Link href="/register" onClick={() => setIsOpen(false)}>Get Started Now</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
