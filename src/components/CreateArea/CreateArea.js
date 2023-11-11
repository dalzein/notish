import { nanoid } from "nanoid";
import React, { useState } from "react";
import ColourSelector from "../ColourSelector/ColourSelector";
import IconButton from "../IconButton/IconButton";
import Modal from "../Modal/Modal";
import NoteTag from "../NoteTag/NoteTag";
import NoteText from "../NoteText/NoteText";
import TagSelector from "../TagSelector/TagSelector";
import UtilityContainer from "../UtilityContainer/UtilityContainer";
import UtilityDropdown from "../UtilityDropdown/UtilityDropdown";
import styles from "./CreateArea.module.css";

function CreateArea(props) {
  const [isActive, setIsActive] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
    tag: "",
    colour: "grey",
  });
  const [noteLimitModalIsOpen, setNoteLimitModalIsOpen] = useState(false);

  function onTextChange(name, value) {
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }

  function submitNote(e) {
    e && e.stopPropagation();
    e && e.preventDefault();

    if (!note.title && !note.content && !note.tag) return;

    if (props.noteLimitReached) {
      setNoteLimitModalIsOpen(true);
      return;
    }

    props.onAdd({
      ...note,
      clientId: nanoid(),
    });

    setNote({
      title: "",
      content: "",
      tag: "",
      colour: "grey",
    });

    setIsActive(false);
  }

  // If the user clicks out of the create area create note if there's content, otherwise collapse the create area
  function handleBlur(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (!note.title && !note.content && !note.tag) {
      setIsActive(false);
      setNote({
        title: "",
        content: "",
        tag: "",
        colour: "grey",
      });
    }
  }

  function handleFocus() {
    setIsActive(true);
  }

  function handleSelectTag(tag) {
    setNote((previousValue) => ({
      ...previousValue,
      tag,
    }));
  }

  function handleClearTag(e) {
    e.stopPropagation();
    setNote((previousValue) => ({
      ...previousValue,
      tag: "",
    }));
  }

  function handleSelectColour(colourString) {
    setNote((previousValue) => ({
      ...previousValue,
      colour: colourString,
    }));
  }

  return (
    <div className={styles.createArea}>
      <div
        className={styles.createNote}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={{
          background: `rgba(var(--${isActive ? note.colour : "grey"}), 0.1)`,
          border: `1px solid rgba(var(--${
            isActive ? note.colour : "grey"
          }), 0.5)`,
        }}
      >
        <NoteText
          title={note.title}
          content={note.content}
          extendContentArea={isActive}
          showTitle={isActive}
          showContent={true}
          onTextChange={onTextChange}
          forceFocus={isActive}
        />
        <NoteTag tagName={note.tag} />
        {isActive && (
          <div className={styles.utilityWrapper}>
            <UtilityContainer show="true">
              <UtilityDropdown name="tag" icon="tag" width="100%">
                <TagSelector
                  tags={props.tags}
                  activeTag={note.tag}
                  onSelectTag={handleSelectTag}
                  onClearTag={handleClearTag}
                />
              </UtilityDropdown>
              <UtilityDropdown name="colour" icon="colour">
                <ColourSelector handleSelectColour={handleSelectColour} />
              </UtilityDropdown>
              <IconButton icon="add" onClick={submitNote} />
            </UtilityContainer>
          </div>
        )}
      </div>

      <Modal
        isOpen={noteLimitModalIsOpen}
        close={() => setNoteLimitModalIsOpen(false)}
      >
        <div className={styles.modalContent}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
          </svg>
          <p>You've reached the note limit!</p>
        </div>
      </Modal>
    </div>
  );
}

export default CreateArea;
