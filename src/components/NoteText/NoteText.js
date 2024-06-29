import React, { useEffect, useLayoutEffect, useRef } from "react";
import styles from "./NoteText.module.css";

export default function NoteText({
  title,
  content,
  extendContentArea,
  showTitle,
  showContent,
  onTextChange,
  forceFocus,
}) {
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Select end of text when on focus
  useEffect(() => {
    if (forceFocus) {
      contentRef.current.focus();
      contentRef.current.setSelectionRange(
        contentRef.current.value.length,
        contentRef.current.value.length
      );
    }
  }, [forceFocus]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "title" && value.length > 40) || value.length > 280) return;

    onTextChange(name, value);
  };

  return (
    <div className={styles.noteText}>
      {showTitle && (
        <textarea
          className={styles.title}
          name="title"
          onChange={handleChange}
          value={title}
          placeholder="Title..."
          spellCheck="false"
          ref={titleRef}
          onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
        />
      )}
      {showContent && (
        <textarea
          className={`${styles.content} ${
            extendContentArea ? styles.active : styles.inactive
          }`}
          name="content"
          onChange={handleChange}
          value={content}
          placeholder="Take a note..."
          spellCheck="false"
          ref={contentRef}
        />
      )}
    </div>
  );
}
