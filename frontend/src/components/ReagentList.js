import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ReagentList.css';
import DeleteConfirmation from "./DeleteConfirmation";
import moment from "moment";

function ReagentList() {
  const [reagents, setReagents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("last_updated");

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

  const handleSort = (event) => {
    setSortCriteria(event.target.value);
  };

  const getDaysToExpire = (expiryDate) => {
    const expiry = moment(expiryDate);
    const today = moment();
    const diff = expiry.diff(today, "days");
    return diff < 0 ? 0 : diff;
  };

  const filteredReagents = reagents
    .filter((reagent) =>
      reagent.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortCriteria === "name") {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      } else if (sortCriteria === "days_to_expire") {
        return getDaysToExpire(a.expiry) - getDaysToExpire(b.expiry);
      } else {
        return moment(b.last_updated).diff(moment(a.last_updated));
      }
    });

  const styles = {
    container: {
      maxHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    header: {
      color: "darkgreen",
    },
    h1: {
      textAlign: "center",
      color: "#32CD32", // Darker shade of green
      marginBottom: "20px",
    },
    inputContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      padding: "0 20px",
      flexShrink: 0,
    },
    input: {
      width: "50%",
      padding: "8.5px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "0.8px solid #388E3C",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    colorLabelContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      marginRight: "30px",
    },
    colorLabel: {
      display: "flex",
      alignItems: "center",
      marginBottom: "5px",
      fontSize: "14px",
    },
    colorDot: {
      height: "10px",
      width: "10px",
      borderRadius: "50%",
      display: "inline-block",
      marginRight: "5px",
    },
    redDot: {
      backgroundColor: "red",
    },
    orangeDot: {
      backgroundColor: "orange",
    },
    greenDot: {
      backgroundColor: "green",
    },
    sortContainer: {
      marginRight: "20px",
      marginLeft: "30px",
    },
    sortSelect: {
      width: "150px",
      padding: "8.5px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "0.8px solid #388E3C",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    tableContainer: {
      overflowY: "auto",
      flexGrow: 1,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      color: "white",
      backgroundColor: "#388E3C",
      border: "0.8px solid white",
      padding: "10px",
      textAlign: "left",
      wordBreak: "keep-all",
      position: "sticky",
      top: -1,
      zIndex: 1,
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
      wordBreak: "break-word",
      height: "auto", // Allow height to increase for long content
      verticalAlign: "top", // Ensure content starts from the top
      maxWidth: "200px", // Adjust as needed for each column
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Reagents List</h1>
      <div style={styles.inputContainer}>
        <div style={styles.sortContainer}>
          <select style={styles.sortSelect} onChange={handleSort}>
            <option value="last_updated">Sort by: Modify</option>
            <option value="name">Sort by: Name</option>
            <option value="days_to_expire">Sort by: Days to Expire</option>
          </select>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.input}
        />
        <div style={styles.colorLabelContainer}>
          <div style={styles.colorLabel}>
            <span style={{ ...styles.colorDot, ...styles.greenDot }}></span> ≥
            Alert
          </div>
          <div style={styles.colorLabel}>
            <span style={{ ...styles.colorDot, ...styles.orangeDot }}></span>{" "}
            &lt; Alert
          </div>
          <div style={styles.colorLabel}>
            <span style={{ ...styles.colorDot, ...styles.redDot }}></span> 0
            days
          </div>
        </div>
      </div>
      <div className="tableContainer" style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "21%" }}>Name</th>
              <th style={{ ...styles.th, width: "5%" }}>Units Available</th>
              <th style={{ ...styles.th, width: "9%" }}>Packing Type</th>
              <th style={{ ...styles.th, width: "9%" }}>Unit Size</th>
              <th style={{ ...styles.th, width: "10%" }}>Source</th>
              <th style={{ ...styles.th, width: "9%" }}>Expiry</th>
              <th style={{ ...styles.th, width: "9%" }}>Days to Expire</th>
              <th style={{ ...styles.th, width: "10%" }}>Last Updated</th>
              <th style={{...styles.th,width: "10%"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReagents.map((reagent, index) => {
              const Alert = reagent.setAlert
              const daysToExpire = getDaysToExpire(reagent.expiry);
              const quantityAlert = reagent.setQuantity
              const quantity = reagent.quantity
              const textColor =
                daysToExpire === 0
                  ? "red"
                  : (daysToExpire <= Alert) || (quantity <= quantityAlert)
                    ? "orange"
                    : "green";
              const backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#e0e0e0";
              const formattedExpiry = moment(reagent.expiry).format("DD-MM-YYYY");
              const formattedLastUpdated = moment(reagent.last_updated).format(
                "DD-MM-YYYY"
              );
              return (
                <tr
                  key={reagent.id}
                  style={{ backgroundColor, color: textColor }}
                >
                  <td
                    style={{
                      ...styles.td,
                      maxWidth: "30%",
                      whiteSpace: "normal",
                    }}
                  >
                    {reagent.name}
                  </td>
                  <td style={{ ...styles.td, width: "5%" }}>
                    {reagent.quantity}
                  </td>
                  <td style={{ ...styles.td, width: "10%" }}>
                    {reagent.packingtype}
                  </td>

                  <td style={{ ...styles.td, width: "10%" }}>
                    {reagent.quantity_measure}
                  </td>
                  <td style={{ ...styles.td, width: "10%" }}>{reagent.source}</td>
                  <td style={{ ...styles.td, width: "10%" }}>{formattedExpiry}</td>
                  <td style={styles.td}>{daysToExpire}</td>
                  <td style={styles.td}>{formattedLastUpdated}</td>
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
      </div>
      <ToastContainer />
    </div>
  );
}
export default ReagentList;
