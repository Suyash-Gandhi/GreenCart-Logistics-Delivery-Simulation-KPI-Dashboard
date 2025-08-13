import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/table.css';

export default function Routes(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ route_id:'', distance_km:'', traffic_level:'Low', base_time_min:'' });

  useEffect(()=>{ fetch(); }, []);
  async function fetch(){ const res = await api.get('/routes'); setItems(res.data); }

  async function add(e){
    e.preventDefault();
    const payload = { route_id: Number(form.route_id), distance_km: Number(form.distance_km), traffic_level: form.traffic_level, base_time_min: Number(form.base_time_min) };
    await api.post('/routes', payload);
    setForm({ route_id:'', distance_km:'', traffic_level:'Low', base_time_min:'' });
    fetch();
  }

  async function remove(id){
    if (!confirm('Delete route?')) return;
    await api.delete(`/routes/${id}`);
    fetch();
  }

  return (
    <div className="container">
      <h1>Routes</h1>
      <form onSubmit={add} className="inline-form">
        <input placeholder="route id" value={form.route_id} onChange={e=>setForm({...form, route_id:e.target.value})} required />
        <input placeholder="distance km" value={form.distance_km} onChange={e=>setForm({...form, distance_km:e.target.value})} required />
        <select value={form.traffic_level} onChange={e=>setForm({...form, traffic_level:e.target.value})}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <input placeholder="base time min" value={form.base_time_min} onChange={e=>setForm({...form, base_time_min:e.target.value})} required />
        <button className="btn-primary" type="submit">Add</button>
      </form>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Route ID</th><th>Distance</th><th>Traffic</th><th>Base time</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(r => (
              <tr key={r._id}>
                <td>{r.route_id}</td>
                <td>{r.distance_km} km</td>
                <td>{r.traffic_level}</td>
                <td>{r.base_time_min} min</td>
                <td>
                  <button className="btn-ghost" onClick={()=>{ const newT = prompt('Traffic (Low/Medium/High)', r.traffic_level); if (newT) api.put(`/routes/${r.route_id}`, {...r, traffic_level:newT}).then(fetch); }}>Edit</button>
                  <button className="btn-danger" onClick={()=>remove(r.route_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
