
import React, { useState, useEffect } from 'react';
import { getAnalyticsDashboardPsas } from '@/services/dashboardAPI';
import DemographicsChart from '@/components/dashboards/dynamic/demographics';
import StatsCard from '@/components/dashboards/dynamic/card';
import { statConfig } from '@/utils/statsDashboard';
import { useAnalyticsDashboard } from '@/hooks/dashboardAnalytics';
import { Loader3 } from '@/components/dynamic/loader';
import { useLoading } from '@/context/LoadingContext';
import ChartPieLegendCard from '@/components/dashboards/dynamic/pieChart';
import { PieChart } from 'lucide-react';


const PsasDashboard = () => {
  const { stats, demographics, pie } = useAnalyticsDashboard();

  // if (loading) return <Loader3 />;

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
    {/* Stats at the top */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {enrichedStats.map((stat, idx) => (
        <StatsCard key={idx} stat={stat} />
      ))}
    </div>

    {/* Demographics and Pie Chart aligned with justify-between */}
    <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
      <div className="flex-1">
        <DemographicsChart demographics={demographics} />
      </div>
      <div className="flex-1">
        <ChartPieLegendCard
          stat={{
            title: "Submitted School Forms",
            subtitle: "School Forms Breakdown",
            icon: PieChart,
            data: pie,
            labelKey: "form_type",
            valueKey: "count",
          }}
        />
      </div>
    </div>
  </div>
);
}

export default PsasDashboard;
