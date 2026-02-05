'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function Plans() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // In real app, plans would come from API or Config
    const plans = [
        {
            id: 'plan_basic',
            name: 'Starter',
            price: 500, // 500 INR
            credits: 100,
            features: ['100 Images', 'Standard Speed', 'Email Support'],
        },
        {
            id: 'plan_pro',
            name: 'Pro',
            price: 1500, // 1500 INR
            credits: 500,
            features: ['500 Images', 'Fast Speed', 'Priority Support'],
        },
    ];

    const handlePurchase = async (plan) => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Order
            const orderRes = await axios.post('http://localhost:5000/api/payment/order', {
                planId: plan.id,
                userId: user.id,
            });

            const { id: order_id, amount, currency } = orderRes.data;

            // 2. Open Razorpay
            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID_HERE', // Should ideally allow env var public access or fetch from server config
                amount: amount.toString(),
                currency: currency,
                name: 'Whisk Generator',
                description: `Purchase ${plan.name} Plan`,
                order_id: order_id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        await axios.post('http://localhost:5000/api/payment/verify', {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            userId: user.id,
                            planId: plan.id,
                        });
                        alert('Payment Successful!');
                        router.push('/');
                    } catch (error) {
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#8a2be2',
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white pt-24 pb-10">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Choose Your Plan
                </h1>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan) => (
                        <div key={plan.id} className="glass p-8 hover:scale-105 transition duration-300">
                            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-6">
                                ₹{plan.price}
                                <span className="text-lg text-gray-400 font-normal">/mo</span>
                            </div>
                            <ul className="mb-8 space-y-3">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-300">
                                        <span className="text-green-400 mr-2">✓</span> {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handlePurchase(plan)}
                                disabled={loading}
                                className="w-full btn text-center"
                            >
                                {loading ? 'Processing...' : 'Get Started'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
