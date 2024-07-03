import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StockMaintenance() {
  const [reagents, setReagents] = useState([]);
  const [selectedReagent, setSelectedReagent] = useState(null);
  const [quantityRemoved, setQuantityRemoved] = useState({
    expiry: "",
    experiment: "",
  });
  const [quantityAdded, setQuantityAdded] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/reagents")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setReagents(data))
      .catch((error) =>
        toast.error("Failed to fetch reagents: " + error.message)
      );
  }, []);

  const handleReagentSelect = (e) => {
    const reagentId = parseInt(e.target.value);
    const reagent = reagents.find((r) => r.id === reagentId);
    setSelectedReagent(reagent);
    setQuantityRemoved({ expiry: "", experiment: "" });
    setQuantityAdded("");
  };

  const handleQuantityChange = (e, type) => {
    const value = e.target.value;
    if (type === "added") {
      setQuantityAdded(value);
    } else {
      setQuantityRemoved((prev) => ({ ...prev, [type]: value }));
    }
  };

  const calculateTotalQuantity = () => {
    if (!selectedReagent) return 0;
    const removedExpiry = parseFloat(quantityRemoved.expiry) || 0;
    const removedExperiment = parseFloat(quantityRemoved.experiment) || 0;
    const addedQuantity = parseFloat(quantityAdded) || 0;
    return (
      parseFloat(selectedReagent.quantity) -
      removedExpiry -
      removedExperiment +
      addedQuantity
    ).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedReagent) return;

    const updatedQuantity = calculateTotalQuantity();

    fetch(`http://localhost:5000/reagents/${selectedReagent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...selectedReagent, quantity: updatedQuantity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setReagents(reagents.map((r) => (r.id === data.id ? data : r)));
        setSelectedReagent(data);
        setQuantityRemoved({ expiry: "", experiment: "" });
        setQuantityAdded("");
        toast.success("Stock updated successfully.", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((error) => {
        toast.error("Error updating reagent: " + error.message);
      });
  };

  const filteredReagents = reagents.filter((reagent) =>
    reagent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="stock-maintenance-container">
      <style>
        {`
          .stock-maintenance-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 10px;
            max-height: 100vh;
            box-sizing: border-box;
            overflow-y: hidden;
          }
          
          .form-container {
            width: 100%;
          }
          .form-group {
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
          }
          .form-group label {
            margin-bottom: 4px;
          }
          .form-group input,
          .form-group select {
            padding: 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
          }
          .form-group input[type="number"] {
            width: 100%;
          }
          .form-group select {
            width: 100%;
          }
          .form-actions {
            display: flex;
            justify-content: center;
            margin-top: 8px;
          }
          .form-actions button {
            padding: 6px 12px;
            font-size: 1rem;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .form-actions button:hover {
            background-color: #0056b3;
          }
          .form-header {
            text-align: center;
            margin-bottom: 8px;
          }
          .form-group strong {
            margin-top: 4px;
          }
        `}
      </style>
      <ToastContainer />
      <div className="form-wrapper">
        <h1 className="form-header">  Stock Maintenance</h1>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="search-reagent">Search Reagent:</label>
            <input
              type="text"
              id="search-reagent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="reagent-select">Select Reagent:</label>
            <select id="reagent-select" onChange={handleReagentSelect} required>
              <option value="">--Select a reagent--</option>
              {filteredReagents.map((reagent) => (
                <option key={reagent.id} value={reagent.id}>
                  {reagent.name}
                </option>
              ))}
            </select>
          </div>
          {selectedReagent && (
            <>
              <div className="form-group"></div>
              <div className="form-group">
                <label htmlFor="removed-expiry">
                  Quantity Removed (Expiry):
                </label>
                <input
                  type="number"
                  id="removed-expiry"
                  value={quantityRemoved.expiry}
                  step="0.01"
                  onChange={(e) => handleQuantityChange(e, "expiry")}
                />
              </div>
              <div className="form-group">
                <label htmlFor="removed-experiment">
                  Quantity Removed (Experiment):
                </label>
                <input
                  type="number"
                  id="removed-experiment"
                  value={quantityRemoved.experiment}
                  step="0.01"
                  onChange={(e) => handleQuantityChange(e, "experiment")}
                />
              </div>
              <div className="form-group">
                <label htmlFor="added-new">Quantity Added (New Stock):</label>
                <input
                  type="number"
                  id="added-new"
                  value={quantityAdded}
                  step="0.01"
                  onChange={(e) => handleQuantityChange(e, "added")}
                />
              </div>
              <div className="form-group">
                <strong>
                  Total Quantity: {calculateTotalQuantity()}{" "}
                  {selectedReagent.quantity_measure}
                </strong>
              </div>
              <div className="form-actions">
                <button type="submit">Update Stock</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default StockMaintenance;
