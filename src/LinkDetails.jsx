import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LinkDetails = ({ candidate, requisitions }) => {
  const [links, setLinks] = useState([]);
  const [statusHistories, setStatusHistories] = useState({});

  useEffect(() => {
    if (candidate) {
      fetchLinks(candidate.id);
    }
  }, [candidate]);

  const fetchLinks = async (candidateId) => {
    try {
      const res = await axios.get('http://localhost:3000/links');
      const filtered = res.data.filter(link => link.candidate_id === candidateId);
      setLinks(filtered);

      // Fetch status history for each link
      for (const link of filtered) {
        const statusRes = await axios.get(`http://localhost:3000/status-changes/${link.id}`);
        setStatusHistories(prev => ({
          ...prev,
          [link.id]: statusRes.data
        }));
      }
    } catch (err) {
      console.error("Failed to fetch links or status:", err);
    }
  };

  const getRequisitionTitle = (id) => {
    const req = requisitions.find(r => r.id === id);
    return req ? req.title : `Requisition #${id}`;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">👤 Candidate Profile</h3>
      <p><strong>Name:</strong> {candidate.name}</p>
      <p><strong>Email:</strong> {candidate.email}</p>
      <p><strong>Phone:</strong> {candidate.phone || 'N/A'}</p>
      {candidate.resume_url && (
        <p><strong>Resume:</strong> <a href={candidate.resume_url} target="_blank" rel="noreferrer">View</a></p>
      )}

      <div className="mt-4">
        <h4 className="font-semibold mb-1">📌 Linked Requisitions</h4>
        {links.length === 0 ? (
          <p>No linked requisitions.</p>
        ) : (
          links.map(link => (
            <div key={link.id} className="mb-4 border-t pt-2">
              <p><strong>Requisition:</strong> {getRequisitionTitle(link.requisition_id)}</p>
              <p><strong>Status:</strong> {link.status}</p>
              {link.notes && <p><strong>Notes:</strong> {link.notes}</p>}
              <div className="mt-1 text-sm text-gray-700">
                <p><strong>Status History:</strong></p>
                <ul className="list-disc ml-5">
                  {(statusHistories[link.id] || []).map((entry, idx) => (
                    <li key={idx}>
                      {entry.timestamp?.split('T')[0]}: {entry.from_status} ➜ {entry.to_status} {entry.note && `(${entry.note})`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LinkDetails;
