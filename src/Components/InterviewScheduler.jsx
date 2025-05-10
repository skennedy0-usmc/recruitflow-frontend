import { useState, useEffect } from 'react';
import axios from 'axios';

function InterviewScheduler({ onSchedule }) {

  const [links, setLinks] = useState([]);
  const [candidateReq, setCandidateReq] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [datetime, setDatetime] = useState('');
  const [message, setMessage] = useState('');

  // Fetch candidate-requisition links
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/links');
        setLinks(response.data);
      } catch (error) {
        console.error('❌ Failed to fetch candidate-requisition links', error);
      }
    };

    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      link_id: candidateReq,
      type: interviewType,
      interviewer: interviewer,
      scheduled_at: datetime,
    };

    try {
      await axios.post('http://localhost:3000/interviews', payload);
onSchedule(); // ⬅️ call the parent to reload the table


      setMessage('✅ Interview scheduled successfully!');
      setCandidateReq('');
      setInterviewType('');
      setInterviewer('');
      setDatetime('');
    } catch (error) {
      console.error('❌ Error scheduling interview:', error);
      setMessage('❌ Failed to schedule interview.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Schedule Interview</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Candidate-Requisition Link</label>
          <select
            value={candidateReq}
            onChange={(e) => setCandidateReq(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select...</option>
            {links.map((link) => (
             <option key={link.id} value={link.id}>
             {`${link.candidate_name} — ${link.requisition_title}`}
           </option>
            
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Interview Type</label>
          <select
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select...</option>
            <option value="phone">Phone Screen</option>
            <option value="onsite">Onsite Interview</option>
            <option value="virtual">Virtual Interview</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Interviewer</label>
          <select
            value={interviewer}
            onChange={(e) => setInterviewer(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select...</option>
            <option value="james.talent@example.com">James Talent</option>
            <option value="sarah.recruiter@example.com">Sarah Recruiter</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date & Time</label>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Schedule Interview
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
}

export default InterviewScheduler;
