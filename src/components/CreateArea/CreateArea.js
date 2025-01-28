import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ColourSelector from "../ColourSelector/ColourSelector";
import IconButton from "../IconButton/IconButton";
import Modal from "../Modal/Modal";
import NoteTag from "../NoteTag/NoteTag";
import NoteText from "../NoteText/NoteText";
import TagSelector from "../TagSelector/TagSelector";
import UtilityContainer from "../UtilityContainer/UtilityContainer";
import UtilityDropdown from "../UtilityDropdown/UtilityDropdown";
import styles from "./CreateArea.module.css";

export default function CreateArea({ onAdd, tags, noteLimitReached }) {
  const noteRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
    tag: "",
    colour: "grey",
  });
  const [noteLimitModalIsOpen, setNoteLimitModalIsOpen] = useState(false);

  useEffect(() => {
    const handleWindowClick = (e) => {
      if (noteRef.current?.contains(e.target)) return;
      if (!note.title && !note.content && !note.tag) {
        setIsActive(false);
        setNote({
          title: "",
          content: "",
          tag: "",
          colour: "grey",
        });
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => window.removeEventListener("click", handleWindowClick);
  }, [note.content, note.title, note.tag]);

  const handleTextChange = useCallback((name, value) => {
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  }, []);

  const submitNote = (e) => {
    e && e.stopPropagation();
    e && e.preventDefault();

    if (!note.title && !note.content && !note.tag) return;

    if (noteLimitReached) {
      setNoteLimitModalIsOpen(true);
      return;
    }

    onAdd({
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
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleSelectTag = useCallback((tag) => {
    setNote((previousValue) => ({
      ...previousValue,
      tag,
    }));
  }, []);

  const handleClearTag = useCallback((e) => {
    e.stopPropagation();
    setNote((previousValue) => ({
      ...previousValue,
      tag: "",
    }));
  }, []);

  const handleSelectColour = useCallback((colourString) => {
    setNote((previousValue) => ({
      ...previousValue,
      colour: colourString,
    }));
  }, []);

  return (
    <div className={styles.createArea}>
      <div
        className={styles.createNote}
        onClick={handleFocus}
        ref={noteRef}
        style={{
          background: `hsl(var(--${isActive ? note.colour : "grey"}) / 20%)`,
          border: `1px solid hsl(var(--${
            isActive ? note.colour : "grey"
          }) / 60%)`,
        }}
      >
        <NoteText
          title={note.title}
          content={note.content}
          extendContentArea={isActive}
          showTitle={isActive}
          showContent={true}
          onTextChange={handleTextChange}
          forceFocus={isActive}
        />
        <NoteTag tagName={note.tag} />
        {isActive && (
          <UtilityContainer show="true">
            <UtilityDropdown name="tag" icon="tag" width="22rem">
              <TagSelector
                tags={tags}
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
