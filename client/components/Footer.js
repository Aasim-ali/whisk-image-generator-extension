'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Github, Twitter, Linkedin, Heart } from 'lucide-react';

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
        { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
        { icon: <Github size={20} />, href: '#', label: 'GitHub' },
        { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' },
        { icon: <Mail size={20} />, href: 'mailto:hello@whisk.com', label: 'Email' }
    ];

    return (
        <footer className="relative border-t border-white/5 bg-black/20 mt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

            <div className="container relative z-10">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
                            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                                W
                            </span>
                            <span className="text-xl font-bold text-white">Whisk</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Automate your creative workflow with AI-powered image generation.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-lg glass border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-primary/30 transition-all"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            © {currentYear} Whisk Image Generator. All rights reserved.
                        </p>

                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            Made with <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" /> by the Whisk Team
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
