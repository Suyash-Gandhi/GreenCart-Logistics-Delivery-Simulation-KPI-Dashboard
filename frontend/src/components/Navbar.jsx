import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">GreenCart Simulator</Link>
        {token && (
          <>
            <Link to="/simulate">Simulation</Link>
            <Link to="/drivers">Drivers</Link>
            <Link to="/routes">Routes</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/history">History</Link>
          </>
        )}
      </div>
      <div className="nav-right">
        {token ? (
          <button className="btn-ghost" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
