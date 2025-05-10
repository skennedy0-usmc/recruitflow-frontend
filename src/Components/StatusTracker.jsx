import React from 'react';

const StatusTracker = ({ status, onChange }) => {
  const statuses = ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

  return (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusTracker;
