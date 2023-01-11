import React, { useState } from "react";
import "./CreateArea.css";
import { nanoid } from "nanoid";
import NoteText from "../NoteText/NoteText";
import UtilityDropdown from "../UtilityDropdown/UtilityDropdown";
import TagSelector from "../TagSelector/TagSelector";
import ColourSelector from "../ColourSelector/ColourSelector";
import IconButton from "../IconButton/IconButton";
import UtilityContainer from "../UtilityContainer/UtilityContainer";
import NoteTag from "../NoteTag/NoteTag";
import Modal from "../Modal/Modal";

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

  function handleFocus(e) {
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
        tabIndex="-1"
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
              <UtilityDropdown name="tag" icon="fa-solid fa-tag">
                <TagSelector
                  tags={props.tags}
                  activeTag={note.tag}
                  onSelectTag={handleSelectTag}
                  onClearTag={handleClearTag}
                />
              </UtilityDropdown>
              <UtilityDropdown name="colour" icon="fa-solid fa-palette">
                <ColourSelector handleSelectColour={handleSelectColour} />
              </UtilityDropdown>
              <IconButton icon="fa-solid fa-plus" onClick={submitNote} />
            </UtilityContainer>
          </div>
        )}
      </div>

      <Modal
        show={showNoteLimitModal}
        onClose={() => setShowNoteLimitModal(false)}
      >
        <div className="note-limit">
          <i className="fa-solid fa-circle-exclamation fa-2x"></i>
          <p>You've reached the maximum number of notes we can hold!</p>
        </div>
      </Modal>
    </div>
  );
}

export default CreateArea;
