'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

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
                // Since useAuth listens to localStorage on mount, we might need to reload or expose a setUser method
                // For now, redirecting to home will verify auth
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
        <div className="min-h-screen bg-[#030014] flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" color="primary" />
                <p className="mt-4 text-gray-400">Completing secure sign in...</p>
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
