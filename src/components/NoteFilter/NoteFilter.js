import React, { useEffect } from "react";
import styles from "./NoteFilter.module.css";

export default function NoteFilter({
  tags,
  currentTagFilter,
  changeTagFilter,
  hasNotes,
}) {
  useEffect(() => {
    if (!tags || !tags.includes(currentTagFilter)) {
      changeTagFilter("all");
    }
  });

  const handleClick = (e) => {
    changeTagFilter(e.currentTarget.name);
  };

  return (
    hasNotes &&
    tags?.length > 0 && (
      <div className={styles.noteFilter}>
        <button
          name="all"
          className={`${currentTagFilter === "all" ? styles.active : ""}`}
          type="button"
          onClick={handleClick}
        >
          All
        </button>
        {tags.map((tag, index) => (
          <button
            key={index}
            name={tag}
            className={`${currentTagFilter === tag ? styles.active : ""}`}
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
