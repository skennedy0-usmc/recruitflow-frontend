import React from 'react';

const DashboardSummary = ({ candidates, requisitions }) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow">
      <div className="text-center">
        <p className="text-gray-500 text-sm">Total Candidates</p>
        <p className="text-xl font-bold">{candidates.length}</p>
      </div>
      <div className="text-center">
        <p className="text-gray-500 text-sm">Total Requisitions</p>
        <p className="text-xl font-bold">{requisitions.length}</p>
      </div>
    </div>
  );
};

export default DashboardSummary;
