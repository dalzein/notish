import React from "react";
import styles from "./NoteTag.module.css";

function NoteTag(props) {
  return (
    props.tagName && (
      <div className={styles.noteTag}>
        <span>{props.tagName}</span>
      </div>
    )
  );
}

export default NoteTag;
