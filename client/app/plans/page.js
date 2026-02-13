'use client';
import Script from 'next/script';
import { usePlans } from '../../hooks/usePlans';
import { Check, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Plans() {
    const { plans, loading, purchasePlan } = usePlans();

    // Determine the most popular plan (you can customize this logic)
    const getPopularPlanId = () => {
        if (plans.length === 0) return null;
        // Assuming the middle plan or second plan is most popular
        return plans.length >= 2 ? plans[1].id : plans[0].id;
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 pt-32 pb-20">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="container mx-auto px-4">
                {/* Header Section */}
                <motion.div
                    className="text-center mb-20 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Zap size={16} className="text-gray-900" fill="currentColor" />
                        <span className="text-sm font-bold text-gray-900">Simple, Transparent Pricing</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 text-gray-900 tracking-tight leading-[1.1]">
                        Choose Your Plan
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed">
                        Select the perfect bulk AI generation package for your creative workflow
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    /* Pricing Cards Grid */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => {
                            const isPopular = plan.id === getPopularPlanId();

                            return (
                                <motion.div
                                    key={plan.id}
                                    className={`relative bg-white rounded-[3rem] p-10 border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${isPopular
                                            ? 'border-primary shadow-xl shadow-primary/10'
                                            : 'border-gray-100 shadow-lg hover:border-primary/50'
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    {/* Popular Badge */}
                                    {isPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <div className="bg-primary text-black px-6 py-2 rounded-full font-black text-sm shadow-lg flex items-center gap-2">
                                                <Star size={14} fill="currentColor" />
                                                Most Popular
                                            </div>
                                        </div>
                                    )}

                                    {/* Plan Name */}
                                    <h3 className="text-2xl md:text-3xl font-black mb-6 text-gray-900">
                                        {plan.name}
                                    </h3>

                                    {/* Price */}
                                    <div className="mb-2">
                                        <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
                                            ₹{plan.price / 100}
                                        </span>
                                        <span className="text-xl text-gray-500 font-bold">/month</span>
                                    </div>

                                    {/* Credits */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-8">
                                        <Zap size={16} fill="currentColor" />
                                        <span className="font-black text-gray-900">
                                            {plan.credits.toLocaleString()} Images/month
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-gray-100 mb-8"></div>

                                    {/* Features List */}
                                    <ul className="mb-10 space-y-4">
                                        {plan.features?.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-1 flex-shrink-0">
                                                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <Check size={14} className="text-gray-900" strokeWidth={3} />
                                                    </div>
                                                </div>
                                                <span className="text-gray-600 font-bold leading-relaxed">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => purchasePlan(plan)}
                                        className={`w-full py-4 px-6 rounded-2xl font-black text-lg transition-all duration-200 shadow-lg ${isPopular
                                                ? 'bg-primary text-black hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]'
                                                : 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02]'
                                            } active:scale-[0.98]`}
                                    >
                                        Get Started
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Trust Indicators */}
                <motion.div
                    className="mt-20 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="flex flex-wrap justify-center gap-8 text-gray-500 font-bold text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Cancel Anytime</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
