const BASE_URL = 'http://localhost:3000/api';

export const getCandidates = async () => {
  const res = await fetch(`${BASE_URL}/candidates`);
  return res.json();
};

