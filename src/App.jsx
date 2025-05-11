import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardSummary from './components/DashboardSummary';
import StatusBoard from './components/StatusBoard';
import NewCandidateForm from './components/NewCandidateForm';
import RequisitionList from './RequisitionList'; // ✅ Ensure this matches your file structure
import RequisitionDashboard from './components/RequisitionDashboard';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [candidates, setCandidates] = useState([]);
  const [requisitions, setRequisitions] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/candidates`)
      .then((res) => setCandidates(res.data))
      .catch((err) => console.error('Failed to fetch candidates:', err));

    axios.get(`${API_BASE_URL}/requisitions`)
      .then((res) => setRequisitions(res.data))
      .catch((err) => console.error('Failed to fetch requisitions:', err));
  }, []);

  return (
    <div className="p-6">
      {/* Navigation */}
      <nav className="mb-6 space-x-4">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-4 py-2 rounded ${activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('status')}
          className={`px-4 py-2 rounded ${activeView === 'status' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Status Board
        </button>
        <button
          onClick={() => setActiveView('new')}
          className={`px-4 py-2 rounded ${activeView === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          New Candidate
        </button>
        <button
          onClick={() => setActiveView('requisitions')}
          className={`px-4 py-2 rounded ${activeView === 'requisitions' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Requisition List
        </button>
      </nav>
<button
  onClick={() => setActiveView('requisitionDashboard')}
  className={`px-4 py-2 rounded ${activeView === 'requisitionDashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
>
  Requisition Dashboard
</button>

      {/* Views */}
      <div>
        {activeView === 'dashboard' && (
          <DashboardSummary candidates={candidates} requisitions={requisitions} />
        )}
        {activeView === 'status' && <StatusBoard />}
        {activeView === 'new' && <NewCandidateForm />}
        {activeView === 'requisitions' && <RequisitionList />}
        {activeView === 'requisitionDashboard' && <RequisitionDashboard />}

      </div>
    </div>
  );
}

export default App;
