import React from "react";
import "./ColourSelector.css";

function ColourSelector(props) {
  return (
    <div className="colour-selector">
      {[
        "accent-2",
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
          className="colour"
          name="colour"
          style={{ backgroundColor: `var(--${colourString})` }}
          onClick={() => props.handleSelectColour(colourString)}
        ></button>
      ))}
    </div>
  );
}

export default ColourSelector;
