import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RequisitionList from './RequisitionList';
import NewRequisitionForm from './NewRequisitionForm';

const API_BASE_URL = 'http://localhost:3000/api'; // Update as needed

function RequisitionDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [editingRequisition, setEditingRequisition] = useState(null);
  const [requisitions, setRequisitions] = useState([]);

  const fetchRequisitions = () => {
    axios.get(`${API_BASE_URL}/requisitions`).then((res) => {
      setRequisitions(res.data);
    });
  };

  useEffect(() => {
    fetchRequisitions();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };

    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Requisition Dashboard</h1>
        <button
          onClick={() => {
            setEditingRequisition(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Requisition
        </button>
      </div>

      <RequisitionList
        onEdit={(req) => {
          setEditingRequisition(req);
          setShowModal(true);
        }}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl animate-fadeIn relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              {editingRequisition ? 'Edit Requisition' : 'New Requisition'}
            </h2>
            <NewRequisitionForm
              initialData={editingRequisition}
              onSuccess={() => {
                setShowModal(false);
                fetchRequisitions();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RequisitionDashboard;
