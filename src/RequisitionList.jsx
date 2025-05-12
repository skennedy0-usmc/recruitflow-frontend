import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

function RequisitionList({ onEdit }) {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    axios.get(`${API_BASE_URL}/requisitions`)
      .then(res => setRequisitions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this requisition?')) {
      await axios.delete(`${API_BASE_URL}/requisitions/${id}`);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-gray-500">Loading requisitions...</p>;

  return (
    <div className="space-y-4">
      {requisitions.map(req => (
        <div key={req.id} className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-blue-900">{req.title}</h3>
            <p className="text-sm text-gray-500">Status: {req.status}</p>
            <p className="text-sm text-gray-400">Created: {new Date(req.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(req)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(req.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RequisitionList;
