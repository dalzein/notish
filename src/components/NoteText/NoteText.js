import React, { useEffect, useLayoutEffect, useRef } from "react";
import "./NoteText.css";

function NoteText(props) {
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Select end of text when on focus
  useEffect(() => {
    if (props.forceFocus) {
      contentRef.current.focus();
      contentRef.current.setSelectionRange(
        contentRef.current.value.length,
        contentRef.current.value.length
      );
    }
  }, [props.forceFocus]);

  // We need to dynamically set the textarea heights since they don't auto expand
  useLayoutEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "31px";
      titleRef.current.style.height = `${Math.max(
        titleRef.current.scrollHeight,
        10
      )}px`;
    }

    if (contentRef.current) {
      contentRef.current.style.height = "24px";
      contentRef.current.style.height = `${Math.max(
        contentRef.current.scrollHeight,
        27
      )}px`;
    }
  });

  function handleChange(e) {
    const { name, value } = e.target;

    if ((name === "title" && value.length > 40) || value.length > 280) return;

    props.onTextChange(name, value);
  }

  return (
    <div className="note-text">
      {props.showTitle && (
        <textarea
          className="title"
          name="title"
          onChange={handleChange}
          value={props.title}
          placeholder="Title..."
          spellCheck="false"
          ref={titleRef}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
      )}
      {props.showContent && (
        <textarea
          className={`content ${
            props.extendContentArea ? "active" : "inactive"
          }`}
          name="content"
          onChange={handleChange}
          value={props.content}
          placeholder="Take a note..."
          spellCheck="false"
          ref={contentRef}
        />
      )}
    </div>
  );
}

export default NoteText;
