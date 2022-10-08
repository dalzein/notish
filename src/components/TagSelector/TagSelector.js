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
    <div className="tag-selector">
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
                    <i className="fa-solid fa-circle-xmark"></i>
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
                <i className="fa-solid fa-circle-xmark"></i>
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
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
}

export default TagSelector;
