import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import NewRequisitionForm from './NewRequisitionForm';

const API_BASE_URL = 'http://localhost:3000/api';

function RequisitionDashboard() {
  const [requisitions, setRequisitions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_opened');
  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/requisitions`)
      .then((res) => {
        setRequisitions(res.data);
        setFiltered(res.data);
      })
      .catch((err) => console.error('Error fetching requisitions:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    const result = requisitions
      .filter((r) =>
        [r.title, r.department, r.hiring_manager, r.recruiter].some(
          (field) => field?.toLowerCase().includes(q)
        )
      )
      .sort((a, b) => {
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return new Date(b.date_opened) - new Date(a.date_opened);
      });
    setFiltered(result);
  }, [query, sortBy, requisitions]);

  if (loading) return <p>Loading requisitions...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Requisitions</h2>

      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + New Requisition
      </button>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title, dept, manager, recruiter"
          className="border px-3 py-2 rounded w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="date_opened">Sort by Date Opened</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p>No matching requisitions found.</p>
        ) : (
          filtered.map((req) => (
            <Card
              key={req.id}
              className="p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
            >
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-blue-800">{req.title}</p>
                    <p className="text-sm text-gray-500">{req.department} — {req.status}</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    Opened {new Date(req.date_opened).toLocaleDateString()}
                  </span>
                </div>

                {expandedId === req.id && (
                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    <p><strong>Location:</strong> {req.location}</p>
                    <p><strong>Hiring Manager:</strong> {req.hiring_manager}</p>
                    <p><strong>Recruiter:</strong> {req.recruiter}</p>
                    <p><strong>Closed:</strong> {req.date_closed ? new Date(req.date_closed).toLocaleDateString() : '—'}</p>
                    {req.notes && <p><strong>Notes:</strong> {req.notes}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal for New Requisition */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>
            <NewRequisitionForm
              onSuccess={() => {
                setShowModal(false);
                axios.get(`${API_BASE_URL}/requisitions`)
                  .then((res) => {
                    setRequisitions(res.data);
                    setFiltered(res.data);
                  });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RequisitionDashboard;
