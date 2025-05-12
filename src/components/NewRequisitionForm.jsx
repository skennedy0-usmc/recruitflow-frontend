import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:3000/api';

function NewRequisitionForm({ initialData = {}, onSuccess }) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('Open');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDepartment(initialData.department || '');
      setStatus(initialData.status || 'Open');
    }
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !department.trim()) {
      setError('Both title and department are required.');
      toast.error('Please fill in all required fields.');
      return;
    }

    setError('');
    setLoading(true);

    const payload = { title, department, status };

    try {
      if (initialData.id) {
        await axios.put(`${API_BASE_URL}/requisitions/${initialData.id}`, payload);
        toast.success('Requisition updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/requisitions`, payload);
        toast.success('Requisition created successfully!');
      }
      onSuccess();
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to save requisition. Please try again.');
      toast.error('Error saving requisition.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle(initialData.title || '');
    setDepartment(initialData.department || '');
    setStatus(initialData.status || 'Open');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className="w-full border border-gray-300 p-2 rounded bg-white disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Department</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          disabled={loading}
          className="w-full border border-gray-300 p-2 rounded bg-white disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
          className="w-full border border-gray-300 p-2 rounded bg-white disabled:bg-gray-100"
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="Paused">Paused</option>
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            initialData.id ? 'Update Requisition' : 'Create Requisition'
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-60"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default NewRequisitionForm;
