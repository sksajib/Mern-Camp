import React from "react";
// import Modal from "react-modal";
import { Modal } from "antd";

// Style for the modal
const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

// Confirmation dialog component
const ConfirmationDialog = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <Modal open={isOpen} onCancel={onCancel} footer={null}>
      <h2>Are you sure to delete this post?</h2>
      <button className="btn btn-danger me-2 btn-lg" onClick={onConfirm}>
        Yes
      </button>
      <button className="btn btn-primary me-2 btn-lg" onClick={onCancel}>
        No
      </button>
    </Modal>
  );
};

export default ConfirmationDialog;
