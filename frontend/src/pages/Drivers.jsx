import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/table.css';

export default function Drivers(){
  const [drivers, setDrivers] = useState([]);
  const [name, setName] = useState('');

  useEffect(()=>{ fetch(); }, []);

  async function fetch(){
    try {
      const res = await api.get('/drivers');
      setDrivers(res.data);
    } catch (err) { console.error(err); alert('Failed to load drivers'); }
  }

  async function add(e){
    e.preventDefault();
    try {
      await api.post('/drivers', { name, shift_hours: 0, past_week_hours: []});
      setName(''); fetch();
    } catch (err) { alert(err.response?.data?.error || 'Add failed'); }
  }

  async function remove(id){
    if (!confirm('Delete driver?')) return;
    await api.delete(`/drivers/${id}`);
    fetch();
  }

  return (
    <div className="container">
      <h1>Drivers</h1>
      <form onSubmit={add} className="inline-form">
        <input placeholder="driver name" value={name} onChange={e=>setName(e.target.value)} required />
        <button className="btn-primary" type="submit">Add</button>
      </form>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Shift Hours</th><th>Actions</th></tr></thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.shift_hours}</td>
                <td>
                  <button className="btn-ghost" onClick={()=>{ const nm=prompt('New name', d.name); nm && api.put(`/drivers/${d._id}`, { name: nm }).then(fetch); }}>Edit</button>
                  <button className="btn-danger" onClick={()=>remove(d._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
