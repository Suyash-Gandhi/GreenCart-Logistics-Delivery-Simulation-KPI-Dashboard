// src/pages/Simulation.jsx
import React, { useState } from 'react';
import api from '../services/api';
import '../styles/simulation.css';

export default function Simulation() {
  const [availableDrivers, setAvailableDrivers] = useState(5);
  const [startTime, setStartTime] = useState('09:00');
  const [maxHoursPerDay, setMaxHoursPerDay] = useState(8);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async (e) => {
    e && e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/simulate/run', {
        availableDrivers, startTime, maxHoursPerDay
      });


      setResult(res.data || res);

      // Store latest result in localStorage so Dashboard can read it
      localStorage.setItem('lastSimulation', JSON.stringify(res.data || res));

    } catch (err) {
      alert(err.response?.data?.error || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Simulation</h1>
      <form className="sim-form" onSubmit={run}>
        <div className="form-row">
          <label>Available drivers</label>
          <input type="number" min="1" value={availableDrivers} onChange={e => setAvailableDrivers(+e.target.value)} />
        </div>
        <div className="form-row">
          <label>Start time</label>
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Max hours/day</label>
          <input type="number" min="1" value={maxHoursPerDay} onChange={e => setMaxHoursPerDay(+e.target.value)} />
        </div>
        <div className="form-actions">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </form>

      {result && (
        <div className="result-panel">
          <h2>Results</h2>
          <div className="kpi-grid">
            <div className="kpi-card"><h3>Total Profit</h3><p>₹{result.totalProfit}</p></div>
            <div className="kpi-card"><h3>Efficiency</h3><p>{result.efficiency}%</p></div>
            <div className="kpi-card"><h3>On-time</h3><p>{result.onTimeCount}</p></div>
            <div className="kpi-card"><h3>Late</h3><p>{result.lateCount}</p></div>
          </div>

          <h3>Sample orders</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Order</th><th>Driver</th><th>Route</th><th>TravelMin</th><th>Profit</th><th>Late</th></tr>
              </thead>
              <tbody>
                {result.orders?.slice(0, 30).map(o => (
                  <tr key={o.order_id}>
                    <td>{o.order_id}</td>
                    <td>{o.assigned_driver}</td>
                    <td>{o.route_id}</td>
                    <td>{o.travelMinutes}</td>
                    <td>₹{o.profitForOrder}</td>
                    <td>{o.isLate ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
