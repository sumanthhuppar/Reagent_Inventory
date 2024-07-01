import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmation from "./DeleteConfirmation";
import moment from "moment";

function ReagentList() {
  const [reagents, setReagents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/reagents")
      .then((response) => response.json())
      .then((data) => setReagents(data));
  }, []);

  const notify_Delete_Toast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const handleDelete = (id) => {
    toast.info(
      <DeleteConfirmation
        onConfirm={() => {
          fetch(`http://localhost:5000/reagents/${id}`, {
            method: "DELETE",
          })
            .then(() => {
              setReagents(reagents.filter((reagent) => reagent.id !== id));
              notify_Delete_Toast("Reagent deleted successfully !");
            })
            .catch((error) => {
              console.error("Error deleting reagent:", error);
              notify_Delete_Toast("Error deleting reagent");
            });
        }}
      />,
      {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        theme: "light",
      }
    );
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getDaysToExpire = (expiryDate) => {
    const expiry = moment(expiryDate);
    const today = moment();
    const diff = expiry.diff(today, "days");
    return diff < 0 ? 0 : diff;
  };

  const filteredReagents = reagents.filter((reagent) =>
    reagent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    header: {
      color: "darkgreen",
    },
    h1: {
      textAlign: "center",
      color: "#4CAF50",
      marginBottom: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      color: "white",
      backgroundColor: "#388E3C", // medium green
      border: "0.8px solid white",
      padding: "10px",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
    inputContainer: {
      marginBottom: "20px",
      textAlign: "center",
    },
    input: {
      width: "40%",
      padding: "8.5px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "0.8px solid #388E3C",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  return (
    <div>
      <h1 style={styles.h1}>Reagents List.</h1>
      <div className="mb-3" style={styles.inputContainer}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.input}
        />
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Quantity Measure</th>
            <th style={styles.th}>Source</th>
            <th style={styles.th}>Expiry</th>
            <th style={styles.th}>Days to Expire</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReagents.map((reagent, index) => {
            const daysToExpire = getDaysToExpire(reagent.expiry);
            const textColor =
              daysToExpire === 0
                ? "red"
                : daysToExpire < 30
                ? "orange"
                : "green";
            const backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#e0e0e0";
            return (
              <tr
                key={reagent.id}
                style={{ backgroundColor, color: textColor }}
              >
                <td style={styles.td}>{reagent.name}</td>
                <td style={styles.td}>{reagent.quantity}</td>
                <td style={styles.td}>{reagent.quantity_measure}</td>
                <td style={styles.td}>{reagent.source}</td>
                <td style={styles.td}>{reagent.expiry}</td>
                <td style={styles.td}>{daysToExpire}</td>
                <td
                  style={{
                    ...styles.td,
                    verticalAlign: "middle",
                    textAlign: "center",
                  }}
                >
                  <Link
                    to={`/edit-reagent/${reagent.id}`}
                    style={{ marginRight: "10px" }}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      title="Edit"
                      style={{
                        width: "25px",
                        height: "20px",
                        marginLeft: "1px",
                        marginRight: "7px",
                      }}
                    />
                  </Link>
                  <button
                    style={{
                      border: "none",
                      background: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(reagent.id)}
                  >
                    <lord-icon
                      src="https://cdn.lordicon.com/skkahier.json"
                      trigger="hover"
                      colors="primary:#c71f16"
                      style={{ width: "28px", height: "25px" }}
                    ></lord-icon>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default ReagentList;
