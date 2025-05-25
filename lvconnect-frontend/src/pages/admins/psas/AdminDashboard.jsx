
    import React, { useState, useEffect } from 'react';
import { HiOutlineUsers } from 'react-icons/hi';
// import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';

const PsasDashboard = () => {

  const [stats, setStats] = useState([]);
  const [selectedStat, setSelectedStat] = useState({ label: '', value: 0 });
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filteredData, setFilteredData] = useState([]);
  const [demographicsData, setDemographicsData] = useState([]); // To store the raw demographics data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Filters for the chart data (you might dynamically generate these based on demographics)
  const filters = ['All', 'Province', 'City/Municipality', 'Barangay', 'Street'];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const token = localStorage.getItem('jwt_token'); // Get your JWT token
        if (!token) {
          setError('Authentication token not found.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/analytics-dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Unauthorized: You do not have permission to access this resource.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update basic stats
        setStats([
          { label: 'Current Enrolled Students', value: data.current_enrolled_students },
          { label: 'Visible Surveys', value: data.visible_surveys },
          { label: 'Mandatory Surveys', value: data.mandatory_surveys },
          { label: 'Total Answers Submitted', value: data.total_answers_submitted },
        ]);

        // Set initial selected stat
        if (data.current_enrolled_students !== undefined) {
          setSelectedStat({ label: 'Current Enrolled Students', value: data.current_enrolled_students });
        }

        // Store raw demographics data
        setDemographicsData(data.student_demographics);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    if (selectedStat.label === 'Current Enrolled Students' && demographicsData.length > 0) {
      let chartData = [];

      if (selectedFilter === 'All') {
        // Sum students by program for 'All' filter
        const programCounts = {};
        demographicsData.forEach(program => {
          program.addresses.forEach(address => {
            programCounts[program.program_name] = (programCounts[program.program_name] || 0) + address.student_count;
          });
        });
        chartData = Object.entries(programCounts).map(([label, value]) => ({ label, value }));

      } else if (selectedFilter === 'Province') {
        const provinceCounts = {};
        demographicsData.forEach(program => {
          program.addresses.forEach(address => {
            if (address.province) {
              provinceCounts[address.province] = (provinceCounts[address.province] || 0) + address.student_count;
            }
          });
        });
        chartData = Object.entries(provinceCounts).map(([label, value]) => ({ label, value }));

      } else if (selectedFilter === 'City/Municipality') {
        const cityCounts = {};
        demographicsData.forEach(program => {
          program.addresses.forEach(address => {
            if (address.city_municipality) {
              cityCounts[address.city_municipality] = (cityCounts[address.city_municipality] || 0) + address.student_count;
            }
          });
        });
        chartData = Object.entries(cityCounts).map(([label, value]) => ({ label, value }));

      } else if (selectedFilter === 'Barangay') {
        const barangayCounts = {};
        demographicsData.forEach(program => {
          program.addresses.forEach(address => {
            if (address.barangay) {
              barangayCounts[address.barangay] = (barangayCounts[address.barangay] || 0) + address.student_count;
            }
          });
        });
        chartData = Object.entries(barangayCounts).map(([label, value]) => ({ label, value }));

      } else if (selectedFilter === 'Street') {
        const streetCounts = {};
        demographicsData.forEach(program => {
          program.addresses.forEach(address => {
            if (address.street) {
              streetCounts[address.street] = (streetCounts[address.street] || 0) + address.student_count;
            }
          });
        });
        chartData = Object.entries(streetCounts).map(([label, value]) => ({ label, value }));
      }

      setFilteredData(chartData);
    } else {
        // If the selected stat isn't demographics or no demographics data, clear filtered data
        setFilteredData([]);
    }
  }, [selectedFilter, selectedStat, demographicsData]);


  if (loading) {
    return <div className="dashboard-container">Loading analytics...</div>;
  }

  if (error) {
    return <div className="dashboard-container" style={{ color: 'red' }}>Error: {error}</div>;
  }

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
          <h2 className="chart-title">
            {selectedStat.label === 'Current Enrolled Students' ? 'Student Demographics' : selectedStat.label}
          </h2>
          {selectedStat.label === 'Current Enrolled Students' && (
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="chart-select"
            >
              {filters.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          )}
        </div>

        {selectedStat.label === 'Current Enrolled Students' ? (
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
        ) : (
            // You'll need to define how to display other stats if they aren't bar charts
            <div className="text-center py-10 text-gray-600">
                Data visualization for {selectedStat.label} not implemented yet.
            </div>
        )}
      </div>
    </div>
  );
}

  

  export default PsasDashboard;