import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function ReagentList() {
  const [reagents, setReagents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/reagents')
      .then(response => response.json())
      .then(data => setReagents(data));
  }, []);

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this reagent?')) {
      fetch(`http://localhost:5000/reagents/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setReagents(reagents.filter(reagent => reagent.id !== id));
        })
        .catch(error => {
          console.error('Error deleting reagent:', error);
        });
    }
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
          style={{ marginBottom: '10px' }}
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
            <th>Actions</th>
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
                <Link to={`/edit-reagent/${reagent.id}`} style={{ marginRight: '10px' }}>
                  <FontAwesomeIcon icon={faEdit} title="Edit" />
                </Link>
                <button onClick={() => handleDelete(reagent.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} title="Delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReagentList;
