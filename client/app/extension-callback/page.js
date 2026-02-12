'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';

function ExtensionCallbackContent() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        // The extension content script will sniff this URL and capture the token
        if (token) {
            // Optional: Send message to extension if needed, but URL sniffing is usually enough
            console.log('Authentication successful for extension');
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center text-white p-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-glow-primary">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Sign In Successful
            </h1>
            <p className="text-gray-400 text-center max-w-md mb-8">
                You have successfully signed in to Whisk. You can now close this tab and return to the extension to start generating images.
            </p>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-400 animate-pulse">
                Connecting to extension...
            </div>
        </div>
    );
}

export default function ExtensionCallback() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ExtensionCallbackContent />
        </Suspense>
    );
}
