import React from "react";
import "./IconButton.css";

function IconButton(props) {
  return (
    <button className="icon-button" onClick={props.onClick} tabIndex="-1">
      <i className={props.icon}></i>
    </button>
  );
}

export default IconButton;
