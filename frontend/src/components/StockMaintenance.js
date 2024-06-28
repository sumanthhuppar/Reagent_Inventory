// components/StockMaintenance.js
import React, { useState, useEffect } from 'react';

function StockMaintenance() {
  const [reagents, setReagents] = useState([]);
  const [selectedReagent, setSelectedReagent] = useState(null);
  const [quantityRemoved, setQuantityRemoved] = useState({
    expiry: 0,
    experiment: 0
  });
  const [quantityAdded, setQuantityAdded] = useState(0);

  useEffect(() => {
    // Fetch reagents from your API
    fetch('http://localhost:5000/reagents')
      .then(response => response.json())
      .then(data => setReagents(data));
  }, []);

  const handleReagentSelect = (e) => {
    const reagent = reagents.find(r => r.id === parseInt(e.target.value));
    setSelectedReagent(reagent);
    setQuantityRemoved({ expiry: 0, experiment: 0 });
    setQuantityAdded(0);
  };

  const handleQuantityChange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    if (type === 'added') {
      setQuantityAdded(value);
    } else {
      setQuantityRemoved(prev => ({ ...prev, [type]: value }));
    }
  };

  const calculateTotalQuantity = () => {
    if (!selectedReagent) return 0;
    return (
      selectedReagent.quantity -
      quantityRemoved.expiry -
      quantityRemoved.experiment +
      quantityAdded
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReagent) return;

    const updatedQuantity = calculateTotalQuantity();
    
    // Update the reagent quantity in your backend
    fetch(`http://localhost:5000/reagents/${selectedReagent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...selectedReagent, quantity: updatedQuantity }),
    })
      .then(response => response.json())
      .then(data => {
        // Update the reagent in the local state
        setReagents(reagents.map(r => r.id === data.id ? data : r));
        setSelectedReagent(data);
        // Reset input fields
        setQuantityRemoved({ expiry: 0, experiment: 0 });
        setQuantityAdded(0);
      })
      .catch(error => console.error('Error updating reagent:', error));
  };

  return (
    <div className="stock-maintenance">
      <h1>Stock Maintenance</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reagent-select">Select Reagent:</label>
          <select id="reagent-select" onChange={handleReagentSelect} required>
            <option value="">--Select a reagent--</option>
            {reagents.map(reagent => (
              <option key={reagent.id} value={reagent.id}>{reagent.name}</option>
            ))}
          </select>
        </div>
        {selectedReagent && (
          <>
            <div>
              <label>Available Quantity: {selectedReagent.quantity}</label>
            </div>
            <div>
              <label htmlFor="removed-expiry">Quantity Removed (Expiry):</label>
              <input
                type="number"
                id="removed-expiry"
                value={quantityRemoved.expiry}
                onChange={(e) => handleQuantityChange(e, 'expiry')}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="removed-experiment">Quantity Removed (Experiment):</label>
              <input
                type="number"
                id="removed-experiment"
                value={quantityRemoved.experiment}
                onChange={(e) => handleQuantityChange(e, 'experiment')}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="added-new">Quantity Added (New Stock):</label>
              <input
                type="number"
                id="added-new"
                value={quantityAdded}
                onChange={(e) => handleQuantityChange(e, 'added')}
                min="0"
              />
            </div>
            <div>
              <strong>Total Quantity: {calculateTotalQuantity()}</strong>
            </div>
            <button type="submit">Update Stock</button>
          </>
        )}
      </form>
    </div>
  );
}

export default StockMaintenance;