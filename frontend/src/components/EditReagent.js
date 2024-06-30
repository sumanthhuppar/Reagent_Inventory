import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditReagent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reagent, setReagent] = useState({
    name: "",
    quantity: 0,
    quantity_measure: "",
    source: "",
    expiry: "",
  });

  useEffect(() => {
    // Fetch reagent details for editing
    fetch(`http://localhost:5000/reagents/${id}`)
      .then((response) => response.json())
      .then((data) => setReagent(data))
      .catch((error) => console.error("Error fetching reagent:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReagent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update reagent in database
    fetch(`http://localhost:5000/reagents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reagent),
    })
      .then((response) => response.json())
      .then((data) => {
        // Redirect to reagent list after successful update
        navigate("/");
      })
      .catch((error) => console.error("Error updating reagent:", error));
  };
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column", // Stack items vertically
      justifyContent: "center", // Center horizontally
      alignItems: "center", // Center vertically
      maxHeight: "100vh", // Ensure container takes at least full viewport height
    },
    form: {
      width: "300px",
    },
    // Other styles for form, formGroup, label, input, button, etc.
  };

  return (
    <div className="edit-reagent-container" style={styles.container}>
      <h1>Edit Reagent.</h1>
      <form
        className="edit-reagent-form"
        onSubmit={handleSubmit}
        style={styles.form}
      >
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={reagent.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={reagent.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity_measure">Measure:</label>
          <input
            type="text"
            id="quantity_measure"
            name="quantity_measure"
            value={reagent.quantity_measure}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="source">Source:</label>
          <input
            type="text"
            id="source"
            name="source"
            value={reagent.source}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiry">Expiry Date:</label>
          <input
            type="date"
            id="expiry"
            name="expiry"
            value={reagent.expiry}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditReagent;
