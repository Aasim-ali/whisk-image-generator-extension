'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fadeInUp } from '../../utils/animations';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isExtension = searchParams.get('extension') === 'true';

    // Auto-redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            console.log("User already logged in");
            if (isExtension) {
                try {
                    const user = JSON.parse(userStr);
                    const redirectUrl = `/extension-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
                    window.location.href = redirectUrl;
                } catch (e) {
                    console.error("Error parsing user data for redirect", e);
                }
            } else {
                router.push('/');
            }
        }
    }, [isExtension, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.push('/');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="w-full max-w-md my-4"
            >
                <Card className="card-base border-none overflow-hidden pb-8">
                    <CardHeader className="text-center pt-10 pb-6">
                        <motion.div
                            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center text-black text-3xl font-black shadow-lg shadow-primary/30"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            W
                        </motion.div>
                        <CardTitle className="text-4xl font-black mb-2 text-gray-900">Welcome Back</CardTitle>
                        <CardDescription className="text-gray-500 font-bold">Sign in to continue to WhiskAutomator</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Error Alert */}
                        {error && (
                            <motion.div
                                className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-bold flex items-center gap-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-gray-900/70 ml-1">Email Address</Label>
                                <div className="relative">
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-4"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <Label className="text-gray-900/70">Password</Label>
                                    <Link href="/forgot-password" title="Forgot password" className="text-sm font-bold text-gray-400 hover:text-primary transition-colors">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary h-14 text-lg group"
                            >
                                {loading ? (
                                    <Loader className="animate-spin mr-2" size={20} />
                                ) : (
                                    <>
                                        Sign In
                                        <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-white text-gray-400 font-black uppercase tracking-widest text-[10px]">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <Button
                            asChild
                            variant="outline"
                            className="w-full btn-outline h-14 font-black"
                        >
                            <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/oauth/google${isExtension ? '?extension=true' : ''}`}>
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                                Google
                            </a>
                        </Button>
                    </CardContent>

                    <CardFooter className="flex justify-center pb-0">
                        <p className="text-gray-500 font-bold">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary hover:text-primary-dark transition-colors border-b-2 border-primary/20 hover:border-primary">
                                Create account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}

export default function Login() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <LoginForm />
        </Suspense>
    );
}
