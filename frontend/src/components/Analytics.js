import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('month');
  const [chartsInitialized, setChartsInitialized] = useState(false);

  // Analytics data
  const analyticsData = [
    { date: 'Dec 1, 2024', total: 42, waitTime: '22 min', completed: 38, noShows: 4, satisfaction: '92%' },
    { date: 'Dec 2, 2024', total: 45, waitTime: '25 min', completed: 40, noShows: 5, satisfaction: '89%' },
    { date: 'Dec 3, 2024', total: 38, waitTime: '18 min', completed: 35, noShows: 3, satisfaction: '95%' },
    { date: 'Dec 4, 2024', total: 50, waitTime: '28 min', completed: 45, noShows: 5, satisfaction: '87%' },
    { date: 'Dec 5, 2024', total: 44, waitTime: '20 min', completed: 42, noShows: 2, satisfaction: '93%' },
  ];

  useEffect(() => {
    // Initialize charts only once
    if (!chartsInitialized && typeof window !== 'undefined') {
      initializeCharts();
      setChartsInitialized(true);
    }
  }, [chartsInitialized]);

  const initializeCharts = () => {
    // Check if Chart library is available
    if (typeof window.Chart === 'undefined') {
      console.log('Chart.js not loaded yet');
      return;
    }

    // Patient Trends Chart
    try {
      const patientCtx = document.getElementById('patientTrendsChart');
      if (patientCtx) {
        new window.Chart(patientCtx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
              label: 'Patients',
              data: [42, 45, 38, 50, 48, 30],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true
              }
            }
          }
        });
      }
    } catch (e) {
      console.log('Chart.js not fully loaded');
    }

    // Department Distribution Chart
    try {
      const deptCtx = document.getElementById('departmentChart');
      if (deptCtx) {
        new window.Chart(deptCtx, {
          type: 'doughnut',
          data: {
            labels: ['General OPD', 'Pediatrics', 'Maternity', 'Emergency', 'Surgery'],
            datasets: [{
              data: [35, 20, 15, 20, 10],
              backgroundColor: [
                '#2563eb',
                '#10b981',
                '#8b5cf6',
                '#f59e0b',
                '#ef4444'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    } catch (e) {
      console.log('Chart.js not fully loaded');
    }

    // Wait Time Chart
    try {
      const waitCtx = document.getElementById('waitTimeChart');
      if (waitCtx) {
        new window.Chart(waitCtx, {
          type: 'bar',
          data: {
            labels: ['Gen OPD', 'Pediatrics', 'Maternity', 'Emergency'],
            datasets: [{
              label: 'Avg Wait Time (min)',
              data: [25, 18, 30, 5],
              backgroundColor: '#f59e0b'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'x',
            plugins: {
              legend: {
                display: true
              }
            }
          }
        });
      }
    } catch (e) {
      console.log('Chart.js not fully loaded');
    }

    // Doctor Performance Chart
    try {
      const docCtx = document.getElementById('doctorPerformanceChart');
      if (docCtx) {
        new window.Chart(docCtx, {
          type: 'bar',
          data: {
            labels: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Mensah'],
            datasets: [{
              label: 'Patients Seen',
              data: [8, 6, 4, 5],
              backgroundColor: '#10b981'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'x',
            plugins: {
              legend: {
                display: true
              }
            }
          }
        });
      }
    } catch (e) {
      console.log('Chart.js not fully loaded');
    }
  };

  return (
    <div id="analytics-section" className="content-section">
      <div className="section-header">
        <h2>Analytics & Reports</h2>
        <div className="date-filter">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="form-control"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <input type="date" className="form-control" defaultValue="2024-12-01" />
          <span>to</span>
          <input type="date" className="form-control" defaultValue="2024-12-31" />
          <button className="btn btn-primary">Apply</button>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-container">
          <h3>Patient Trends</h3>
          <div className="chart-placeholder">
            <canvas id="patientTrendsChart"></canvas>
          </div>
        </div>

        <div className="chart-container">
          <h3>Department Distribution</h3>
          <div className="chart-placeholder">
            <canvas id="departmentChart"></canvas>
          </div>
        </div>

        <div className="chart-container">
          <h3>Wait Time Analysis</h3>
          <div className="chart-placeholder">
            <canvas id="waitTimeChart"></canvas>
          </div>
        </div>

        <div className="chart-container">
          <h3>Doctor Performance</h3>
          <div className="chart-placeholder">
            <canvas id="doctorPerformanceChart"></canvas>
          </div>
        </div>
      </div>

      <div className="analytics-table">
        <h3>Detailed Report</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Patients</th>
              <th>Avg Wait Time</th>
              <th>Completed</th>
              <th>No Shows</th>
              <th>Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.total}</td>
                <td>{row.waitTime}</td>
                <td>{row.completed}</td>
                <td>{row.noShows}</td>
                <td>{row.satisfaction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="analytics-summary">
        <h3>Summary Statistics</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Average Patients/Day</h4>
            <p className="summary-value">43.8</p>
          </div>
          <div className="summary-card">
            <h4>Average Wait Time</h4>
            <p className="summary-value">22.6 min</p>
          </div>
          <div className="summary-card">
            <h4>Completion Rate</h4>
            <p className="summary-value">92.1%</p>
          </div>
          <div className="summary-card">
            <h4>Avg Satisfaction</h4>
            <p className="summary-value">91.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;