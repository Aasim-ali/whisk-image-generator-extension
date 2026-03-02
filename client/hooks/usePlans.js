'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const usePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user, refreshUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plans/getPlanList`);
            setPlans(res.data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching plans:', err);
        } finally {
            setLoading(false);
        }
    };

    const purchasePlan = async (plan) => {
        const token = localStorage.getItem('token');

        if (!user || !token) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            // 0. Get Razorpay Key
            const { data: { key } } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payment/key`, { headers: { Authorization: `Bearer ${token}` } });

            // 1. Create Order
            const orderRes = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/payment/order`,
                { planId: plan.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { id: order_id, amount, currency } = orderRes.data;

            // 2. Open Razorpay
            const options = {
                key: key,
                amount: amount.toString(),
                currency: currency,
                name: 'Whiskbot',
                description: `Purchase ${plan.name} Plan`,
                order_id: order_id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await axios.post(
                            `${process.env.NEXT_PUBLIC_API_URL}/payment/verify`,
                            {
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                userId: user.id,
                                planId: plan.id,
                            },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        // Sync the updated planId/credits into auth context + localStorage
                        await refreshUser();
                        toast.success(`🎉 Payment Successful! You now have ${verifyRes.data.newCredits} credits.`);
                        router.push('/');
                    } catch (error) {
                        toast.error('Payment verification failed. Please contact support.');
                        console.error(error);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#FFDD00',
                },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (err) {
            console.error('Purchase error:', err);
            toast.error('Something went wrong with the purchase. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return { plans, loading, error, purchasePlan };
};
