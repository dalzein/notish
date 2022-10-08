import React, { useEffect } from "react";
import "./NoteFilter.css";

function NoteFilter(props) {
  useEffect(() => {
    if (!props.tags || !props.tags.includes(props.currentTagFilter)) {
      props.changeTagFilter("all");
    }
  }, [props]);

  function handleClick(e) {
    props.changeTagFilter(e.currentTarget.name);
  }

  return (
    props.hasNotes && (
      <div className="note-filter">
        <button
          name="all"
          className={`${props.currentTagFilter === "all" ? "active" : ""}`}
          type="button"
          onClick={handleClick}
        >
          <i className="fa-solid fa-tags"></i>
          All
        </button>
        {props.tags?.length > 0 &&
          props.tags.map((tag, index) => (
            <button
              key={index}
              name={tag}
              className={`${props.currentTagFilter === tag ? "active" : ""}`}
              type="button"
              onClick={handleClick}
            >
              <i className="fa-solid fa-tag"></i>
              {tag}
            </button>
          ))}
      </div>
    )
  );
}

export default NoteFilter;
