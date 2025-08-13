import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../api/auth';
import '../styles/auth.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isRegisterMode) {
        await apiRegister(username, password);
        alert('Registered. Now login.');
        setIsRegisterMode(false);
        return;
      }
      const token = await apiLogin(username, password);
      if (token) navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Auth error');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>{isRegisterMode ? 'Register Manager' : 'Manager Login'}</h2>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <div className="auth-actions">
          <button type="submit" className="btn-primary">{isRegisterMode ? 'Register' : 'Login'}</button>
          <button type="button" className="btn-ghost" onClick={() => setIsRegisterMode(s => !s)}>
            {isRegisterMode ? 'Back to Login' : 'Create account'}
          </button>
        </div>
        <p className="note">For the assessment you can create one manager account and then login.</p>
      </form>
    </div>
  );
}
