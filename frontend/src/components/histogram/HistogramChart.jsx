import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const HistogramChart = ({ data, title }) => {
  const [activeChannels, setActiveChannels] = useState({
    red: true,
    green: false,
    blue: false,
    luminance: false
  });

  const toggleChannel = (channel) => {
    setActiveChannels(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  if (!data) return (
    <div className="d-flex justify-content-center align-items-center h-100 text-bright small opacity-75">
      No histogram data available
    </div>
  );

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Red',
        data: activeChannels.red ? data.red : [],
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: true,
        tension: 0.3,
        hidden: !activeChannels.red,
      },
      {
        label: 'Green',
        data: activeChannels.green ? data.green : [],
        borderColor: 'rgba(34, 197, 94, 0.8)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: true,
        tension: 0.3,
        hidden: !activeChannels.green,
      },
      {
        label: 'Blue',
        data: activeChannels.blue ? data.blue : [],
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: true,
        tension: 0.3,
        hidden: !activeChannels.blue,
      },
      {
        label: 'Luminance',
        data: activeChannels.luminance ? data.luminance : [],
        borderColor: 'rgba(156, 163, 175, 0.8)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.3,
        hidden: !activeChannels.luminance,
      }
    ].filter(ds => !ds.hidden)
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#ccc',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#6b7280', maxTicksLimit: 10 }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#6b7280', display: false }
      }
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-white small fw-bold">{title}</span>
        <div className="d-flex gap-2">
          <button 
            className={`btn btn-sm ${activeChannels.red ? 'btn-danger' : 'btn-outline-danger'}`}
            style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}
            onClick={() => toggleChannel('red')}
          >R</button>
          <button 
            className={`btn btn-sm ${activeChannels.green ? 'btn-success' : 'btn-outline-success'}`}
            style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}
            onClick={() => toggleChannel('green')}
          >G</button>
          <button 
            className={`btn btn-sm ${activeChannels.blue ? 'btn-primary' : 'btn-outline-primary'}`}
            style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}
            onClick={() => toggleChannel('blue')}
          >B</button>
          <button 
            className={`btn btn-sm ${activeChannels.luminance ? 'btn-light text-dark' : 'btn-outline-light'}`}
            style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}
            onClick={() => toggleChannel('luminance')}
          >L</button>
        </div>
      </div>
      <div className="flex-grow-1 position-relative w-100" style={{ minHeight: '150px' }}>
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default HistogramChart;
