// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ReagentList from './components/ReagentList';
import AddReagent from './components/AddReagent';
import ExpiringSoon from './components/ExpiringSoon';
import StockMaintenance from './components/StockMaintenance';

import EditReagent from './components/EditReagent';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<ReagentList />} />
            <Route path="/add" element={<AddReagent />} />
            <Route path="/expiring" element={<ExpiringSoon />} />
            <Route path="/stock" element={<StockMaintenance />} />
            <Route path="/edit-reagent/:id" element={<EditReagent />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;