import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleConfirmZero = (name, e) => {
    if (window.confirm("You entered zero. Do you want to proceed?")) {
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation checks
    if (reagent.quantity < 0) {
      toast.error("Quantity must be 0 or more.", { theme: "dark" });
      return;
    }
    if (reagent.quantity === 0) {
      handleConfirmZero("quantity", e);
      return;
    }
    if (!/^([a-zA-Z]+-?\d*|\d+[a-zA-Z]+)$/.test(reagent.quantity_measure)) {
      toast.error("Measure must be non-negative or alphanumeric.", {
        theme: "dark",
      });
      return;
    }
    if (reagent.quantity_measure === "0") {
      handleConfirmZero("quantity_measure", e);
      return;
    }
    if (/^\d+$/.test(reagent.source)) {
      toast.error("Source cannot be only numbers.", { theme: "dark" });
      return;
    }

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
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      maxHeight: "100vh",
    },
    form: {
      width: "300px",
    },
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
            min="0"
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
      <ToastContainer />
    </div>
  );
}

export default EditReagent;
