'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const toggleVisibility = () => {
            const scrolled = window.scrollY;
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / windowHeight) * 100;

            setScrollProgress(progress);
            setIsVisible(scrolled > 300);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full glass border-2 border-primary/30 flex items-center justify-center text-white hover:scale-110 transition-transform group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Circular progress */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="28"
                            cy="28"
                            r="26"
                            stroke="rgba(138, 43, 226, 0.2)"
                            strokeWidth="2"
                            fill="none"
                        />
                        <circle
                            cx="28"
                            cy="28"
                            r="26"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={163.36}
                            strokeDashoffset={163.36 - (163.36 * scrollProgress) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-300"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8a2be2" />
                                <stop offset="100%" stopColor="#ff0080" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Arrow icon */}
                    <div className="relative z-10">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
