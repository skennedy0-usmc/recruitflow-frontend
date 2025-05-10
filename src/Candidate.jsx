const Candidate = ({ data }) => {
  return (
    <div>
      <strong>{data.name}</strong><br />
      <span className="text-sm text-gray-600">{data.email}</span>
    </div>
  );
};

export default Candidate;
