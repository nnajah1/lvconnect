// import { formAPI } from "@/services/axios";

import BarChartByProgram from "@/components/dashboards/dynamic/barchart";
import StatsCard from "@/components/dashboards/dynamic/card";
import DemographicsChart from "@/components/dashboards/dynamic/demographics";
import { useSchoolAdminDashboard } from "@/hooks/dashboardAnalytics";
import { statConfig, statSchoolAdmin } from "@/utils/statsDashboard";
import { useEffect, useState } from "react";


const SchoolAdminDashboard = () => {

  const { stats, demographics, programs, loading } = useSchoolAdminDashboard();

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
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {enrichedStats.map((stat, idx) => (
          <StatsCard key={idx} stat={stat} />
        ))}
      </div>
      {/* <div className="py-4">
        <BarChartByProgram programs={programs} />
      </div> */}

      <div className="py-4">
        <DemographicsChart demographics={demographics} />
      </div>
    </div>
  )
};

export default SchoolAdminDashboard;