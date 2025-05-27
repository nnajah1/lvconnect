// hooks/useAnalyticsDashboard.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAnalyticsDashboardPsas } from '@/services/dashboardAPI';

export const useAnalyticsDashboard = () => {
    const [data, setData] = useState({
        stats: [],
        demographics: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await getAnalyticsDashboardPsas();
                const { stats, student_demographics } = res;

                const parsedStats = Object.entries(stats).map(([label, value]) => ({
                    label,
                    value,
                }));

                setData({
                    stats: parsedStats,
                    demographics: student_demographics,
                });

                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return { ...data, loading, error };
    
};