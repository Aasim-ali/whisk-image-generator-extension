'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

export default function ScrollToTop() {
    const { scrollY, scrollYProgress } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    // Update visibility and progress
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsVisible(latest > 300);
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setProgress(latest * 100);
    });

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
                    className="fixed bottom-8 right-8 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full glass border-2 border-primary/30 flex items-center justify-center text-white shadow-lg shadow-primary/20 backdrop-blur-md"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Scroll to top"
                >
                    {/* Circular progress */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="20"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="3"
                            fill="none"
                        />
                        <circle
                            cx="50%"
                            cy="50%"
                            r="20"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={125.6} // 2 * PI * 20
                            strokeDashoffset={125.6 - (125.6 * progress) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-100 ease-out"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8a2be2" />
                                <stop offset="100%" stopColor="#ff0080" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Arrow icon */}
                    <div className="relative z-10 text-white">
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
