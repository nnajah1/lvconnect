// src/components/StudentDemographics.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

// Sample data
const data = [
  { name: "BA Broadcasting", students: 42, fill: "#1D4ED8" },
  { name: "BS Accountancy", students: 25, fill: "#EAB308" },
  { name: "BS Accounting IS", students: 18, fill: "#FACC15" },
  { name: "BS Social Work", students: 33, fill: "#8B5CF6" },
  { name: "BS Information Systems", students: 42, fill: "#991B1B" },
  { name: "Associate in Computer Technology", students: 12, fill: "#F97316" },
];

// Dropdown component
const Dropdown = ({ label, options }) => (
  <div className="flex items-center gap-2">
    <span className="font-medium text-sm text-gray-700">{label}:</span>
    <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// Main component
const StudentDemographics = () => {
  return (
    <div className="p-6 rounded-xl shadow-md bg-white max-w-6xl mx-auto mt-10 border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Student Demographics</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-6">
        <Dropdown label="Province" options={["Pampanga", "Tarlac", "Bataan"]} />
        <Dropdown label="City/Municipality" options={["Apalit", "San Fernando", "Mabalacat"]} />
        <Dropdown label="Barangay" options={["Sampaloc", "San Vicente", "Baliti"]} />
        <Dropdown label="Street" options={["Fortunato Dungo", "Jose Abad Santos", "Rizal Ave"]} />
      </div>

      {/* Bar Chart */}
      <div className="h-[400px] mt-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-25}
              textAnchor="end"
              interval={0}
              height={100}
              tick={{ fontSize: 12, fill: "#4B5563" }}
            />
            <YAxis domain={[0, 150]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="students" barSize={50}>
              <LabelList
                dataKey="students"
                position="top"
                style={{
                  fill: "#000",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentDemographics;
