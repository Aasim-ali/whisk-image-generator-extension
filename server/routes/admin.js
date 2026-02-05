import express from 'express';
import { User, Transaction } from '../models/index.js';

const router = express.Router();

// Middleware to check admin role (Simplified)
const isAdmin = async (req, res, next) => {
    // In real app, verify token and check req.user.role === 'admin'
    // using middleware from auth
    next();
};

router.get('/dashboard', isAdmin, async (req, res) => {
    try {
        const userCount = await User.count();
        const transactionCount = await Transaction.count();
        const recentTransactions = await Transaction.findAll({ limit: 5, order: [['createdAt', 'DESC']], include: [User] });

        res.json({
            stats: {
                users: userCount,
                transactions: transactionCount,
            },
            recentTransactions
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/customers', isAdmin, async (req, res) => {
    try {
        const users = await User.findAll({ order: [['createdAt', 'DESC']] });
        res.json(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/transactions', isAdmin, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ include: [User], order: [['createdAt', 'DESC']] });
        res.json(transactions);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
