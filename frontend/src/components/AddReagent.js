import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// components/AddReagent.js

function AddReagent() {
  const [reagent, setReagent] = useState({
    name: "",
    quantity: 0,
    quantity_measure: "",
    source: "",
    expiry: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setReagent({ ...reagent, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/reagents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reagent),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh", // Adjusted height
      padding: "15px", // Reduced padding
      boxSizing: "border-box",
      maxWidth: "600px",
      margin: "0 auto",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    title: {
      textAlign: "center",
      marginBottom: "15px", // Reduced margin
    },
    formGroup: {
      marginBottom: "10px", // Reduced margin
    },
    label: {
      display: "block",
      marginBottom: "5px", // Reduced margin
      marginLeft: "2px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "8px",
      boxSizing: "border-box",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      width: "100%",
      padding: "10px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#007BFF",
      color: "white",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Reagent</h1>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div style={styles.formGroup}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            step="0.01"
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <input
            type="text"
            name="quantity_measure"
            placeholder="Quantity Measure"
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <input
            type="text"
            name="source"
            placeholder="Source"
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="expiry" style={styles.label}>
            Expiry Date
          </label>
          <input
            type="date"
            id="expiry"
            name="expiry"
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Add Reagent
        </button>
      </form>
    </div>
  );
}

export default AddReagent;
