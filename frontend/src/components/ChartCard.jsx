import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Chart from 'chart.js/auto';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    api.get('/simulation/latest')
       .then(res => setKpis(res.data))
       .catch(err => console.error(err));
  }, []);

  if (!kpis) return <p>No data yet — run a simulation first.</p>;

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="kpi-grid">
        <div className="kpi-card"><h3>Total Profit</h3><p>{kpis.totalProfit}</p></div>
        <div className="kpi-card"><h3>Efficiency</h3><p>{kpis.efficiency}</p></div>
        <div className="kpi-card"><h3>On-time</h3><p>{kpis.onTime}</p></div>
        <div className="kpi-card"><h3>Fuel Cost</h3><p>{kpis.fuelCost}</p></div>
      </div>
      {/* Add a chart here */}
    </div>
  );
}
