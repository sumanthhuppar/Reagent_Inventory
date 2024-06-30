import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ReagentList() {
  const [reagents, setReagents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/reagents')
      .then(response => response.json())
      .then(data => setReagents(data));
  }, []);

  const handleDelete = id => {
    // Implement your delete logic here, e.g., using Axios or fetch
    fetch(`http://localhost:5000/reagents/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Remove the deleted reagent from the state
        setReagents(reagents.filter(reagent => reagent.id !== id));
      })
      .catch(error => {
        console.error('Error deleting reagent:', error);
      });
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const filteredReagents = reagents.filter(reagent =>
    reagent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Reagent List</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: '10px' }} // Add CSS here
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Quantity Measure</th>
            <th>Source</th>
            <th>Expiry</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredReagents.map(reagent => (
            <tr key={reagent.id}>
              <td>{reagent.name}</td>
              <td>{reagent.quantity}</td>
              <td>{reagent.quantity_measure}</td>
              <td>{reagent.source}</td>
              <td>{reagent.expiry}</td>
              <td>
                <button onClick={() => handleDelete(reagent.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReagentList;
