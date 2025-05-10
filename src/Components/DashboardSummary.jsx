import React from 'react';
import { Users, ClipboardList } from 'lucide-react';

const DashboardSummary = ({ candidates, requisitions }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      {/* Candidates Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
        <div className="bg-purple-100 p-3 rounded-full">
          <Users className="text-purple-600 w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Candidates</p>
          <p className="text-2xl font-bold text-gray-800">{candidates.length}</p>
        </div>
      </div>

      {/* Requisitions Summary */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
        <div className="bg-orange-100 p-3 rounded-full">
          <ClipboardList className="text-orange-600 w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Requisitions</p>
          <p className="text-2xl font-bold text-gray-800">{requisitions.length}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
