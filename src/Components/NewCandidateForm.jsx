import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api';

function NewCandidateForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/candidates`, {
        name,
        email,
        phone,
        address,
        status,
        note,
      });

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setStatus('');
      setNote('');

      onSuccess?.(response.data);
      navigate('/candidates'); // Redirect after success
    } catch (error) {
      console.error('Error creating candidate:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded max-w-md mx-auto">
      <h2 className="text-xl font-semibold">New Candidate</h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full border px-3 py-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Phone"
        className="w-full border px-3 py-2 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="text"
        placeholder="Address"
        className="w-full border px-3 py-2 rounded"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        type="text"
        placeholder="Status"
        className="w-full border px-3 py-2 rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />

      <textarea
        placeholder="Note"
        className="w-full border px-3 py-2 rounded"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Creating...' : 'Create Candidate'}
      </button>
    </form>
  );
}

export default NewCandidateForm;
