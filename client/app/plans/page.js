'use client';
import Script from 'next/script';
import { usePlans } from '../../hooks/usePlans';
import { Check } from 'lucide-react';

export default function Plans() {
    const { plans, loading, purchasePlan } = usePlans();

    return (
        <div className="min-h-screen text-white pt-24 pb-10">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Choose Your Plan
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan) => (
                            <div key={plan.id} className="glass p-8 hover:scale-105 transition duration-300 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <div className="w-32 h-32 bg-primary blur-3xl rounded-full"></div>
                                </div>

                                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                                <div className="text-4xl font-bold mb-2">
                                    ₹{plan.price / 100}
                                    <span className="text-lg text-gray-400 font-normal">/mo</span>
                                </div>
                                <div className="text-primary font-medium mb-6">
                                    {plan.credits} Images per month
                                </div>

                                <div className="h-px bg-white/10 my-6"></div>

                                <ul className="mb-8 space-y-3">
                                    {plan.features?.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                            <div className="mt-1 min-w-5">
                                                <Check size={18} className="text-green-400" />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => purchasePlan(plan)}
                                    className="w-full btn text-center py-3 font-semibold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40"
                                >
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
