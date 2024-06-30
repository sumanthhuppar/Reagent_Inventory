import React, { useState, useEffect } from "react";

function ExpiringSoon() {
  const [reagents, setReagents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/reagents/expiring-soon")
      .then((response) => response.json())
      .then((data) => setReagents(data));
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to calculate days remaining until expiry
  const daysToExpire = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const differenceInTime = expiryDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(differenceInTime / (1000 * 3600 * 24)));
  };

  // Function to get text color based on expiry date
  const getTextColor = (dateString) => {
    const daysRemaining = daysToExpire(dateString);
    if (daysRemaining === 0) {
      return "red";
    } else if (daysRemaining <= 30) {
      return "orange";
    } else {
      return "black";
    }
  };

  return (
    <div className="expiring-soon">
      <h1>Reagents Expiring Soon</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Quantity Measure</th>
            <th>Source</th>
            <th>Expiry Date</th>
            <th>Days to Expire</th>
          </tr>
        </thead>
        <tbody>
          {reagents.map((reagent, index) => (
            <tr
              key={reagent.id}
              style={{
                color: getTextColor(reagent.expiry),
                backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
                height: "50px", // Adjust the row height as needed
              }}
            >
              <td>{reagent.name}</td>
              <td>{reagent.quantity}</td>
              <td>{reagent.quantity_measure}</td>
              <td>{reagent.source}</td>
              <td>{formatDate(reagent.expiry)}</td>
              <td>{daysToExpire(reagent.expiry)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .expiring-soon {
          background-color: white;
          color: black;
          padding: 20px;
        }

        .expiring-soon table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 5px;
          overflow: hidden;
        }

        .expiring-soon th, .expiring-soon td {
          border: 2px solid #ddd;
          padding: 8px;
        }

        .expiring-soon th {
          background-color: #f2f2f2;
          color: black;
        }

        .expiring-soon tr:nth-child(even) {
          background-color: #fff;
        }

        .expiring-soon tr:nth-child(odd) {
          background-color: #f9f9f9;
        }

        table {
          border-radius: 10px;
          overflow: hidden;
        }

        th, td {
          border-bottom: 2px solid #ddd;
          height: 30px; /* Adjust the row height as needed */
        }
      `}</style>
    </div>
  );
}

export default ExpiringSoon;
