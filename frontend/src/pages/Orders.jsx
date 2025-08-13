import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/table.css';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [form, setForm] = useState({ order_id: '', value_rs: '', route_id: '', delivery_time: '09:00' });

    useEffect(() => { fetch(); }, []);
    async function fetch() {
        const [oRes, rRes] = await Promise.all([api.get('/orders'), api.get('/routes')]);
        setOrders(oRes.data);
        setRoutes(rRes.data);
    }

    async function add(e) {
        e.preventDefault();
        const payload = {
            order_id: Number(form.order_id),
            value_rs: Number(form.value_rs),
            route_id: Number(form.route_id),
            delivery_time: form.delivery_time
        };
        await api.post('/orders', payload);
        setForm({ order_id: '', value_rs: '', route_id: '', delivery_time: '09:00' });
        fetch();
    }

    async function remove(id) {
        if (!confirm('Delete order?')) return;
        await api.delete(`/orders/${id}`);
        fetch();
    }

    return (
        <div className="container">
            <h1>Orders</h1>
            <form onSubmit={add} className="inline-form">
                <input placeholder="order id" value={form.order_id} onChange={e => setForm({ ...form, order_id: e.target.value })} required />
                <input placeholder="value (₹)" value={form.value_rs} onChange={e => setForm({ ...form, value_rs: e.target.value })} required />
                <select
                    value={String(form.route_id)}
                    onChange={e => setForm({ ...form, route_id: e.target.value })}
                    required
                >
                    <option value="">Select route</option>
                    {routes.map(r => (
                        <option key={r.route_id} value={String(r.route_id)}>
                            {r.route_id} — {r.distance_km}km
                        </option>
                    ))}
                </select>
                <input type="time" value={form.delivery_time} onChange={e => setForm({ ...form, delivery_time: e.target.value })} />
                <button className="btn-primary" type="submit">Add</button>
            </form>

            <div className="table-wrap">
                <table>
                    <thead><tr><th>Order</th><th>Value</th><th>Route</th><th>Delivery time</th><th>Actions</th></tr></thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o._id}>
                                <td>{o.order_id}</td>
                                <td>₹{o.value_rs}</td>
                                <td>{o.route_id}</td>
                                <td>{o.delivery_time}</td>
                                <td>
                                    <button className="btn-ghost" onClick={() => { const t = prompt('Delivery time', o.delivery_time); t && api.put(`/orders/${o.order_id}`, { ...o, delivery_time: t }).then(fetch); }}>Edit</button>
                                    <button className="btn-danger" onClick={() => remove(o.order_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
