// components/ExpiringSoon.js
import React, { useState, useEffect } from 'react';

function ExpiringSoon() {
  const [reagents, setReagents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/reagents/expiring-soon')
      .then(response => response.json())
      .then(data => setReagents(data));
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to determine if a date is within 30 days
  const isWithin30Days = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const differenceInTime = expiryDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 30;
  };

  return (
    <div className="expiring-soon">
      <h1>Reagents Expiring Soon</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Quantity_Measure</th>
            <th>Source</th>
            <th>Expiry</th>
          </tr>
        </thead>
        <tbody>
          {reagents.map(reagent => (
            <tr key={reagent.id} className={isWithin30Days(reagent.expiry) ? 'urgent' : ''}>
              <td>{reagent.name}</td>
              <td>{reagent.quantity}</td>
              <td>{reagent.quantity_measure}</td>
              <td>{reagent.source}</td>
              <td>{formatDate(reagent.expiry)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpiringSoon;