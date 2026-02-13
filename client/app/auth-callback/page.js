'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth(); // We might need a method to set user directly, but we can access localStorage

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));

                // Save to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Force a window reload or router push to trigger auth state update
                window.location.href = '/';
            } catch (error) {
                console.error('Error parsing auth data:', error);
                router.push('/login?error=auth_failed');
            }
        } else {
            router.push('/login?error=no_token');
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-20 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

            <div className="text-center relative z-10">
                <motion.div
                    className="w-24 h-24 mx-auto mb-10 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity
                    }}
                >
                    <Zap size={40} className="text-black" />
                </motion.div>

                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Securing your session</h2>
                <div className="flex flex-col items-center gap-6">
                    <LoadingSpinner size="lg" color="primary" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Completing secure sign in...</p>
                </div>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
