import { useState, useCallback } from 'react';
import axios from 'axios';

export const usePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL + '/admin/plans';

    const getAuthHeader = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchPlans = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/getPlanList`, getAuthHeader());
            setPlans(res.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    const createPlan = async (planData) => {
        setLoading(true);
        try {
            await axios.post(API_URL, planData, getAuthHeader());
            await fetchPlans();
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            return { success: false, error: err.response?.data?.message || err.message };
        } finally {
            setLoading(false);
        }
    };

    const updatePlan = async (id, planData) => {
        setLoading(true);
        try {
            await axios.put(`${API_URL}/${id}`, planData, getAuthHeader());
            await fetchPlans();
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            return { success: false, error: err.response?.data?.message || err.message };
        } finally {
            setLoading(false);
        }
    };

    const deletePlan = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/${id}`, getAuthHeader());
            await fetchPlans();
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            return { success: false, error: err.response?.data?.message || err.message };
        } finally {
            setLoading(false);
        }
    };

    return {
        plans,
        loading,
        error,
        fetchPlans,
        createPlan,
        updatePlan,
        deletePlan
    };
};
