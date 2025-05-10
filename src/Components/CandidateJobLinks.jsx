import React, { useEffect, useState } from 'react';

export default function CandidateJobLinks({ onViewTimeline }) {
  const [candidates, setCandidates] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [addingLinkFor, setAddingLinkFor] = useState(null);
  const [allRequisitions, setAllRequisitions] = useState([]);
  const [newLinkData, setNewLinkData] = useState({ requisitionId: '', notes: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candRes, linkRes, reqRes] = await Promise.all([
          fetch('http://localhost:3000/candidates').then(res => res.json()),
          fetch('http://localhost:3000/links').then(res => res.json()),
          fetch('http://localhost:3000/requisitions').then(res => res.json()),
        ]);

        const enriched = candRes.map(candidate => {
          const links = linkRes.filter(link => link.candidate_id === candidate.id);
          const linkedReqs = links.map(link => ({
            ...link,
            requisition: reqRes.find(req => req.id === link.requisition_id),
          }));
          return { ...candidate, linkedReqs };
        });

        setAllRequisitions(reqRes);
        setCandidates(enriched);
      } catch (err) {
        console.error("Error fetching candidate data:", err);
      }
    };

    fetchData();
  }, []);

  const startEditing = (candId, linkId) => {
    setCandidates(prev =>
      prev.map(c => c.id === candId
        ? {
            ...c,
            linkedReqs: c.linkedReqs.map(l =>
              l.id === linkId
                ? { ...l, isEditing: true, editNotes: l.notes, editStatus: l.status }
                : l
            ),
          }
        : c
      )
    );
  };

  const cancelEdit = (candId, linkId) => {
    setCandidates(prev =>
      prev.map(c => c.id === candId
        ? {
            ...c,
            linkedReqs: c.linkedReqs.map(l =>
              l.id === linkId ? { ...l, isEditing: false } : l
            ),
          }
        : c
      )
    );
  };

  const updateLinkField = (candId, linkId, field, value) => {
    setCandidates(prev =>
      prev.map(c => c.id === candId
        ? {
            ...c,
            linkedReqs: c.linkedReqs.map(l =>
              l.id === linkId ? { ...l, [field]: value } : l
            ),
          }
        : c
      )
    );
  };

  const saveLinkChanges = async (candId, link) => {
    try {
      await fetch(`http://localhost:3000/links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: link.editNotes,
          status: link.editStatus,
        }),
      });

      const res = await fetch('http://localhost:3000/links');
      const updatedLinks = await res.json();

      setCandidates(prev =>
        prev.map(c => {
          if (c.id !== candId) return c;
          const updatedReqs = updatedLinks.filter(l => l.candidate_id === candId);
          const enrichedLinks = updatedReqs.map(l => ({
            ...l,
            requisition: allRequisitions.find(r => r.id === l.requisition_id),
          }));
          return { ...c, linkedReqs: enrichedLinks };
        })
      );

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Error saving link changes:', err);
    }
  };

  const startAddLink = (candidateId) => {
    setAddingLinkFor(candidateId);
    setNewLinkData({ requisitionId: '', notes: '' });
  };

  const cancelAddLink = () => {
    setAddingLinkFor(null);
  };

  const handleNewLinkChange = (field, value) => {
    setNewLinkData(prev => ({ ...prev, [field]: value }));
  };

  const submitNewLink = async (candidateId) => {
    try {
      await fetch('http://localhost:3000/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: candidateId,
          requisition_id: parseInt(newLinkData.requisitionId),
          notes: newLinkData.notes,
          status: 'Applied'
        }),
      });

      setAddingLinkFor(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      const linkRes = await fetch('http://localhost:3000/links').then(res => res.json());

      setCandidates(prev =>
        prev.map(c => {
          if (c.id !== candidateId) return c;
          const updatedReqs = linkRes.filter(l => l.candidate_id === candidateId);
          const enrichedLinks = updatedReqs.map(l => ({
            ...l,
            requisition: allRequisitions.find(r => r.id === l.requisition_id),
          }));
          return { ...c, linkedReqs: enrichedLinks };
        })
      );
    } catch (err) {
      console.error('Error adding new link:', err);
    }
  };

  const deleteLink = async (candId, linkId) => {
    try {
      await fetch(`http://localhost:3000/links/${linkId}`, {
        method: 'DELETE',
      });

      setCandidates(prev =>
        prev.map(c => {
          if (c.id !== candId) return c;
          const updatedReqs = c.linkedReqs.filter(l => l.id !== linkId);
          return { ...c, linkedReqs: updatedReqs };
        })
      );
    } catch (err) {
      console.error('Error deleting link:', err);
    }
  };

  return (
    <>
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
          ✅ Changes saved!
        </div>
      )}

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="border rounded-2xl p-4 shadow-md bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{candidate.name}</h2>
                <p className="text-sm text-gray-600">{candidate.email}</p>
                {candidate.resume_url && (
                  <a
                    href={candidate.resume_url}
                    className="text-blue-500 text-sm underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Resume
                  </a>
                )}
              </div>
              <button
                onClick={() => startAddLink(candidate.id)}
                className="text-sm text-indigo-600 hover:underline"
              >
                + Add Link
              </button>
            </div>

            {candidate.linkedReqs.length > 0 ? (
              <div className="mt-4 space-y-2">
                {candidate.linkedReqs.map(link => (
                  <div key={link.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        <p className="font-medium">{link.requisition?.title || 'Unknown Role'}</p>

                        {link.isEditing ? (
                          <>
                            <textarea
                              className="w-full text-sm border rounded p-1 mt-1"
                              value={link.editNotes}
                              onChange={e => updateLinkField(candidate.id, link.id, 'editNotes', e.target.value)}
                            />
                            <select
                              className="w-full text-sm border rounded p-1 mt-1"
                              value={link.editStatus}
                              onChange={e => updateLinkField(candidate.id, link.id, 'editStatus', e.target.value)}
                            >
                              <option>Applied</option>
                              <option>Interviewing</option>
                              <option>Offer</option>
                              <option>Hired</option>
                              <option>Rejected</option>
                            </select>
                            <div className="mt-2 space-x-2">
                              <button onClick={() => saveLinkChanges(candidate.id, link)} className="text-sm text-green-600">Save</button>
                              <button onClick={() => cancelEdit(candidate.id, link.id)} className="text-sm text-gray-500">Cancel</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500">{link.notes}</p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-semibold inline-block mt-1 ${
                                {
                                  'Applied': 'bg-blue-100 text-blue-800',
                                  'Interviewing': 'bg-yellow-100 text-yellow-800',
                                  'Offer': 'bg-green-100 text-green-800',
                                  'Hired': 'bg-green-200 text-green-900',
                                  'Rejected': 'bg-red-100 text-red-800',
                                }[link.status] || 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {link.status}
                            </span>
                            <div className="mt-2 space-x-4">
                              <button onClick={() => startEditing(candidate.id, link.id)} className="text-sm text-blue-600 hover:underline">Edit</button>
                              <button onClick={() => onViewTimeline(link.id)} className="text-sm text-blue-600 hover:underline">View Timeline</button>
                              <button onClick={() => deleteLink(candidate.id, link.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-400">No linked requisitions.</p>
            )}

            {addingLinkFor === candidate.id && (
              <div className="mt-4 p-3 border rounded bg-white">
                <h4 className="font-medium mb-2">Link to New Requisition</h4>
                <select
                  className="w-full border rounded p-2 mb-2"
                  value={newLinkData.requisitionId}
                  onChange={e => handleNewLinkChange('requisitionId', e.target.value)}
                >
                  <option value="">Select Requisition</option>
                  {allRequisitions.map(req => (
                    <option key={req.id} value={req.id}>{req.title}</option>
                  ))}
                </select>
                <textarea
                  className="w-full border rounded p-2 mb-2"
                  rows="2"
                  placeholder="Add notes..."
                  value={newLinkData.notes}
                  onChange={e => handleNewLinkChange('notes', e.target.value)}
                />
                <div className="flex space-x-4">
                  <button onClick={() => submitNewLink(candidate.id)} className="text-sm text-green-600">Save</button>
                  <button onClick={cancelAddLink} className="text-sm text-gray-500">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
