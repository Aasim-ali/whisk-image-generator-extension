import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export const usePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
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
        if (!user) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            // 0. Get Razorpay Key
            const { data: { key } } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payment/key`);

            // 1. Create Order
            const orderRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment/order`, {
                planId: plan.id,
                userId: user.id,
            });

            const { id: order_id, amount, currency } = orderRes.data;

            // 2. Open Razorpay
            const options = {
                key: key || 'YOUR_RAZORPAY_KEY_ID_HERE', // Fallback if API fails
                amount: amount.toString(),
                currency: currency,
                name: 'Whisk Generator',
                description: `Purchase ${plan.name} Plan`,
                order_id: order_id,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/payment/verify`, {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            userId: user.id,
                            planId: plan.id,
                        });
                        alert(`Payment Successful! You now have ${verifyRes.data.newCredits} credits.`);
                        router.push('/');
                    } catch (error) {
                        alert('Payment Verification Failed');
                        console.error(error);
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
        } catch (err) {
            console.error('Purchase error:', err);
            alert('Something went wrong with the purchase. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return { plans, loading, error, purchasePlan };
};
