// components/UpdateReagent.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UpdateReagent() {
  const { id } = useParams();
  const [reagent, setReagent] = useState({
    name: '',
    quantity: '',
    quantity_measure: '',
    source: '',
    expiry: '',
  });

  useEffect(() => {
    // Fetch the reagent data based on the ID from your API
    fetch(`http://localhost:5000/reagents/${id}`)
      .then(response => response.json())
      .then(data => setReagent(data));
  }, [id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setReagent({ ...reagent, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Implement your update logic here, e.g., using Axios or fetch
    fetch(`http://localhost:5000/reagents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reagent),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Updated successfully:', data);
        // Optionally, you can redirect or perform other actions after update
      })
      .catch(error => {
        console.error('Error updating reagent:', error);
      });
  };

  return (
    <div>
      <h2>Update Reagent</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={reagent.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Quantity:
          <input
            type="text"
            name="quantity"
            value={reagent.quantity}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Quantity Measure:
          <input
            type="text"
            name="quantity_measure"
            value={reagent.quantity_measure}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Source:
          <input
            type="text"
            name="source"
            value={reagent.source}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Expiry:
          <input
            type="text"
            name="expiry"
            value={reagent.expiry}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Update Reagent</button>
      </form>
    </div>
  );
}

export default UpdateReagent;
