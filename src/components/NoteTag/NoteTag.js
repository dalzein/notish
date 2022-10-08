import React from "react";
import "./NoteTag.css";

function NoteTag(props) {
  return (
    props.tagName && (
      <div className="note-tag">
        <span>{props.tagName}</span>
      </div>
    )
  );
}

export default NoteTag;
