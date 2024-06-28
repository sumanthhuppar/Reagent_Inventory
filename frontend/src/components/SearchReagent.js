// components/SearchReagent.js
import React, { useState } from 'react';
import axios from 'axios';

function SearchReagent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/search', { query });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching reagents:', error);
      // You might want to set an error state and display it to the user
    }
  };

  return (
    <div className="search-reagent">
      <h1>Search Reagent</h1>
      <form onSubmit={handleSearch}>
        <label htmlFor="search-input">Search:</label>
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
      {results.length > 0 && (
        <div>
          <h2>Results</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Quantity_Measure</th>
                <th>Source</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((reagent) => (
                <tr key={reagent.id}>
                  <td>{reagent.id}</td>
                  <td>{reagent.name}</td>
                  <td>{reagent.quantity}</td>
                  <td>{reagent.quantity_measure}</td>
                  <td>{reagent.source}</td>
                  <td>{reagent.expiry_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SearchReagent;