import { useState, useEffect } from 'react';
import { setAuthToken } from '../services/api';

export default function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  const login = (t) => setToken(t);
  const logout = () => { setAuthToken(null); setToken(null); };

  return { token, login, logout };
}
