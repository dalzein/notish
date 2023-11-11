import React, { useEffect } from "react";
import styles from "./NoteFilter.module.css";

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
    props.hasNotes &&
    props.tags?.length > 0 && (
      <div className={styles.noteFilter}>
        <button
          name="all"
          className={`${props.currentTagFilter === "all" ? styles.active : ""}`}
          type="button"
          onClick={handleClick}
        >
          All
        </button>
        {props.tags.map((tag, index) => (
          <button
            key={index}
            name={tag}
            className={`${props.currentTagFilter === tag ? styles.active : ""}`}
            type="button"
            onClick={handleClick}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 4V8H4V10H8V14H4V16H8V20H10V16H14V20H16V16H20V14H16V10H20V8H16V4H14V8H10V4H8ZM14 14V10H10V14H14Z"
                fill="currentColor"
              />
            </svg>
            <span className={styles.tagText}>{tag}</span>
          </button>
        ))}
      </div>
    )
  );
}

export default NoteFilter;
