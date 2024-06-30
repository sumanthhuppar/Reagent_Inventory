import React, { useState, useEffect } from 'react';

function StockMaintenance() {
  const [reagents, setReagents] = useState([]);
  const [selectedReagent, setSelectedReagent] = useState(null);
  const [quantityRemoved, setQuantityRemoved] = useState({
    expiry: '',
    experiment: ''
  });
  const [quantityAdded, setQuantityAdded] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch reagents from your API
    fetch('http://localhost:5000/reagents')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setReagents(data))
      .catch(error => setErrorMessage('Failed to fetch reagents: ' + error.message));
  }, []);

  const handleReagentSelect = (e) => {
    const reagentId = parseInt(e.target.value);
    const reagent = reagents.find(r => r.id === reagentId);
    setSelectedReagent(reagent);
    setQuantityRemoved({ expiry: '', experiment: '' });
    setQuantityAdded('');
  };

  const handleQuantityChange = (e, type) => {
    const value = e.target.value;
    if (type === 'added') {
      setQuantityAdded(value);
    } else {
      setQuantityRemoved(prev => ({ ...prev, [type]: value }));
    }
  };

  const calculateTotalQuantity = () => {
    if (!selectedReagent) return 0;
    const removedExpiry = parseFloat(quantityRemoved.expiry) || 0;
    const removedExperiment = parseFloat(quantityRemoved.experiment) || 0;
    const addedQuantity = parseFloat(quantityAdded) || 0;
    return (
      parseFloat(selectedReagent.quantity) -
      removedExpiry -
      removedExperiment +
      addedQuantity
    ).toFixed(2);
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
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update the reagent in the local state
        setReagents(reagents.map(r => r.id === data.id ? data : r));
        setSelectedReagent(data);
        // Reset input fields
        setQuantityRemoved({ expiry: '', experiment: '' });
        setQuantityAdded('');
        setSuccessMessage('Stock updated successfully.');
        setErrorMessage('');
      })
      .catch(error => {
        setErrorMessage('Error updating reagent: ' + error.message);
        setSuccessMessage('');
      });
  };

  // Filter reagents based on search term
  const filteredReagents = reagents.filter(reagent =>
    reagent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="stock-maintenance">
      <h1>Stock Maintenance</h1>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="form-container">
        
        <div className="form-group">
          <label htmlFor="search-reagent">Search Reagent:</label>
          <input
            type="text"
            id="search-reagent"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="reagent-select">Select Reagent:</label>
          
          <select id="reagent-select" onChange={handleReagentSelect} required>
            <option value="">--Select a reagent--</option>
            {filteredReagents.map(reagent => (
              <option key={reagent.id} value={reagent.id}>{reagent.name}</option>
            ))}
          </select>
        </div>
        {selectedReagent && (
          <>
            <div className="form-group">
              <label>Available Quantity: {selectedReagent.quantity} {selectedReagent.quantity_measure}</label>
            </div>
            <div className="form-group">
              <label htmlFor="removed-expiry">Quantity Removed (Expiry):</label>
              <input
                type="number"
                id="removed-expiry"
                value={quantityRemoved.expiry}
                step="0.01"
                onChange={(e) => handleQuantityChange(e, 'expiry')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="removed-experiment">Quantity Removed (Experiment):</label>
              <input
                type="number"
                id="removed-experiment"
                value={quantityRemoved.experiment}
                step="0.01"
                onChange={(e) => handleQuantityChange(e, 'experiment')}
              />
            </div>
            <div className="form-group">
              <label htmlFor="added-new">Quantity Added (New Stock):</label>
              <input
                type="number"
                id="added-new"
                value={quantityAdded}
                step="0.01"
                onChange={(e) => handleQuantityChange(e, 'added')}
              />
            </div>
            <div className="form-group">
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
