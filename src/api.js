// Make sure this matches backend route prefix

const BASE_URL = 'https://recruitflow-api-vg04.onrender.com/api';

export const getCandidates = async () => {
  const res = await fetch(`${BASE_URL}/candidates`);
  return res.json();
};

