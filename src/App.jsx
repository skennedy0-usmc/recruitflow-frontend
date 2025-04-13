import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  // 🔒 State
  const [candidates, setCandidates] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [links, setLinks] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedReqId, setSelectedReqId] = useState('all');

  // 💡 Form states
  const [candidateForm, setCandidateForm] = useState({ name: '', email: '', phone: '', resume_url: '' });
  const [requisitionForm, setRequisitionForm] = useState({
    title: '', department: '', location: '', status: '',
    date_opened: '', date_closed: '', hiring_manager: '', recruiter: '', notes: ''
  });
  const [linkForm, setLinkForm] = useState({ candidate_id: '', requisition_id: '', status: '', notes: '' });

  useEffect(() => {
    fetchCandidates();
    fetchRequisitions();
    fetchLinks();
  }, []);

  const fetchCandidates = async () => {
    const res = await axios.get('http://localhost:3000/candidates');
    setCandidates(res.data);
  };
  const fetchRequisitions = async () => {
    const res = await axios.get('http://localhost:3000/requisitions');
    setRequisitions(res.data);
  };
  const fetchLinks = async () => {
    const res = await axios.get('http://localhost:3000/links');
    setLinks(res.data);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\+?[0-9\-()\s]{7,20}$/.test(phone);

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(candidateForm.email)) return setError('Invalid email address.');
    if (candidateForm.phone && !isValidPhone(candidateForm.phone)) return setError('Invalid phone number.');
    await axios.post('http://localhost:3000/candidates', candidateForm);
    setCandidateForm({ name: '', email: '', phone: '', resume_url: '' });
    setMessage('Candidate added');
    fetchCandidates();
  };

  const handleRequisitionSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/requisitions', requisitionForm);
    setRequisitionForm({
      title: '', department: '', location: '', status: '',
      date_opened: '', date_closed: '', hiring_manager: '', recruiter: '', notes: ''
    });
    setMessage('Requisition added');
    fetchRequisitions();
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/links', linkForm);
    setLinkForm({ candidate_id: '', requisition_id: '', status: '', notes: '' });
    setMessage('Link created');
    fetchLinks();
  };

  const deleteCandidate = async (id) => {
    await axios.delete(`http://localhost:3000/candidates/${id}`);
    fetchCandidates();
  };
  const deleteRequisition = async (id) => {
    await axios.delete(`http://localhost:3000/requisitions/${id}`);
    fetchRequisitions();
  };
  const deleteLink = async (id) => {
    await axios.delete(`http://localhost:3000/links/${id}`);
    fetchLinks();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans space-y-10">
      <h1 className="text-3xl font-bold text-center text-indigo-700">RecruitFlow</h1>

      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* 👤 Candidate Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>
        <form onSubmit={handleCandidateSubmit} className="grid md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={candidateForm.name} onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })} className="p-2 border rounded" required />
          <input name="email" placeholder="Email" value={candidateForm.email} onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })} className="p-2 border rounded" required />
          <input name="phone" placeholder="Phone" value={candidateForm.phone} onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })} className="p-2 border rounded" />
          <input name="resume_url" placeholder="Resume URL" value={candidateForm.resume_url} onChange={(e) => setCandidateForm({ ...candidateForm, resume_url: e.target.value })} className="p-2 border rounded" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-2">Add</button>
        </form>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {candidates.map(c => (
            <div key={c.id} className="border p-3 rounded">
              <h4 className="font-semibold">{c.name}</h4>
              <p>{c.email}</p>
              <p>{c.phone}</p>
              <a href={c.resume_url} className="text-blue-500 underline">Resume</a>
              <button onClick={() => deleteCandidate(c.id)} className="text-red-600 text-sm mt-2">Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* 📄 Requisition Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Add Requisition</h2>
        <form onSubmit={handleRequisitionSubmit} className="grid md:grid-cols-2 gap-4">
          {Object.entries(requisitionForm).map(([key, val]) => (
            key !== 'notes' ? (
              <input key={key} name={key} placeholder={key.replace('_', ' ')} value={val} onChange={(e) => setRequisitionForm({ ...requisitionForm, [key]: e.target.value })} className="p-2 border rounded" />
            ) : null
          ))}
          <textarea name="notes" placeholder="Notes" value={requisitionForm.notes} onChange={(e) => setRequisitionForm({ ...requisitionForm, notes: e.target.value })} className="p-2 border rounded md:col-span-2" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 col-span-2">Add</button>
        </form>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {requisitions.map(r => (
            <div key={r.id} className="border p-3 rounded">
              <h4 className="font-semibold">{r.title}</h4>
              <p>Status: {r.status}</p>
              <p>Manager: {r.hiring_manager}</p>
              <button onClick={() => deleteRequisition(r.id)} className="text-red-600 text-sm mt-2">Delete</button>
              <div className="mt-2 pl-2 border-t pt-2">
                {links.filter(l => l.requisition_id === r.id).map(link => {
                  const candidate = candidates.find(c => c.id === link.candidate_id);
                  return candidate ? (
                    <div key={link.id} className="text-sm">
                      • {candidate.name} ({link.status})
                      <button onClick={() => deleteLink(link.id)} className="ml-2 text-xs text-red-500">Remove</button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔗 Link Form */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Link Candidate</h2>
        <form onSubmit={handleLinkSubmit} className="grid md:grid-cols-2 gap-4">
          <select name="candidate_id" value={linkForm.candidate_id} onChange={(e) => setLinkForm({ ...linkForm, candidate_id: e.target.value })} className="p-2 border rounded" required>
            <option value="">Select Candidate</option>
            {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="requisition_id" value={linkForm.requisition_id} onChange={(e) => setLinkForm({ ...linkForm, requisition_id: e.target.value })} className="p-2 border rounded" required>
            <option value="">Select Requisition</option>
            {requisitions.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
          <input name="status" placeholder="Status" value={linkForm.status} onChange={(e) => setLinkForm({ ...linkForm, status: e.target.value })} className="p-2 border rounded" />
          <textarea name="notes" placeholder="Notes" value={linkForm.notes} onChange={(e) => setLinkForm({ ...linkForm, notes: e.target.value })} className="p-2 border rounded md:col-span-2" />
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 col-span-2">Link</button>
        </form>
      </section>

      {/* 🎯 Filtered Linked Candidates */}
      <section>
        <h2 className="text-xl font-semibold mt-10 mb-2">Linked Candidates</h2>

        <div className="mb-4">
          <label className="font-semibold mr-2">Filter by Requisition:</label>
          <select
            value={selectedReqId}
            onChange={(e) => setSelectedReqId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            {requisitions.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
        </div>

        <ul className="space-y-2">
          {links
            .filter(link => selectedReqId === 'all' || link.requisition_id === selectedReqId)
            .map(link => {
              const candidate = candidates.find((c) => c.id === link.candidate_id);
              const requisition = requisitions.find((r) => r.id === link.requisition_id);
              if (!candidate || !requisition) return null;
              return (
                <li key={link.id} className="border p-3 rounded shadow-sm">
                  <span className="font-semibold">{candidate.name}</span> → <span className="text-indigo-700">{requisition.title}</span>
                  {link.status && <span className="ml-2 text-sm text-gray-600">(Status: {link.status})</span>}
                  {link.notes && <p className="text-sm text-gray-500 mt-1">{link.notes}</p>}
                  <button onClick={() => deleteLink(link.id)} className="ml-4 text-xs text-red-500">Remove</button>
                </li>
              );
            })}
        </ul>
      </section>

      {/* 📊 Summary */}
      <section>
        <h2 className="text-xl font-semibold mb-2 mt-12">Summary</h2>
        <div className="text-sm text-gray-700">
          <p>Total Candidates: {candidates.length}</p>
          <p>Total Requisitions: {requisitions.length}</p>
          <p>Total Links: {links.length}</p>
        </div>
      </section>
    </div>
  );
}

export default App;