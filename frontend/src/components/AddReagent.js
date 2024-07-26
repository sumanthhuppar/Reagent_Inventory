import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

function AddReagent() {
  const [reagent, setReagent] = useState({
    name: "",
    packingtype:"",
    quantity: "",
    quantity_measure: "",
    source: "",
    expiry: "",
    setAlert:"",
    setQuantity:"",
    last_updated: moment().format("YYYY-MM-DD"), // Initialize last_updated with current date
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setReagent({ ...reagent, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { quantity, quantity_measure, source, expiry,setQuantity } = reagent;
    const currentDate = new Date().toISOString().split("T")[0];

    if (quantity < 0 || isNaN(quantity)) {
      toast.error("Quantity must be a number 0 or higher.", { theme: "dark" });
      return false;
    }

    if (!/^[a-zA-Z0-9\s]*$/.test(quantity_measure)) {
      toast.error(
        "The measure must include letters, and may include numbers along with letters, but numbers alone are not allowed.",
        {
          theme: "dark",
        }
      );
      return false;
    }

    if (!/^[0-9\s]*$/.test(setQuantity)) {
      toast.error(
        "Quantity Alert should always be in Number",
        {
          theme: "dark",
        }
      );
      return false;
    }

    if (/^\d+$/.test(source)) {
      toast.error("Source cannot be only numbers.", { theme: "dark" });
      return false;
    }

    if (expiry < currentDate) {
      toast.error("Expiry date must be in the future.", { theme: "dark" });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newReagent = {
      ...reagent,
      last_updated: moment().format("YYYY-MM-DD"), // Update last_updated before submission
    };

    fetch("http://localhost:5000/reagents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReagent),
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
      minHeight: "80vh",
      padding: "15px",
      boxSizing: "border-box",
      maxWidth: "600px",
      margin: "0 auto",
    },
    title: {
      textAlign: "center",
      marginBottom: "15px",
      color: "#32CD32",
    },
    formGroup: {
      marginBottom: "10px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
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
    form_container_add: {
      width: "350px",
      minWidth: "350px",
      maxWidth: "350px",
      backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent white background
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 0 15px rgba(0, 100, 0, 0.3)", // Darker green-tinted box shadow
      border: "1px solid rgba(0, 255, 0, 0.4)", // Green tinted border
      backdropFilter: "blur(10px)", // Blur effect (experimental)
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Reagent.</h1>
      <form onSubmit={handleSubmit} style={styles.form_container_add}>
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
            type="text"
            name="packingtype"
            placeholder="packing type"
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
            placeholder="Unit size / volume"
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
        <div style={styles.formGroup}>
          <label htmlFor="Set Alert" style={styles.label}>
            Set Alert <p style={{display:"inline",fontWeight:"lighter",fontSize:"13px"}}>in days</p>
          </label>
          <input
            type="number"
            id="setAlert"
            name="setAlert"
            placeholder="in days"
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="Set Alert Quantity" style={styles.label}>
            Set Alert <p style={{display:"inline",fontWeight:"lighter",fontSize:"13px"}}>in quantities</p>
          </label>
          <input
            type="number"
            id="setQuantity"
            name="setQuantity"
            placeholder="in Quantities"
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Add Reagent
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddReagent;
