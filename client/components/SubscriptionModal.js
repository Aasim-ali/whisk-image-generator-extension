'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BadgeCheck, Calendar, Zap, Crown, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

// Static free tier details
const FREE_PLAN = {
    name: 'Free',
    price: 0,
    credits: 5,
    features: ['5 images / day', '1 device', 'Basic Whisk access', 'Community support'],
};

export default function SubscriptionModal({ isOpen, onClose, user }) {
    const [planDetails, setPlanDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const isFreePlan = !user?.planId;

    // Fetch current plan details from API when modal opens
    useEffect(() => {
        if (!isOpen || isFreePlan) return;
        const fetchPlan = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/plans/getPlanList`
                );
                const found = res.data.find((p) => p.id === user.planId || p._id === user.planId);
                setPlanDetails(found || null);
            } catch (e) {
                console.error('Failed to fetch plan details', e);
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
    }, [isOpen, user?.planId]);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
        });
    };

    const getDaysLeft = (dateStr) => {
        if (!dateStr) return null;
        const diff = new Date(dateStr) - new Date();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const expiryDate = user?.planExpiresAt ? formatDate(user.planExpiresAt) : null;
    const daysLeft = user?.planExpiresAt ? getDaysLeft(user.planExpiresAt) : null;
    const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
    const isExpired = daysLeft === 0;

    const plan = isFreePlan ? FREE_PLAN : planDetails;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header gradient band */}
                            <div className={`h-2 w-full ${isFreePlan ? 'bg-emerald-400' : 'bg-primary'}`} />

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="p-8">
                                {/* User info */}
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg ${isFreePlan ? 'bg-emerald-100 text-emerald-700' : 'bg-primary text-black'}`}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-lg leading-none mb-1">{user?.name}</p>
                                        <p className="text-sm text-gray-500 font-bold">{user?.email}</p>
                                    </div>
                                </div>

                                {/* Plan badge */}
                                <div className="mb-6">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Current Plan</p>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-sm ${isFreePlan ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-gray-900'}`}>
                                        {isFreePlan ? <BadgeCheck size={16} /> : <Crown size={16} />}
                                        {loading ? 'Loading...' : (plan?.name || 'Unknown Plan')}
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : plan ? (
                                    <>
                                        {/* Plan stats */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            {/* Credits */}
                                            <div className="bg-gray-50 rounded-2xl p-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Zap size={14} className="text-primary" fill="currentColor" />
                                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Images</span>
                                                </div>
                                                <p className="font-black text-gray-900 text-lg">
                                                    {plan.credits?.toLocaleString()}
                                                    <span className="text-xs font-bold text-gray-400 ml-1">/{isFreePlan ? 'day' : 'month'}</span>
                                                </p>
                                            </div>

                                            {/* Duration / Expiry */}
                                            {!isFreePlan && (
                                                <div className={`rounded-2xl p-4 ${isExpired ? 'bg-red-50' : isExpiringSoon ? 'bg-amber-50' : 'bg-gray-50'}`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Clock size={14} className={isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-gray-400'} />
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Days Left</span>
                                                    </div>
                                                    <p className={`font-black text-lg ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-gray-900'}`}>
                                                        {daysLeft !== null ? daysLeft : (plan.durationDays || '—')}
                                                        {daysLeft !== null && <span className="text-xs font-bold text-gray-400 ml-1">days</span>}
                                                    </p>
                                                </div>
                                            )}

                                            {isFreePlan && (
                                                <div className="bg-gray-50 rounded-2xl p-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Clock size={14} className="text-emerald-500" />
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Validity</span>
                                                    </div>
                                                    <p className="font-black text-gray-900 text-lg">Forever</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Expiry date (paid plans only) */}
                                        {!isFreePlan && expiryDate && (
                                            <div className={`flex items-start gap-3 p-4 rounded-2xl mb-6 ${isExpired ? 'bg-red-50 border border-red-100' : isExpiringSoon ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50'}`}>
                                                {isExpired || isExpiringSoon ? (
                                                    <AlertCircle size={16} className={`mt-0.5 flex-shrink-0 ${isExpired ? 'text-red-500' : 'text-amber-500'}`} />
                                                ) : (
                                                    <Calendar size={16} className="mt-0.5 text-gray-400 flex-shrink-0" />
                                                )}
                                                <div>
                                                    <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-0.5">
                                                        {isExpired ? 'Expired On' : 'Expires On'}
                                                    </p>
                                                    <p className={`font-black text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-700' : 'text-gray-900'}`}>
                                                        {expiryDate}
                                                    </p>
                                                    {isExpiringSoon && !isExpired && (
                                                        <p className="text-xs text-amber-500 font-bold mt-0.5">Renew soon to avoid interruption</p>
                                                    )}
                                                    {isExpired && (
                                                        <p className="text-xs text-red-400 font-bold mt-0.5">Your plan has expired. You're on Free tier now.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Features */}
                                        {plan.features?.length > 0 && (
                                            <div className="mb-6">
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Includes</p>
                                                <ul className="space-y-2">
                                                    {(isFreePlan ? plan.features : plan.features.slice(0, 4)).map((f, i) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${isFreePlan ? 'bg-emerald-100' : 'bg-primary/15'}`}>
                                                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                                    <path d="M1 4l2 2 4-4" stroke={isFreePlan ? '#059669' : '#1a1a1a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </div>
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                ) : null}

                                {/* CTA */}
                                <Link
                                    href="/plans"
                                    onClick={onClose}
                                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-black text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${isFreePlan ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                                >
                                    {isFreePlan ? 'Upgrade Plan' : 'View All Plans'}
                                    <ChevronRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
