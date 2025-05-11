import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DashboardSummary from './components/DashboardSummary';
import StatusBoard from './components/StatusBoard';
import NewCandidateForm from './components/NewCandidateForm';
import CandidateDetail from './components/CandidateDetail';

function App() {
  return (
    <Router>
      <div className="p-6">
        <nav className="mb-4 space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
          <Link to="/status" className="text-blue-600 hover:underline">Status Board</Link>
          <Link to="/new" className="text-blue-600 hover:underline">New Candidate</Link>
        </nav>

        <Routes>
          <Route path="/" element={<DashboardSummary />} />
          <Route path="/status" element={<StatusBoard />} />
          <Route path="/new" element={<NewCandidateForm />} />
          <Route path="/candidates/:id" element={<CandidateDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
