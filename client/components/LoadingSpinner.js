'use client';

import { motion } from 'framer-motion';

/**
 * Loading spinner component with multiple variants
 * @param {string} size - 'sm', 'md', 'lg' (default: 'md')
 * @param {string} variant - 'spin', 'pulse', 'dots' (default: 'spin')
 * @param {string} color - 'primary', 'secondary', 'white' (default: 'primary')
 */
export default function LoadingSpinner({
    size = 'md',
    variant = 'spin',
    color = 'primary',
    className = ''
}) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const colors = {
        primary: 'border-primary',
        secondary: 'border-secondary',
        white: 'border-white',
        accent: 'border-accent'
    };

    if (variant === 'spin') {
        return (
            <div className={`${sizes[size]} ${className}`}>
                <div className={`w-full h-full border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}></div>
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div className={`${sizes[size]} ${className} flex items-center justify-center`}>
                <motion.div
                    className={`w-full h-full rounded-full bg-gradient-to-r from-primary to-primary-dark`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.6, 1]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
        );
    }

    if (variant === 'dots') {
        return (
            <div className={`flex gap-2 ${className}`}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} rounded-full bg-gradient-to-r from-primary to-primary-dark`}
                        animate={{
                            y: [0, -10, 0],
                            opacity: [1, 0.5, 1]
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </div>
        );
    }

    return null;
}

/**
 * Skeleton loader for content placeholder
 */
export function SkeletonLoader({ className = '', lines = 3 }) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="skeleton h-4 w-full bg-gray-100 rounded-lg animate-pulse" style={{ width: `${100 - i * 15}%` }}></div>
            ))}
        </div>
    );
}

/**
 * Full page loader with brand animation
 */
export function FullPageLoader() {
    return (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
                <motion.div
                    className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-black text-3xl font-black mb-6 mx-auto shadow-2xl shadow-primary/20"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    W
                </motion.div>
                <LoadingSpinner variant="dots" size="md" />
            </div>
        </div>
    );
}
