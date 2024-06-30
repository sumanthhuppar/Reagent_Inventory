import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmation from "./DeleteConfirmation";

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

  const filteredReagents = reagents.filter((reagent) =>
    reagent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Reagents List.</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: "10px" }}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Quantity Measure</th>
            <th>Source</th>
            <th>Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReagents.map((reagent) => (
            <tr key={reagent.id}>
              <td>{reagent.name}</td>
              <td>{reagent.quantity}</td>
              <td>{reagent.quantity_measure}</td>
              <td>{reagent.source}</td>
              <td>{reagent.expiry}</td>
              <td style={{ verticalAlign: "middle", textAlign: "center" }}>
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
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
}

export default ReagentList;
