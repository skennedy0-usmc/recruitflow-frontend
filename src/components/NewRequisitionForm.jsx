import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

function NewRequisitionForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    department: '',
    location: '',
    status: 'Open',
    date_opened: '',
    date_closed: '',
    hiring_manager: '',
    recruiter: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post(`${API_BASE_URL}/requisitions`, form);
      setForm({
        title: '',
        department: '',
        location: '',
        status: 'Open',
        date_opened: '',
        date_closed: '',
        hiring_manager: '',
        recruiter: '',
        notes: ''
      });
      setMessage('✅ Requisition created!');
      onSuccess?.();
    } catch (err) {
      console.error('Error creating requisition:', err);
      setMessage('❌ Failed to create requisition.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold">New Requisition</h2>

      {['title', 'department', 'location', 'hiring_manager', 'recruiter'].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          value={form[field]}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required={field === 'title'}
        />
      ))}

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="Open">Open</option>
        <option value="On Hold">On Hold</option>
        <option value="Closed">Closed</option>
        <option value="Filled">Filled</option>
      </select>

      <input
        type="date"
        name="date_opened"
        value={form.date_opened}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
        required
      />
      <input
        type="date"
        name="date_closed"
        value={form.date_closed}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Creating...' : 'Create Requisition'}
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}

export default NewRequisitionForm;
