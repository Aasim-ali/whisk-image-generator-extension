'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // Redirect based on role or to home
            if (res.data.user.role === 'admin') {
                // Correct logic would be to redirect to admin panel URL (different port)
                // window.location.href = 'http://localhost:5173'; 
                // But for now, let's just go home
                router.push('/');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="glass p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-3 rounded bg-white/10 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 rounded bg-white/10 border border-gray-700 text-white focus:outline-none focus:border-purple-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full btn">Sign In</button>
                </form>
                <p className="mt-6 text-center text-gray-400">
                    Don't have an account? <Link href="/register" className="text-purple-400 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
