'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Github, Twitter, Linkedin, Heart, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Features', href: '/#features' },
            { name: 'Pricing', href: '/plans' },
            { name: 'API Documentation', href: '#' },
            { name: 'Changelog', href: '#' }
        ],
        company: [
            { name: 'About', href: '/about' },
            { name: 'Blog', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Contact', href: '#' }
        ],
        resources: [
            { name: 'Help Center', href: '#' },
            { name: 'Community', href: '#' },
            { name: 'Guides', href: '#' },
            { name: 'Status', href: '#' }
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
            { name: 'Licenses', href: '#' }
        ]
    };

    const socialLinks = [
        { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
        { icon: <Github size={18} />, href: '#', label: 'GitHub' },
        { icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn' },
        { icon: <Mail size={18} />, href: 'mailto:hello@whisk.com', label: 'Email' }
    ];

    return (
        <footer className="relative border-t border-gray-100 bg-gray-50/50 mt-40">
            {/* Background Gradient Decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute top-40 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />

            <div className="container mx-auto px-4">
                {/* Main Content */}
                <div className="py-24 grid grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
                    {/* Brand Info */}
                    <div className="col-span-2 lg:col-span-2 space-y-8">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-3 transition-transform active:scale-95 group">
                                <span className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black text-2xl font-black shadow-xl shadow-primary/20 transition-transform group-hover:rotate-12 duration-500">
                                    W
                                </span>
                                <span className="text-2xl font-black text-gray-900 tracking-tight">Whisk</span>
                            </Link>
                            <p className="mt-6 text-gray-500 font-bold text-sm leading-relaxed max-w-xs">
                                The #1 one-click bulk Google Whisk AI image generator.
                                Scale your creative output with precision and speed.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                    whileHover={{ y: -4 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Links Groups */}
                    <div className="space-y-6">
                        <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[10px]">Product</h3>
                        <ul className="space-y-4">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-500 hover:text-primary font-bold text-sm transition-colors inline-flex items-center gap-1 group">
                                        {link.name}
                                        {link.href === '#' && <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[10px]">Company</h3>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-500 hover:text-primary font-bold text-sm transition-colors inline-flex items-center gap-1 group">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[10px]">Resources</h3>
                        <ul className="space-y-4">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-500 hover:text-primary font-bold text-sm transition-colors inline-flex items-center gap-1 group">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-gray-900 font-black uppercase tracking-[0.2em] text-[10px]">Legal</h3>
                        <ul className="space-y-4">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-500 hover:text-primary font-bold text-sm transition-colors inline-flex items-center gap-1 group">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest order-2 md:order-1">
                        © {currentYear} WhiskAutomator. All rights reserved.
                    </p>

                    <div className="flex items-center gap-8 order-1 md:order-2">
                        <div className="px-5 py-2 rounded-full border border-gray-100 bg-white shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Systems Operational</span>
                        </div>
                        <p className="text-gray-400 font-bold text-[11px] flex items-center gap-2">
                            Made with <Heart size={14} className="text-primary fill-primary" /> by Whisk Team
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
