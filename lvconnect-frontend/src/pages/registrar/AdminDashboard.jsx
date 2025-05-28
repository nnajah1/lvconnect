// import { formAPI } from "@/services/axios";
import BarChartByProgram from "@/components/dashboards/dynamic/barchart";
import StatsCard from "@/components/dashboards/dynamic/card";
import { statConfig } from "@/utils/statsDashboard";
import { useEffect, useState } from "react";


const RegistrarDashboard = () => {
  const programs = [
  { name: "BA Broadcasting", student_count: 42},
  { name: "BS Accountancy", student_count: 25 },
  { name: "BS Accounting IS", student_count: 18  },
  { name: "BS Social Work", student_count: 33 },
  { name: "BS Information Systems", student_count: 42  },
  { name: "Associate in Computer Technology", student_count: 12  },
];
const stats = [
  { label: 'students', value: 500 },
  { label: 'teachers', value: 50 },
  { label: 'courses', value: 20 },
  { label: 'enrollments', value: 1200 },
];


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
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {enrichedStats.map((stat, idx) => (
          <StatsCard key={idx} stat={stat} />
        ))}
      </div>
      <div className="p-4">
        <BarChartByProgram programs={programs} />
      </div>
    </div>
  )
};

export default RegistrarDashboard;