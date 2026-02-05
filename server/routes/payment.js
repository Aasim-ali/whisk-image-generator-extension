import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Transaction, User, Plan } from '../models/index.js';

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
router.post('/order', async (req, res) => {
    try {
        const { planId, userId } = req.body;

        // In a real app, fetch price from Plan model
        // const plan = await Plan.findByPk(planId);
        // const amount = plan.price;

        // Hardcoding for now/demo as Plan data might be empty
        const amount = 50000; // 500 INR

        const options = {
            amount: amount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send('Some error occured');

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Verify Payment
router.post('/verify', async (req, res) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            userId,
            planId
        } = req.body;

        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
        const digest = shasum.digest('hex');

        if (digest !== razorpaySignature) {
            return res.status(400).json({ msg: 'Transaction not legit!' });
        }

        // Save transaction
        await Transaction.create({
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            razorpay_signature: razorpaySignature,
            status: 'success',
            amount: 50000, // Should take from order or plan
            userId: userId,
            planId: planId // Optional if you want to link plan
        });

        // Update User Credits/Plan here if needed
        // const user = await User.findByPk(userId);
        // user.credits += 100;
        // await user.save();

        res.json({
            msg: 'success',
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
