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
                    className="fixed bottom-8 right-8 z-50 w-12 h-12 md:w-16 md:h-16 rounded-[2rem] bg-white border-2 border-primary/20 flex items-center justify-center text-gray-900 shadow-3xl shadow-primary/20 backdrop-blur-xl group"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Scroll to top"
                >
                    {/* Circular progress */}
                    <svg className="absolute bottom-5 right-5 inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                        <circle
                            cx="50%"
                            cy="50%"
                            r="24"
                            stroke="#f3f4f6"
                            strokeWidth="4"
                            fill="none"
                        />
                        <circle
                            cx="50%"
                            cy="50%"
                            r="24"
                            stroke="var(--primary)"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={150.7} // 2 * PI * 24
                            strokeDashoffset={150.7 - (150.7 * progress) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-100 ease-out"
                        />
                    </svg>

                    {/* Arrow icon */}
                    <div className="relative z-10 text-black group-hover:scale-110 transition-transform">
                        <svg
                            className="w-6 h-6 md:w-8 md:h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
