// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Filler
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement,Filler);

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/simulate/latest').then(res => setData(res.data)).catch(err => console.error(err));
  }, []);

  if (!data) return <p>Loading...</p>;

 const pieData = {
  labels: ['On-time', 'Late'],
  datasets: [
    {
      data: [data.onTimeCount, data.lateCount ?? 0], // ensure lateCount exists
      backgroundColor: ['#4CAF50', '#F44336']
    }
  ]
};


 const barData = data.chartData; // since backend already returns {labels, datasets}


  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ width: '400px', margin: 'auto' }}>
        <h2>Delivery Performance</h2>
        <Pie data={pieData} />
      </div>

      <div style={{ width: '600px', margin: 'auto', marginTop: '50px' }}>
        <h2>Profit by Route</h2>
        <Bar data={barData} />
      </div>
    </div>
  );
}
