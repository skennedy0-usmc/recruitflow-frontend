import React, { useState } from "react";

const AddCandidateForm = ({ onCandidateAdded }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume_url: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setForm({ name: "", email: "", phone: "", resume_url: "" });
      const newCandidate = await response.json();
      onCandidateAdded(newCandidate); // Notify parent to refresh list
    } else {
      alert("Failed to add candidate.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Add New Candidate</h3>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        name="resume_url"
        placeholder="Resume URL"
        value={form.resume_url}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Candidate
      </button>
    </form>
  );
};

export default AddCandidateForm;
