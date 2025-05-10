import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Candidate from './Candidate';
import LinkDetails from './LinkDetails';
import LinkList from './LinkList';
import DashboardSummary from './Components/DashboardSummary';
import StatusTracker from './Components/StatusTracker';
import StatusBoard from './Components/StatusBoard';

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [requisitions, setRequisitions] = useState([]);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [linkingMode, setLinkingMode] = useState(false);
  const [notes, setNotes] = useState({});
  const [statusByRequisition, setStatusByRequisition] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    fetchCandidates();
    fetchRequisitions();
  }, []);

  const fetchCandidates = async () => {
    const res = await axios.get('http://localhost:3000/candidates');
    setCandidates(res.data);
  };

  const fetchRequisitions = async () => {
    const res = await axios.get('http://localhost:3000/requisitions');
    setRequisitions(res.data);
  };

  const handleCandidateClick = (candidate) => {
    if (linkingMode && selectedRequisition) {
      axios.post('http://localhost:3000/links', {
        candidate_id: candidate.id,
        requisition_id: selectedRequisition.id,
        status: 'Applied',
        notes: '',
      });
    } else {
      setSelectedCandidate(candidate);
    }
  };

  const handleRequisitionClick = (requisition) => {
    if (linkingMode && selectedCandidate) {
      axios.post('http://localhost:3000/links', {
        candidate_id: selectedCandidate.id,
        requisition_id: requisition.id,
        status: 'Applied',
        notes: '',
      });
    } else {
      setSelectedRequisition(requisition);
    }
  };

  const handleNoteChange = (id, newNote) => {
    setNotes({ ...notes, [id]: newNote });
  };

  const handleStatusChange = (requisitionId, newStatus) => {
    setStatusByRequisition({ ...statusByRequisition, [requisitionId]: newStatus });
  };

  return (
    <div className="flex flex-col h-screen p-4 space-y-4 bg-gray-100">
      <header className="flex items-center justify-between p-4 bg-white shadow rounded-md mb-4">
  <div className="flex items-center space-x-2 text-blue-700 font-bold text-xl">
    <span>🚀</span>
    <span>RecruitFlow</span>
  </div>

  <nav className="flex space-x-2">
    <button
      onClick={() => setView('dashboard')}
      className={`px-4 py-2 rounded-md transition font-medium ${
        view === 'dashboard'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      }`}
    >
      📊 Dashboard
    </button>
    <button
      onClick={() => setView('board')}
      className={`px-4 py-2 rounded-md transition font-medium ${
        view === 'board'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
      }`}
    >
      🗂 Status Board
    </button>
  </nav>
</header>

      {view === 'dashboard' ? (
        <>
  <DashboardSummary candidates={candidates} requisitions={requisitions} />

  <div className="flex space-x-4 flex-1 overflow-hidden">
    {/* Candidates */}
    <div className="w-1/3 overflow-y-auto bg-white p-5 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">👤 Candidates</h2>
      <input
        type="text"
        placeholder="Search candidates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {candidates
        .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((c) => (
          <div
            key={c.id}
            onClick={() => handleCandidateClick(c)}
            className="cursor-pointer p-3 mb-2 border border-gray-200 rounded hover:bg-blue-50 transition"
          >
            <Candidate data={c} />
          </div>
        ))}
    </div>

    {/* Requisitions */}
    <div className="w-1/3 overflow-y-auto bg-white p-5 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold text-green-700 mb-4">📋 Requisitions</h2>
      {requisitions.map((r) => (
        <div
          key={r.id}
          onClick={() => handleRequisitionClick(r)}
          className="cursor-pointer p-3 mb-3 border border-gray-200 rounded hover:bg-green-50 transition"
        >
          <LinkList requisition={r} />
          <textarea
            placeholder="Add notes..."
            value={notes[r.id] || ''}
            onChange={(e) => handleNoteChange(r.id, e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          />
          <StatusTracker
            status={statusByRequisition[r.id] || 'New'}
            onChange={(status) => handleStatusChange(r.id, status)}
          />
        </div>
      ))}
    </div>

    {/* Details */}
    <div className="w-1/3 overflow-y-auto bg-white p-5 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold text-purple-700 mb-4">📄 Details</h2>
      {selectedCandidate ? (
        <LinkDetails candidate={selectedCandidate} requisitions={requisitions} />
      ) : (
        <p className="text-gray-500">Select a candidate to see details.</p>
      )}
    </div>
  </div>
</>
      ) : (
        <StatusBoard />
      )}
    </div>
  );
};

export default App;
