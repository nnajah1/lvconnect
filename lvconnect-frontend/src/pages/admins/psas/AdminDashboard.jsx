
import React, { useState, useEffect } from 'react';
import { getAnalyticsDashboardPsas } from '@/services/dashboardAPI';
import DemographicsChart from '@/components/dashboards/dynamic/demographics';
import StatsCard from '@/components/dashboards/dynamic/card';
import { statConfig } from '@/utils/statsDashboard';
import { useAnalyticsDashboard } from '@/hooks/dashboardAnalytics';
import { Loader2, Loader3 } from '@/components/dynamic/loader';


const PsasDashboard = () => {
  const { stats, demographics, loading } = useAnalyticsDashboard();

  if (loading) return <Loader3 />;

  const enrichedStats = stats.map(stat => {
    const config = statConfig[stat.label] || {};
    return {
      ...stat,
      label: config.label || stat.label,
      icon: config.icon,
      color: config.color || 'bg-gray-400',
    };
  });

  return (
    <div className="space-y-6 h-full m-2">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrichedStats.map((stat, idx) => (
          <StatsCard key={idx} stat={stat} />
        ))}
      </div>

      <DemographicsChart demographics={demographics} />

    </div>

  );
}

export default PsasDashboard;
