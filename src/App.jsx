import React, { useState } from 'react';
import DashboardSummary from './components/DashboardSummary';
import StatusBoard from './components/StatusBoard';
import NewCandidateForm from './components/NewCandidateForm';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="p-6">
      {/* Navigation Buttons */}
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
      </nav>

      {/* Dynamic Content */}
      <div>
        {activeView === 'dashboard' && <DashboardSummary />}
        {activeView === 'status' && <StatusBoard />}
        {activeView === 'new' && <NewCandidateForm />}
      </div>
    </div>
  );
}

export default App;
