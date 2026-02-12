'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(name, email, password);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="glass p-8 w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 p-4 opacity-20 pointer-events-none">
                    <div className="w-32 h-32 bg-pink-500 blur-3xl rounded-full"></div>
                </div>

                <h2 className="text-3xl font-bold mb-2 text-center text-white">Create Account</h2>
                <p className="text-gray-400 text-center mb-8">Join Whisk to start creating</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder-gray-500"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder-gray-500"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-all placeholder-gray-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn py-3 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-6 mb-6 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-[#0a0a0a] text-gray-500">Or sign up with</span>
                    </div>
                </div>

                <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/oauth/google`}
                    className="w-full btn bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 flex items-center justify-center gap-3 py-3 mb-6 transition-all shadow-lg hover:shadow-xl"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Sign up with Google
                </a>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <p className="text-gray-400">
                        Already have an account? <Link href="/login" className="text-primary hover:text-white transition-colors font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
