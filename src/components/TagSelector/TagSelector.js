import React, { useState } from "react";
import "./TagSelector.css";

function TagSelector(props) {
  const [tag, setTag] = useState("");

  function handleAddTag() {
    if (!tag) return;

    props.onSelectTag(tag);

    setTag("");
  }

  // Allow Enter key to save the tag
  function handleKeyDown(e) {
    if (e.key !== "Enter" || !tag) return;

    props.onSelectTag(tag);

    setTag("");
  }

  function handleSelectTag(e) {
    props.onSelectTag(e.currentTarget.getAttribute("name"));
  }

  return (
    <div>
      {(props.tags.length > 0 || props.activeTag) && (
        <div className="existing-tags">
          {props.tags.length > 0 &&
            props.tags.map((tag, index) => (
              <div
                name={tag}
                key={index}
                className={`existing-tag ${
                  tag === props.activeTag ? "active" : ""
                }`}
                onClick={handleSelectTag}
              >
                <div className="tag-name" style={{ overflow: "hidden" }}>
                  <span>{tag}</span>
                </div>
                {tag === props.activeTag && (
                  <div className="clear-tag" onClick={props.onClearTag}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H8Z"
                        fill="currentColor"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          {props.activeTag && !props.tags.includes(props.activeTag) && (
            <span
              name={props.activeTag}
              className="existing-tag active"
              onClick={handleSelectTag}
            >
              {props.activeTag}
              <div className="clear-tag" onClick={props.onClearTag}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H8Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </span>
          )}
        </div>
      )}
      <div className="add-new-tag">
        <input
          className="tag-input"
          maxLength="16"
          type="text"
          value={tag}
          placeholder="Create new tag..."
          onKeyDown={handleKeyDown}
          onChange={(e) => setTag(e.target.value)}
          spellCheck="false"
        />
        <button className="add-tag-button" onClick={handleAddTag}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4C11.4477 4 11 4.44772 11 5V11H5C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V13H19C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11H13V5C13 4.44772 12.5523 4 12 4Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TagSelector;
