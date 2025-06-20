// import { formAPI } from "@/services/axios";

import BarChartByProgram from "@/components/dashboards/dynamic/barchart";
import StatsCard from "@/components/dashboards/dynamic/card";
import DemographicsChart from "@/components/dashboards/dynamic/demographics";
import ChartPieLegendCard from "@/components/dashboards/dynamic/pieChart";
import { useSchoolAdminDashboard } from "@/hooks/dashboardAnalytics";
import { statConfig, statSchoolAdmin } from "@/utils/statsDashboard";
import { PieChart } from "lucide-react";
import { useEffect, useState } from "react";


const SchoolAdminDashboard = () => {

  const { stats, demographics, programs, loading,breakdown } = useSchoolAdminDashboard();

  //   const programs = [
  //   { program_name: "BA Broadcasting", student_count: 42},
  //   { program_name: "BS Accountancy", student_count: 25 },
  //   { program_name: "BS Accounting IS", student_count: 18  },
  //   { program_name: "BS Social Work", student_count: 33 },
  //   { program_name: "BS Information Systems", student_count: 42  },
  //   { program_name: "Associate in Computer Technology", student_count: 12  },
  // ];
  // const stats = [
  //   { label: 'Total Enrolled', value: 500 },
  //   { label: 'Pending Enrollment', value: 50 },
  //   { label: 'Rejected Enrollment', value: 20 },
  // ];


  const enrichedStats = stats.map(stat => {
    const config = statSchoolAdmin[stat.label] || {};
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            title: "Breakdown of Funds Usage",
            subtitle: "Overview of funds allocation per academic year.",
            icon: PieChart,
            data: breakdown,
            labelKey: "label",
            valueKey: "amount",
          }}
        />
      </div>
    </div>
  </div>
    
  )
};

export default SchoolAdminDashboard;