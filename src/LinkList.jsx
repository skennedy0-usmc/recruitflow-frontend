import React, { useEffect, useState } from 'react';

function LinkList() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/links')
      .then(res => res.json())
      .then(data => setLinks(data))
      .catch(err => console.error('Error fetching links:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🔗 Candidate-Requisition Links</h2>
      <ul>
        {links.map(link => (
          <li key={link.id}>
            Candidate ID: <strong>{link.candidate_id}</strong>, Requisition ID: <strong>{link.requisition_id}</strong>, Status: <em>{link.status}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LinkList;
