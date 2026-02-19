'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ContactPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Auth guard — redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (description.trim().length < 10) {
            setError('Please write at least 10 characters.');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/contact`, { description }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <MessageSquare size={16} className="text-gray-900" />
                        <span className="text-sm font-bold text-gray-900">Support & Feedback</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black mb-5 text-gray-900 tracking-tight leading-[1.1]">
                        Contact Us
                    </h1>

                    <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl mx-auto">
                        Running into an issue? Have a suggestion or feature idea? We read every message and get back to you personally.
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    className="bg-white rounded-[2.5rem] border-2 border-gray-100 shadow-xl p-10 md:p-14"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <AnimatePresence mode="wait">
                        {submitted ? (
                            /* ── Success State ── */
                            <motion.div
                                key="success"
                                className="text-center py-8"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} className="text-emerald-600" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-3">Message Sent!</h2>
                                <p className="text-gray-500 font-medium text-lg mb-8">
                                    Thanks for reaching out, <span className="font-black text-gray-900">{user.name.split(' ')[0]}</span>. We'll reply to <span className="font-black text-gray-900">{user.email}</span> as soon as possible.
                                </p>
                                <button
                                    onClick={() => { setSubmitted(false); setDescription(''); }}
                                    className="px-8 py-3 rounded-2xl bg-gray-900 text-white font-black text-sm hover:bg-gray-800 transition-all active:scale-95"
                                >
                                    Send Another Message
                                </button>
                            </motion.div>
                        ) : (
                            /* ── Form ── */
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* User pill */}
                                <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-black font-black text-base flex-shrink-0">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 leading-none mb-0.5">{user.name}</p>
                                        <p className="text-xs text-gray-500 font-bold">{user.email}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                                        Your Message
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Describe the issue you're facing or share your suggestion..."
                                        rows={6}
                                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 text-gray-900 font-medium placeholder:text-gray-400 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none text-base"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 font-bold mt-2 text-right">
                                        {description.length} characters
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="flex items-center gap-2 mb-5 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600">
                                        <AlertCircle size={18} className="flex-shrink-0" />
                                        <p className="text-sm font-bold">{error}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 px-6 rounded-2xl bg-gray-900 text-white font-black text-lg flex items-center justify-center gap-3 hover:bg-gray-800 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer note */}
                <motion.p
                    className="text-center text-sm text-gray-400 font-bold mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    We typically respond within 24–48 hours.
                </motion.p>
            </div>
        </div>
    );
}
