import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

function CandidateDetail() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/candidates/${id}`)
      .then((res) => setCandidate(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading candidate...</p>;
  if (!candidate) return <p className="p-6">Candidate not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">{candidate.name}</h1>
      <div className="space-y-2 text-gray-700">
        <div><span className="font-medium">Email:</span> {candidate.email}</div>
        <div><span className="font-medium">Phone:</span> {candidate.phone || 'N/A'}</div>
        <div><span className="font-medium">Address:</span> {candidate.address || 'N/A'}</div>
        <div><span className="font-medium">Status:</span> {candidate.status || 'Unspecified'}</div>
        {candidate.note && (
          <div className="italic text-gray-600 mt-2">“{candidate.note}”</div>
        )}
      </div>
    </div>
  );
}

export default CandidateDetail;
