import React from "react";
import styles from "./UtilityContainer.module.css";

function UtilityContainer(props) {
  return (
    <div
      className={`${styles.utilityContainer} ${props.show ? styles.show : ""}`}
    >
      {props.children}
    </div>
  );
}

export default UtilityContainer;
