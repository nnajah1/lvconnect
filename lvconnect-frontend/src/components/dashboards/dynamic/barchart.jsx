import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from 'recharts';

function BarChartByProgram({ programs }) {
  // Prepare chart data
  const chartData = programs.map((program) => ({
    program_name: program.program_name,
    student_count: program.addresses.reduce(
      (sum, addr) => sum + addr.student_count,
      0
    ),
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Population by Program</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, bottom: 40 }}>
          <XAxis
            dataKey="program_name"
            angle={-30}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 12 }}
            height={60}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="student_count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="student_count" position="top" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartByProgram;
