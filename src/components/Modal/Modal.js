import React from "react";
import "./Modal.css";

function Modal(props) {
  function handleClick() {
    props.onClose();
  }

  function preventEventBubbling(e) {
    e.stopPropagation();
  }

  return (
    <div
      className={`modal-wrapper ${props.show ? "show" : ""}`}
      onClick={handleClick}
    >
      <div
        className="modal"
        onClick={preventEventBubbling}
        style={{ maxWidth: props.maxWidth ?? "25rem" }}
      >
        <div className="modal-header">
          <button
            type="button"
            className="modal-close"
            onClick={() => props.onClose()}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-body">{props.children}</div>
      </div>
    </div>
  );
}

export default Modal;
