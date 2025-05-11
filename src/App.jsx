import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewCandidateForm from './components/NewCandidateForm';

function App() {
  return (
    <Router>
      <div className="p-6">
        <Routes>
          <Route path="/new" element={<NewCandidateForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
