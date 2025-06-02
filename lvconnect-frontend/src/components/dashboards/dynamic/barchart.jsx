import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
  Tooltip
} from 'recharts';
import { Users } from 'lucide-react';
import { colors } from '@/utils/statsDashboard';

function BarChartByProgram({ programs = [] }) {
  // Prepare chart data
  const filteredChartData = programs.map((program) => ({
    program_name: program.program_name,
    student_count: program.student_count,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Population by Program</h2>

      {filteredChartData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No data available for the selected filters</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis
                dataKey="program_name"
                angle={-10}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 12 }}
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={{ stroke: "#d1d5db" }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip />
              <Bar dataKey="student_count" radius={[6, 6, 0, 0]} className="drop-shadow-sm">
                <LabelList dataKey="student_count" position="top" fontSize={12} fill="#374151" fontWeight="500" />
                {filteredChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200/50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            Total Programs: <span className="font-semibold text-gray-800">{filteredChartData.length}</span>
          </span>
          <span>
            Total Students:{" "}
            <span className="font-semibold text-gray-800">
              {filteredChartData.reduce((sum, item) => sum + item.student_count, 0).toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
export default BarChartByProgram;
