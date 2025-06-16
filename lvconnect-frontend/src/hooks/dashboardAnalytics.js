// hooks/useAnalyticsDashboard.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAnalyticsDashboardPsas, getRegistrarDashboard, getSchoolAdminDashboard } from '@/services/dashboardAPI';
import { useLoading } from '@/context/LoadingContext';

export const useAnalyticsDashboard = () => {
    const [data, setData] = useState({
        stats: [],
        demographics: [],
    });
    const [error, setError] = useState(null);
    const { setLoading } = useLoading();

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
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

    return { ...data, error };
    
};

export const useSchoolAdminDashboard = () => {
     const [data, setData] = useState({
        stats: [],
        demographics: [],
        programs: [],
    });

    
    const { setLoading } = useLoading();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            try {
                const res = await getSchoolAdminDashboard();
                const { stats, student_demographics, higher_ed_population } = res;

                const parsedStats = Object.entries(stats).map(([label, value]) => ({
                    label,
                    value,
                }));

                setData({
                    stats: parsedStats,
                    demographics: student_demographics,
                    programs: higher_ed_population,
                });

                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return { ...data, error };
    
}

export const useRegistrarDashboard = () => {
    const [data, setData] = useState({
        stats: [],
        programs: [],
    });

    const { setLoading } = useLoading();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            try {
                const res = await getRegistrarDashboard();
                const { stats, higher_ed_population } = res;

                const parsedStats = Object.entries(stats).map(([label, value]) => ({
                    label,
                    value,
                }));

                setData({
                    stats: parsedStats,
                    programs: higher_ed_population,
                });

                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return { ...data, error };
    
};