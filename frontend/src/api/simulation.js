import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const runSimulation = async (payload, token) => {
  const res = await axios.post(`${API}/simulate`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getSimulationHistory = async (token) => {
  const res = await axios.get(`${API}/simulate/history`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
