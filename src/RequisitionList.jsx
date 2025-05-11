import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './components/ui/card';

function RequisitionList() {
  const [requisitions, setRequisitions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/requisitions')
      .then((res) => res.json())
      .then((data) => setRequisitions(data))
      .catch((err) => console.error('Error fetching requisitions:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📄 Requisitions</h2>
      <ul>
        {requisitions.map((req) => (
          <li key={req.id}>
            <strong>{req.title}</strong> – {req.department} ({req.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RequisitionList;
