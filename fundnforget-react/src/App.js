import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './landing';
import InvestorPage from './investor';
import FundManagerPage from './fundmanager';
import Contact from './contact';
import Working from './working';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/investor" element={<InvestorPage />} />
        <Route path="/fund-manager" element={<FundManagerPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-it-works" element={<Working />} />
      </Routes>
    </Router>
  );
}

export default App;
