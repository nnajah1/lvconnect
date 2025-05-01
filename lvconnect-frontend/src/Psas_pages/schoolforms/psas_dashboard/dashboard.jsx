import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { HiOutlineUsers } from 'react-icons/hi2';
import "../dashboard.css";  // Make sure this file contains styles for your dashboard

const Dashboard = () => {
  const stats = [
    {
      label: 'Total students',
      value: 589,
      data: [
        { label: 'BA Broadcasting', value: 42 },
        { label: 'BS Accountancy', value: 25 },
        { label: 'BS Accounting IS', value: 18 },
        { label: 'BS Social Work', value: 33 },
        { label: 'BS Information Systems', value: 42 },
        { label: 'Associate in Com. Tech.', value: 12 },
      ],
    },
    {
      label: 'Students responded',
      value: 463,
      data: [
        { label: 'BA Broadcasting', value: 30 },
        { label: 'BS Accountancy', value: 20 },
        { label: 'BS Accounting IS', value: 15 },
        { label: 'BS Social Work', value: 25 },
        { label: 'BS Information Systems', value: 40 },
        { label: 'Associate in Computer Technology', value: 10 },
      ],
    },
    {
      label: 'Students in flooded area',
      value: 216,
      data: [
        { label: 'BA Broadcasting', value: 12 },
        { label: 'BS Accountancy', value: 5 },
        { label: 'BS Accounting IS', value: 7 },
        { label: 'BS Social Work', value: 20 },
        { label: 'BS Information Systems', value: 8 },
        { label: 'Associate in Computer Technology', value: 2 },
      ],
    },
    {
      label: 'Active survey',
      value: 1,
      data: [],
    },
  ];

  const filters = [
    'All Higher Education',
    'BA Broadcasting',
    'BS Accountancy',
    'BS Accounting IS',
    'BS Social Work',
    'BS Information Systems',
    'Associate in Computer Technology.',
  ];

  const [selectedStat, setSelectedStat] = useState(stats[0]);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredData =
    selectedFilter === 'All Higher Education'
      ? selectedStat.data
      : selectedStat.data.filter((item) => item.label === selectedFilter);

  return (
    <div className="dashboard-container">
      <div className="stat-grid">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="stat-card"
            onClick={() => setSelectedStat(item)}
          >
            <div>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
            <HiOutlineUsers className="stat-icon" />
          </div>
        ))}
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h2 className="chart-title">{selectedStat.label}</h2>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="chart-select"
          >
            {filters.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} margin={{ bottom: 50 }}>
            <XAxis
              dataKey="label"
              interval={0}
              angle={windowWidth < 1024 ? -45 : 0}
              textAnchor={windowWidth < 1024 ? 'end' : 'middle'}
              height={windowWidth < 1024 ? 100 : 40}
              tick={{ fontSize: 12, fill: '#4B5563' }}
            />
            <YAxis tick={{ fontSize: 13, fill: '#9CA3AF' }} stroke="#D1D5DB" />
            <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#000" fontSize={14} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
