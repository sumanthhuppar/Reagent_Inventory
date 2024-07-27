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

  const fetchReagents = () => {
    fetch("http://localhost:5000/reagents")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setReagents(data))
      .catch((error) =>
        toast.error("Failed to fetch reagents: " + error.message, {
          theme: "dark",
        })
      );
  };

  useEffect(() => {
    fetchReagents();
  }, []);

  const handleReagentSelect = (e) => {
    const reagentId = parseInt(e.target.value);
    const reagent = reagents.find((r) => r.id === reagentId);
    setSelectedReagent(reagent);
    setQuantityRemoved({ expiry: "", experiment: "" });
    setQuantityAdded("");
  };

  const handleQuantityChange = (e, type) => {
    const value = parseFloat(e.target.value);
    if (value < 0) {
      toast.error("Quantity cannot be negative", {
        theme: "dark",
      });
      return;
    }
    if (type === "added") {
      setQuantityAdded(e.target.value);
    } else {
      setQuantityRemoved((prev) => ({ ...prev, [type]: e.target.value }));
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

    const removedExpiry = parseFloat(quantityRemoved.expiry) || 0;
    const removedExperiment = parseFloat(quantityRemoved.experiment) || 0;

    if (removedExpiry + removedExperiment > selectedReagent.quantity) {
      toast.error("Error: Quantity removed cannot exceed total quantity.", {
        theme: "dark",
      });
      return;
    }

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

        // After successful stock update, send an email
        // const emailData = {
        //   when: new Date().toISOString(),
        //   what: selectedReagent.name,
        //   howMuch: updatedQuantity,
        // };

        // After successful stock update, send an email
        const emailData = {
          dbData: reagents
        };

        fetch('http://localhost:5000/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        })
          .then(emailResponse => {
            if (!emailResponse.ok) {
              throw new Error('Failed to send email');
            }
            return emailResponse.json();
          })
          .then(() => {
            toast.success("Email sent successfully.", {
              theme: "dark",
            });
          })
          .catch(emailError => {
            toast.error("Failed to send email: " + emailError.message, {
              theme: "dark",
            });
          });

        setReagents(reagents.map((r) => (r.id === data.id ? data : r)));
        setSelectedReagent(null);
        setQuantityRemoved({ expiry: "", experiment: "" });
        setQuantityAdded("");
        setSearchTerm("");
        document.getElementById("reagent-select").value = ""; // Reset select field
        fetchReagents();
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
        toast.error("Error updating reagent: " + error.message, {
          theme: "dark",
        });
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
          width: 350px;
          min-width: 350px;
          max-width: 350px;
          background-color: rgba(255, 255, 255, 0.5); /* Semi-transparent white background */
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0, 100, 0, 0.3); /* Darker green-tinted box shadow */
          border: 1px solid rgba(0, 255, 0, 0.4); /* Green tinted border */
          backdrop-filter: blur(10px);
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
            color:#32CD32;
          }
          .form-group strong {
            margin-top: 4px;
          }
          .note {
            margin-bottom: 8px;
            font-size: 0.9rem;
            color: #555;
          }
          .warning {
            color: #d17b00;
            font-weight: bold;
          }
        `}
      </style>
      <ToastContainer />
      <div className="form-wrapper">
        <h1 className="form-header">Stock Care.</h1>
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
              <div className="form-group">
                <label htmlFor="removed-expiry">
                  Quantity Issued :
                </label>
                <input
                  type="number"
                  id="removed-expiry"
                  value={quantityRemoved.expiry}
                  step="0.01"
                  onChange={(e) => handleQuantityChange(e, "expiry")}
                />
              </div>
              {/* <div className="form-group">
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
              </div> */}
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

                <p>
                  <strong style={{ fontFamily: 'Arial, sans-serif',fontSize:"18px" }}>
                    Total Quantity: {calculateTotalQuantity()}
                  </strong> &#160;
                  <div style={{ fontWeight: '300', fontFamily: 'Arial, sans-serif',display:"inline",fontSize:"13px" }}>
                    &#215; {selectedReagent.quantity_measure}
                  </div>

                </p>




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
