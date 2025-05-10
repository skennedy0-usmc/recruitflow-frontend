import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './DashboardSummary';
import StatusBoard from './StatusBoard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-700">🚀 RecruitFlow</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600">📊 Dashboard</Link>
            <Link to="/status" className="text-sm text-gray-600 hover:text-indigo-600">🗂️ Status Board</Link>
          </nav>
        </header>
        <main className="p-6">
          <Routes>
            <Route path="/" element={<DashboardSummary />} />
            <Route path="/status" element={<StatusBoard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
