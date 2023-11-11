import React from "react";
import styles from "./ColourSelector.module.css";

function ColourSelector(props) {
  return (
    <div className={styles.colourSelector}>
      {[
        "grey",
        "cyan",
        "green",
        "orange",
        "pink",
        "purple",
        "red",
        "yellow",
      ].map((colourString, index) => (
        <button
          key={index}
          className={styles.colour}
          name="colour"
          style={{ background: `rgb(var(--${colourString}))` }}
          onClick={() => props.handleSelectColour(colourString)}
        ></button>
      ))}
    </div>
  );
}

export default ColourSelector;
