import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DeleteConfirmation({ onConfirm }) {
  const handleConfirm = () => {
    onConfirm();
    toast.dismiss(); // Dismiss the confirmation toast after confirming
  };

  const styles = {
    container: {
      backgroundColor: "white",
      padding: "18px",
      border: "1px solid #D1D5DB",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      borderRadius: "12px",
      maxWidth: "450px",
      margin: "0 auto",
    },
    title: {
      fontSize: "15px",
      fontWeight: "900",
      marginBottom: "16px",
      textAlign: "center",
      color: "#1F2937",
    },
    message: {
      marginBottom: "5px",
      textAlign: "center",
      color: "#4B5563",
    },
    caution: {
      marginBottom: "20px",
      textAlign: "center",
      color: "#DC2626",
      fontWeight: "400",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "12px",
    },
    deleteButton: {
      backgroundColor: "#DC2626",
      color: "white",
      padding: "6px 13px",
      borderRadius: "10px",
      transition: "background-color 0.2s",
      border: "none",
      cursor: "pointer",
    },
    cancelButton: {
      backgroundColor: "#D1D5DB",
      color: "#1F2937",
      padding: "6px 13px",
      borderRadius: "10px",
      transition: "background-color 0.2s",
      border: "none",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <p style={styles.title}>Confirm Deletion</p>
      <p style={styles.message}>Sure to delete this reagent?</p>
      <p style={styles.caution}>This cannot be undone !</p>
      <div style={styles.buttonContainer}>
        <button
          style={styles.deleteButton}
          onClick={handleConfirm}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#B91C1C")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#DC2626")}
        >
          Delete
        </button>
        <button
          style={styles.cancelButton}
          onClick={() => toast.dismiss()}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#9CA3AF")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#D1D5DB")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
