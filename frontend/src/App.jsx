import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Drivers from './pages/Drivers';
import RoutesPage from './pages/Routes';
import Orders from './pages/Orders';
import SimulationHistory from './pages/SimulationHistory';

/* App shell: navbar + route skeleton */
export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/simulate" element={<ProtectedRoute><Simulation/></ProtectedRoute>} />
          <Route path="/drivers" element={<ProtectedRoute><Drivers/></ProtectedRoute>} />
          <Route path="/routes" element={<ProtectedRoute><RoutesPage/></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><SimulationHistory/></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
