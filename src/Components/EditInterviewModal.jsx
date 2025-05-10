import { useState, useEffect } from "react";

function EditInterviewModal({ open, onClose, interview, onSave }) {
  const [form, setForm] = useState({
    type: "",
    interviewer: "",
    scheduled_at: "",
  });

  // Load interview data into form when modal opens
  useEffect(() => {
    if (interview) {
      setForm({
        type: interview.type || "",
        interviewer: interview.interviewer || "",
        scheduled_at: interview.scheduled_at?.slice(0, 16) || "",
      });
    }
  }, [interview]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.type || !form.interviewer || !form.scheduled_at) {
      alert("❗ Please complete all fields.");
      return;
    }

    onSave(interview.id, form);
    onClose();
  };

  // Don't render the modal unless it's open
  if (!open || !interview) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative"
        style={{
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          backgroundColor: "#fff",
        }}
      >
        <h3 className="text-xl font-bold mb-4">Edit Interview</h3>

        <div className="space-y-4">
          {/* Interview Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select interview type...</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Virtual Interview">Virtual Interview</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="Final Interview">Final Interview</option>
            </select>
          </div>

          {/* Interviewer */}
          <div>
            <label className="block text-sm font-medium mb-1">Interviewer</label>
            <select
              name="interviewer"
              value={form.interviewer}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select interviewer...</option>
              <option value="jordan.blake@example.com">Jordan Blake</option>
              <option value="jane.doe@example.com">Jane Doe</option>
              <option value="sarah.recruiter@example.com">Sarah Recruiter</option>
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="scheduled_at"
              value={form.scheduled_at}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditInterviewModal;
