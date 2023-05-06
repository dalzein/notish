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
import "./CreateArea.css";

function CreateArea(props) {
  const [isActive, setIsActive] = useState(false);
  const [note, setNote] = useState({
    title: "",
    content: "",
    tag: "",
    colour: "accent-2",
  });
  const [showNoteLimitModal, setShowNoteLimitModal] = useState(false);

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
      setShowNoteLimitModal(true);
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
      colour: "accent-2",
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
        colour: "accent-2",
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
    <div className="create-area">
      <div
        className="create-note"
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={{
          border: `1px solid var(--${isActive ? note.colour : "accent-2"})`,
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
          <div className="utility-wrapper">
            <UtilityContainer show="true">
              <UtilityDropdown name="tag" icon="tag">
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
        show={showNoteLimitModal}
        onClose={() => setShowNoteLimitModal(false)}
      >
        <div className="note-limit">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V7C11 6.44772 11.4477 6 12 6Z"
              fill="currentColor"
            />
            <path
              d="M12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z"
              fill="currentColor"
            />
          </svg>
          <p>You've reached the maximum number of notes we can hold!</p>
        </div>
      </Modal>
    </div>
  );
}

export default CreateArea;
