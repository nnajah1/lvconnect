// import { formAPI } from "@/services/axios";
import BarChartByProgram from "@/components/dashboards/dynamic/barchart";
import StatsCard from "@/components/dashboards/dynamic/card";
import DemographicsChart from "@/components/dashboards/dynamic/demographics";
import ChartPieLegendCard from "@/components/dashboards/dynamic/pieChart";
import { useRegistrarDashboard } from "@/hooks/dashboardAnalytics";
import { statConfig, statRegistrarAdmin } from "@/utils/statsDashboard";
import { PieChart } from "lucide-react";
import { useEffect, useState } from "react";


const RegistrarDashboard = () => {
    const { stats, programs, loading, pie } = useRegistrarDashboard();
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
    const config = statRegistrarAdmin[stat.label] || {};
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
        <DemographicsChart demographics={programs} />
      </div>
       <div className="flex-1">
        <ChartPieLegendCard
          stat={{
            title: "Active Student Accounts",
            subtitle: "Overview of student accounts per program",
            icon: PieChart,
            data: pie,
            labelKey: "program_name",
            valueKey: "student_count",
          }}
        />
      </div>
    </div>
  </div>
  )
};

export default RegistrarDashboard;