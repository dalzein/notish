import React from "react";
import styles from "./ColourSelector.module.css";

export default function ColourSelector({ handleSelectColour }) {
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
          style={{ background: `hsl(var(--${colourString}))` }}
          onClick={() => handleSelectColour(colourString)}
        ></button>
      ))}
    </div>
  );
}
