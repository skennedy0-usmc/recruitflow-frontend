import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api';

// Helper to extract initials from name
function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/candidates`)
      .then((res) => setCandidates(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const query = filter.toLowerCase();
    return (
      c.name?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.phone?.toLowerCase().includes(query) ||
      c.address?.toLowerCase().includes(query) ||
      c.status?.toLowerCase().includes(query) ||
      c.note?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-800">Candidate List</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name, email, phone, status..."
          className="w-full border px-4 py-2 rounded shadow-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-4">
          {filteredCandidates.map((c) => (
            <li
              key={c.id}
              className="bg-white border border-gray-200 shadow-sm rounded-lg p-5 hover:shadow-md transition flex items-start space-x-4"
            >
              <Link to={`/candidates/${c.id}`} className="flex items-start space-x-4 w-full">
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
                  {getInitials(c.name)}
                </div>

                {/* Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-blue-800">{c.name}</h2>
                    <span className="text-sm text-gray-500">{c.status || 'Unspecified'}</span>
                  </div>
                  <div className="text-gray-700 space-y-1">
                    <div><span className="font-medium">Email:</span> {c.email}</div>
                    <div><span className="font-medium">Phone:</span> {c.phone || 'N/A'}</div>
                    <div><span className="font-medium">Address:</span> {c.address || 'N/A'}</div>
                    {c.note && (
                      <div className="mt-2 italic text-gray-500">
                        “{c.note}”
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CandidateList;
