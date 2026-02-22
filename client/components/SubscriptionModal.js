'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BadgeCheck, Calendar, Zap, Crown, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const FREE_PLAN = {
    name: 'Free',
    credits: 5,
    features: ['5 images / day', '1 device', 'Basic Whisk access', 'Community support'],
};

export default function SubscriptionModal({ isOpen, onClose, user }) {
    const [planDetails, setPlanDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Wait for client mount before using portal (SSR safety)
    useEffect(() => { setMounted(true); }, []);

    const isFreePlan = !user?.planId;

    useEffect(() => {
        if (!isOpen || isFreePlan) return;
        const fetchPlan = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plans/getPlanList`);
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

    // Lock body scroll & handle Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            window.addEventListener('keydown', handleKey);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
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
    const accentColor = isFreePlan ? 'emerald' : 'yellow';

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm min-h-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal container — fixed to viewport */}
                    <div
                        className="fixed inset-0 z-[61] flex items-center justify-center p-4"
                        style={{ pointerEvents: 'none' }}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                            style={{ pointerEvents: 'auto', maxHeight: 'min(90vh, 700px)' }}
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* ── Sticky Header ── */}
                            <div className={`flex-shrink-0 px-6 pt-6 pb-5 border-b border-gray-100 ${isFreePlan ? 'bg-emerald-50/60' : 'bg-primary/5'}`}>
                                {/* Close */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/80 hover:bg-gray-100 border border-gray-200/60 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shadow-sm"
                                >
                                    <X size={15} />
                                </button>

                                {/* Avatar + name */}
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-md flex-shrink-0 ${isFreePlan ? 'bg-emerald-500 text-white' : 'bg-primary text-black'}`}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-gray-900 text-base leading-tight truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 font-medium truncate">{user?.email}</p>
                                    </div>
                                </div>

                                {/* Plan pill */}
                                <div className="mt-4 flex items-center gap-2">
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${isFreePlan ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/15 text-gray-900'}`}>
                                        {isFreePlan ? <BadgeCheck size={13} /> : <Crown size={13} />}
                                        {loading ? 'Loading…' : (plan?.name ?? 'Unknown Plan')}
                                    </div>
                                    <span className="text-xs text-gray-400 font-semibold">Active Plan</span>
                                </div>
                            </div>

                            {/* ── Scrollable Body ── */}
                            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
                                style={{ WebkitOverflowScrolling: 'touch' }}>

                                {loading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="w-7 h-7 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : plan ? (
                                    <>
                                        {/* Stats grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Credits */}
                                            <div className="bg-gray-50 rounded-2xl p-4">
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <Zap size={13} className="text-primary" fill="currentColor" />
                                                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Images</span>
                                                </div>
                                                <p className="font-black text-gray-900 text-xl leading-none">
                                                    {plan.credits?.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                                                    per {isFreePlan ? 'day' : 'month'}
                                                </p>
                                            </div>

                                            {/* Validity */}
                                            {isFreePlan ? (
                                                <div className="bg-emerald-50 rounded-2xl p-4">
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        <Clock size={13} className="text-emerald-500" />
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Validity</span>
                                                    </div>
                                                    <p className="font-black text-emerald-700 text-xl leading-none">∞</p>
                                                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">Forever free</p>
                                                </div>
                                            ) : (
                                                <div className={`rounded-2xl p-4 ${isExpired ? 'bg-red-50' : isExpiringSoon ? 'bg-amber-50' : 'bg-gray-50'}`}>
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        <Clock size={13} className={isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-gray-400'} />
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Days Left</span>
                                                    </div>
                                                    <p className={`font-black text-xl leading-none ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-600' : 'text-gray-900'}`}>
                                                        {daysLeft ?? (plan.durationDays ?? '—')}
                                                    </p>
                                                    <p className={`text-xs font-semibold mt-0.5 ${isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-500' : 'text-gray-400'}`}>
                                                        {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring soon' : 'days remaining'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Expiry banner — paid plans only */}
                                        {!isFreePlan && expiryDate && (
                                            <div className={`flex items-start gap-3 p-4 rounded-2xl ${isExpired
                                                ? 'bg-red-50 border border-red-100'
                                                : isExpiringSoon
                                                    ? 'bg-amber-50 border border-amber-100'
                                                    : 'bg-gray-50'
                                                }`}>
                                                {(isExpired || isExpiringSoon)
                                                    ? <AlertCircle size={15} className={`mt-0.5 flex-shrink-0 ${isExpired ? 'text-red-400' : 'text-amber-400'}`} />
                                                    : <Calendar size={15} className="mt-0.5 text-gray-400 flex-shrink-0" />
                                                }
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">
                                                        {isExpired ? 'Expired on' : 'Expires on'}
                                                    </p>
                                                    <p className={`font-black text-sm ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-amber-700' : 'text-gray-900'}`}>
                                                        {expiryDate}
                                                    </p>
                                                    {isExpiringSoon && !isExpired && (
                                                        <p className="text-xs text-amber-500 font-semibold mt-0.5">Renew soon to avoid interruption</p>
                                                    )}
                                                    {isExpired && (
                                                        <p className="text-xs text-red-400 font-semibold mt-0.5">You've been moved to the Free tier</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Features */}
                                        {plan.features?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3">Includes</p>
                                                <ul className="space-y-2.5">
                                                    {(isFreePlan ? plan.features : plan.features.slice(0, 4)).map((f, i) => (
                                                        <li key={i} className="flex items-center gap-2.5 text-sm font-semibold text-gray-600">
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
                                ) : (
                                    <p className="text-center text-sm text-gray-400 font-semibold py-8">No plan details found.</p>
                                )}
                            </div>

                            {/* ── Sticky Footer ── */}
                            <div className="flex-shrink-0 px-6 pb-6 pt-4 border-t border-gray-100">
                                <Link
                                    href="/plans"
                                    onClick={onClose}
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-black text-sm transition-all duration-200 active:scale-[0.98] ${isFreePlan
                                        ? 'bg-primary text-black hover:brightness-95 shadow-lg shadow-primary/20'
                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {isFreePlan ? 'Upgrade Plan' : 'View All Plans'}
                                    <ChevronRight size={15} />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
