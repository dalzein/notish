import React from "react";
import styles from "./NoteTag.module.css";

export default function NoteTag({ tagName }) {
  return (
    tagName && (
      <div className={styles.noteTag}>
        <span>{tagName}</span>
      </div>
    )
  );
}
