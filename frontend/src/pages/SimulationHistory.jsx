import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/table.css';

export default function SimulationHistory(){
  const [history, setHistory] = useState([]);
  useEffect(()=>{ fetch(); }, []);
  async function fetch(){
    try {
      const res = await api.get('/simulate/history');
      setHistory(res.data);
    } catch (err) { console.error(err); }
  }

  return (
    <div className="container">
      <h1>Simulation History</h1>
      <div className="table-wrap">
        <table>
          <thead><tr><th>When</th><th>Drivers</th><th>Start</th><th>MaxHours</th><th>TotalProfit</th><th>Efficiency</th></tr></thead>
          <tbody>
            {history.map(h => (
              <tr key={h._id}>
                <td>{new Date(h.timestamp).toLocaleString()}</td>
                <td>{h.inputs.availableDrivers}</td>
                <td>{h.inputs.startTime}</td>
                <td>{h.inputs.maxHoursPerDay}</td>
                <td>₹{h.kpis.totalProfit}</td>
                <td>{h.kpis.efficiency}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
