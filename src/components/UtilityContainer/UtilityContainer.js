import React from "react";
import "./UtilityContainer.css";

function UtilityContainer(props) {
  return (
    <div className={`utility-container ${props.show ? "show" : ""}`}>
      {props.children}
    </div>
  );
}

export default UtilityContainer;
