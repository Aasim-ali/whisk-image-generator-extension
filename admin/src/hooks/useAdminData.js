import { useState, useCallback } from 'react';
import axios from 'axios';

export const useAdminData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL + '/admin';

    const getAuthHeader = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchDashboardStats = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/dashboard`, getAuthHeader());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/customers`, getAuthHeader());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/transactions`, getAuthHeader());
            return res.data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    return {
        loading,
        error,
        fetchDashboardStats,
        fetchCustomers,
        fetchTransactions
    };
};
