import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import DashboardSummary from './components/DashboardSummary';
import StatusBoard from './components/StatusBoard';
import NewCandidateForm from './components/NewCandidateForm';
import CandidateDetail from './components/CandidateDetail';
import RequisitionList from './RequisitionList';
import RequisitionDashboard from './components/RequisitionDashboard';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [candidates, setCandidates] = useState([]);
  const [requisitions, setRequisitions] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/candidates`).then((res) => setCandidates(res.data));
    axios.get(`${API_BASE_URL}/requisitions`).then((res) => setRequisitions(res.data));
  }, []);

  const navBtn = (view) =>
    `px-4 py-2 rounded-xl text-sm font-medium ${
      activeView === view
        ? 'bg-blue-600 text-white shadow'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    } transition`;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <header className="bg-white shadow py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700">🚀 RecruitFlow</h1>
          <nav className="flex flex-wrap gap-2">
            <button onClick={() => setActiveView('dashboard')} className={navBtn('dashboard')}>
              Dashboard
            </button>
            <button onClick={() => setActiveView('status')} className={navBtn('status')}>
              Status Board
            </button>
            <button onClick={() => setActiveView('new')} className={navBtn('new')}>
              New Candidate
            </button>
            <button onClick={() => setActiveView('reqlist')} className={navBtn('reqlist')}>
              Requisition List
            </button>
            <button onClick={() => setActiveView('reqdash')} className={navBtn('reqdash')}>
              Requisition Dashboard
            </button>
          </nav>
        </header>

        <main className="p-6 max-w-6xl mx-auto">
          {activeView === 'dashboard' && (
            <DashboardSummary candidates={candidates} requisitions={requisitions} />
          )}
          {activeView === 'status' && <StatusBoard />}
          {activeView === 'new' && <NewCandidateForm />}
          {activeView === 'reqlist' && <RequisitionList />}
          {activeView === 'reqdash' && <RequisitionDashboard />}
        </main>
      </div>
    </Router>
  );
}

export default App;
