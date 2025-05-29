import BarChartByProgram from "../dynamic/barchart";
import DemographicsChart from "../dynamic/demographics";
import StatsCard from "../dynamic/card";
import { Users, GraduationCap, Landmark, AlertTriangle } from "lucide-react";


const dashboardData = {
  stats: [
    {
      icon: Users,
      value: "589",
      label: "Total students enrolled",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      icon: GraduationCap,
      value: "10,024",
      label: "Students granted free education",
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      icon: Landmark,
      value: "216",
      label: "Total institutional investment in scholarships",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      icon: AlertTriangle,
      value: "216",
      label: "Students in flood-prone area",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
  ],
  programs: [
    { program_name: "BA Broadcasting", addresses: [{ student_count: 148 }] },
    { program_name: "BS Accountancy", addresses: [{ student_count: 85 }] },
    { program_name: "BS Accounting IS", addresses: [{ student_count: 50 }] },
    { program_name: "BS Social Work", addresses: [{ student_count: 113 }] },
    { program_name: "BS Information Systems", addresses: [{ student_count: 133 }] },
    { program_name: "Associate in Computer Technology", addresses: [{ student_count: 35 }] },
  ],
  demographics: [
    {
      program_name: "BA Broadcasting",
      addresses: [
        { province: "Pampanga", city_municipality: "Apalit", barangay: "Sampaloc", street: "Fortunato Dunga", student_count: 42 },
        { province: "Pampanga", city_municipality: "San Fernando", barangay: "Del Pilar", street: "Main Street", student_count: 25 },
      ],
    },
    {
      program_name: "BS Accountancy",
      addresses: [
        { province: "Pampanga", city_municipality: "Apalit", barangay: "Sampaloc", street: "Fortunato Dunga", student_count: 25 },
        { province: "Pampanga", city_municipality: "Angeles", barangay: "Balibago", street: "Fields Avenue", student_count: 30 },
      ],
    },
    {
      program_name: "BS Accounting IS",
      addresses: [
        { province: "Pampanga", city_municipality: "Apalit", barangay: "Sampaloc", street: "Fortunato Dunga", student_count: 18 },
      ],
    },
    {
      program_name: "BS Social Work",
      addresses: [
        { province: "Pampanga", city_municipality: "Apalit", barangay: "Sampaloc", street: "Fortunato Dunga", student_count: 32 },
        { province: "Bulacan", city_municipality: "Malolos", barangay: "Poblacion", street: "Rizal Street", student_count: 20 },
      ],
    },
    {
      program_name: "BS Information Systems",
      addresses: [
        { province: "Pampanga", city_municipality: "Apalit", barangay: "Sampaloc", street: "Fortunato Dunga", student_count: 43 },
        { province: "Pampanga", city_municipality: "San Fernando", barangay: "Santo Rosario", street: "MacArthur Highway", student_count: 35 },
      ],
    },
    {
      program_name: "Associate in Computer Technology",
      addresses: [
        { province: "Pampanga", city_municipality: "Apalit", barangay: "Sampaloc", street: "Fortunato Dunga", student_count: 12 },
      ],
    },
  ],
};

export default function SchoolAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.stats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        <div>
          <BarChartByProgram programs={dashboardData.programs} />
        </div>

        <div>
          <DemographicsChart demographics={dashboardData.demographics} />
        </div>
      </div>
    </div>
  );
}
