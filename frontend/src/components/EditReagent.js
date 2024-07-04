import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import styled from "styled-components";

const ConfirmationModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  z-index: 100;
  text-align: center;
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
`;

const ModalButton = styled.button`
  margin: 10px;
  padding: 8px 20px;
  cursor: pointer;
  background-color: #388e3c;
  color: white;
  border: none;
  border-radius: 4px;
`;

function EditReagent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reagent, setReagent] = useState({
    name: "",
    quantity: 0,
    quantity_measure: "",
    source: "",
    expiry: "",
    last_updated: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmationCallback, setConfirmationCallback] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/reagents/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setReagent({
          ...data,
          last_updated: moment(data.last_updated).format("DD-MM-YYYY"),
        });
      })
      .catch((error) => console.error("Error fetching reagent:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReagent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();

    if (reagent.quantity <= 0) {
      toast.error("Quantity must be above 0.", { theme: "dark" });
      return;
    }

    if (!/^[a-zA-Z]*$/.test(reagent.quantity_measure)) {
      toast.error("Measure must only include characters.", {
        theme: "dark",
      });
      return;
    }

    if (!/^(?=.*[a-zA-Z])[a-zA-Z0-9-]*$/.test(reagent.source)) {
      toast.error("Source must include characters and can include numbers.", {
        theme: "dark",
      });
      return;
    }

    const currentDate = new Date();
    const expiryDate = new Date(reagent.expiry);

    if (expiryDate < currentDate) {
      setModalIsOpen(true);
      setConfirmationCallback(() => () => handleSubmit(e));
      return;
    }

    handleSubmit(e);
  };

  const handleSubmit = (e) => {
    const updatedReagent = {
      ...reagent,
      last_updated: moment().format("DD-MM-YYYY"),
    };

    fetch(`http://localhost:5000/reagents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedReagent),
    })
      .then((response) => response.json())
      .then((data) => {
        navigate("/");
      })
      .catch((error) => console.error("Error updating reagent:", error));
  };

  const handleConfirmation = (confirmed) => {
    setModalIsOpen(false);
    if (confirmed && confirmationCallback) {
      confirmationCallback();
    }
  };

  return (
    <div className="edit-reagent-container" style={styles.container}>
      <h1 style={{ color: "#32CD32" }}>Edit Reagents</h1>
      <form
        className="edit-reagent-form"
        onSubmit={validateAndSubmit}
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
            min="1"
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
      {modalIsOpen && (
        <Overlay>
          <ConfirmationModal>
            <h2>Product Expired</h2>
            <p>
              The entered expiry date is before the current date. Do you want to
              proceed?
            </p>
            <div>
              <ModalButton onClick={() => handleConfirmation(true)}>
                Yes
              </ModalButton>
              <ModalButton onClick={() => handleConfirmation(false)}>
                No
              </ModalButton>
            </div>
          </ConfirmationModal>
        </Overlay>
      )}
      <ToastContainer theme="dark" />
    </div>
  );
}

export default EditReagent;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",

    maxHeight: "100vh",
    overflow: "hidden", // Prevents scroll bar from appearing
    paddingTop: "0px", // Adjusted to move form higher vertically
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
  },
};
