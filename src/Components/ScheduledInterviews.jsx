import { useState } from 'react';
import EditInterviewModal from './EditInterviewModal';

function ScheduledInterviews({ interviews, onDelete, onUpdate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const handleEdit = (interview) => {
    console.log("Edit clicked for:", interview); // optional: for debugging
    setSelectedInterview(interview);
    setModalOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Scheduled Interviews</h2>

      {interviews.length === 0 ? (
        <p>No interviews scheduled yet.</p>
      ) : (
        <table className="w-full table-auto text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2">Candidate</th>
              <th className="px-4 py-2">Requisition</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Interviewer</th>
              <th className="px-4 py-2">Scheduled At</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((int) => (
              <tr key={int.id} className="border-t">
                <td className="px-4 py-2">{int.candidate_name}</td>
                <td className="px-4 py-2">{int.requisition_title}</td>
                <td className="px-4 py-2">{int.type}</td>
                <td className="px-4 py-2">{int.interviewer}</td>
                <td className="px-4 py-2">
                  {new Date(int.scheduled_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => handleEdit(int)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(int.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔽 Modal Editor */}
      <EditInterviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        interview={selectedInterview}
        onSave={onUpdate}
      />
    </div>
  );
}

export default ScheduledInterviews;
