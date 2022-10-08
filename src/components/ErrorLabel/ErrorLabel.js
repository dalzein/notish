import React from "react";
import "./ErrorLabel.css";

function ErrorLabel(props) {
  return (
    <label className={`error-label ${props.error ? "" : "hidden"}`}>
      {props.error && (
        <i className="fa-solid fa-circle-exclamation error-icon"></i>
      )}
      {props.error}
    </label>
  );
}

export default ErrorLabel;
