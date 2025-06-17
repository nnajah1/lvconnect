// hooks/useAnalyticsDashboard.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getAnalyticsDashboardPsas, getRegistrarDashboard, getSchoolAdminDashboard } from '@/services/dashboardAPI';
import { useLoading } from '@/context/LoadingContext';

export const useAnalyticsDashboard = () => {
    const [data, setData] = useState({
        stats: [],
        demographics: [],
        pie: []
    });
    const [error, setError] = useState(null);
    const { setLoading } = useLoading();

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            try {
                const res = await getAnalyticsDashboardPsas();
                const { stats, student_population, form_submission_counts  } = res;

                const parsedStats = Object.entries(stats).map(([label, value]) => ({
                    label,
                    value,
                }));

                setData({
                    stats: parsedStats,
                    demographics: student_population,
                    pie: form_submission_counts,
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
        breakdown: [],
    });

    
    const { setLoading } = useLoading();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            try {
                const res = await getSchoolAdminDashboard();
                const { stats, student_population, higher_ed_population, breakdown_of_funds } = res;

                const parsedStats = Object.entries(stats).map(([label, value]) => ({
                    label,
                    value,
                }));

                setData({
                    stats: parsedStats,
                    demographics: student_population,
                    programs: higher_ed_population,
                    breakdown: breakdown_of_funds,
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
        pie: []
    });

    const { setLoading } = useLoading();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            try {
                const res = await getRegistrarDashboard();
                const { stats, student_population, enrolled_per_program } = res;

                const parsedStats = Object.entries(stats).map(([label, value]) => ({
                    label,
                    value,
                }));

                setData({
                    stats: parsedStats,
                    programs: student_population,
                    pie: enrolled_per_program
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