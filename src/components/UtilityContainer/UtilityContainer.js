import React from "react";
import styles from "./UtilityContainer.module.css";

export default function UtilityContainer({ show, children }) {
  return (
    <div className={`${styles.utilityContainer} ${show ? styles.show : ""}`}>
      {children}
    </div>
  );
}
