import React, { useCallback, useEffect, useRef, useState } from "react";
import ColourSelector from "../ColourSelector/ColourSelector";
import NoteTag from "../NoteTag/NoteTag";
import NoteText from "../NoteText/NoteText";
import TagSelector from "../TagSelector/TagSelector";
import UtilityContainer from "../UtilityContainer/UtilityContainer";
import UtilityDropdown from "../UtilityDropdown/UtilityDropdown";
import styles from "./Note.module.css";

export default function Note({
  note,
  onEdit,
  onDelete,
  startSyncing,
  syncNoteWithFirestore,
  tags,
  arrangeNotes,
  onNoteDrag,
}) {
  const noteRef = useRef(null);
  const deviceIsTouchScreen =
    "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;
  const [mouseOver, setMouseOver] = useState(false);
  const [showDropdown, setShowDropdown] = useState({
    colour: false,
    tag: false,
    delete: false,
  });
  const [isActive, setIsActive] = useState(false);
  const [noteSnapshot, setNoteSnapshot] = useState({
    title: note.title,
    content: note.content,
    colour: note.colour,
    tag: note.tag,
  });

  // Bring note forward if it's in focus
  const zIndex =
    isActive || showDropdown.colour || showDropdown.tag || showDropdown.delete
      ? 1000
      : 0;

  useEffect(() => {
    const handleWindowClick = (e) => {
      !noteRef.current?.contains(e.target) && setIsActive(false);
    };

    window.addEventListener("click", handleWindowClick);

    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  useEffect(() => {
    arrangeNotes();
  }, [isActive, arrangeNotes, onNoteDrag]);

  useEffect(() => {
    let timeout;
    let shouldUpdate = false;

    Object.keys(noteSnapshot).forEach((key) => {
      shouldUpdate = shouldUpdate || note[key] !== noteSnapshot[key];
    });

    const syncNoteUpdates = () => {
      setNoteSnapshot((previousValue) => ({
        ...previousValue,
        title: note.title,
        content: note.content,
        colour: note.colour,
        tag: note.tag,
      }));
      syncNoteWithFirestore(note);
    };

    // Debounce update calls to Firestore database
    if (shouldUpdate) {
      startSyncing();
      timeout = setTimeout(syncNoteUpdates, 2000);
    }

    return () => clearTimeout(timeout);
  }, [noteSnapshot, note, syncNoteWithFirestore, startSyncing]);

  const handleTextChange = useCallback(
    (name, value) => {
      onEdit(note.clientId, { ...note, [name]: value });
    },
    [onEdit, note]
  );

  const setDropdownMenuStatus = useCallback((name, isOpen) => {
    setShowDropdown((previousValue) => ({
      ...previousValue,
      [name]: isOpen,
    }));
  }, []);

  const handleSelectTag = (tag) => {
    onEdit(note.clientId, { ...note, tag });
  };

  const handleClearTag = (e) => {
    e.stopPropagation();
    onEdit(note.clientId, { ...note, tag: "" });
  };

  const handleSelectColour = (colourString) => {
    onEdit(note.clientId, { ...note, colour: colourString });
  };

  // On mouse down set initial mouse location data
  const handleMouseDown = (e) => {
    if (e.button === 2) return;

    const { x: noteX, y: noteY } = e.target.getBoundingClientRect();
    const { x: containerX, y: containerY } = document
      .getElementsByClassName("note-masonry-wrapper")[0]
      .getBoundingClientRect();
    const xStart = e.pageX;
    const yStart = e.pageY;
    const xOffset = e.pageX - noteX;
    const yOffset = e.pageY - noteY;
    const mouseDeltaThreshold = 6;
    let dragging = false;

    const handleMouseMove = (e) => {
      const deltaX = Math.abs(e.pageX - xStart);
      const deltaY = Math.abs(e.pageY - yStart);

      // Determine if we're dragging or not
      if (
        !dragging &&
        (deltaX > mouseDeltaThreshold || deltaY > mouseDeltaThreshold)
      ) {
        dragging = true;
        noteRef.current.classList.toggle("dragging", true);
      }

      // Determine if we're either just clicking on or dragging the note based on movement delta
      if (dragging) {
        noteRef.current.style.transform = `translate(${
          e.pageX - xOffset - containerX - 1
        }px, ${e.pageY - yOffset - containerY - 1}px)`;

        onNoteDrag(note.clientId, e.pageX, e.pageY);
      }
    };

    const handleMouseUp = (e) => {
      e.preventDefault();

      // If it didn't count as a drag, set focus, otherwise update the new note positions if they've changed
      if (!dragging) {
        setIsActive(true);
      } else {
        onNoteDrag(note.clientId, e.pageX, e.pageY, true);
      }

      noteRef.current.classList.toggle("dragging", false);

      // Remove listeners
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    // Attach mouse move and mouse up event listeners to the document if the mouse is down on a note
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="note"
      style={{
        background: `rgba(var(--${note.colour}), 0.1)`,
        border: `1px solid rgba(var(--${note.colour}), 0.5)`,
        zIndex: zIndex,
      }}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      ref={noteRef}
    >
      <div
        className={`${styles.noteScreen} ${isActive ? styles.hidden : ""} ${
          deviceIsTouchScreen ? styles.overlay : ""
        }`}
        onMouseDown={handleMouseDown}
      ></div>
      <div className={styles.editNote}>
        <NoteText
          title={note.title}
          content={note.content}
          extendContentArea={false}
          showTitle={isActive || note.title}
          showContent={
            isActive || note.content || (!note.title && !note.content)
          }
          onTextChange={handleTextChange}
          forceFocus={isActive}
        />
      </div>
      <NoteTag tagName={note.tag} />
      <UtilityContainer
        show={
          mouseOver ||
          showDropdown.colour ||
          showDropdown.tag ||
          showDropdown.delete ||
          isActive
        }
      >
        <UtilityDropdown
          name="tag"
          icon="tag"
          setDropdownMenuStatus={setDropdownMenuStatus}
          width="20rem"
        >
          <TagSelector
            tags={tags}
            activeTag={note.tag}
            onSelectTag={handleSelectTag}
            onClearTag={handleClearTag}
          />
        </UtilityDropdown>
        <UtilityDropdown
          name="colour"
          icon="colour"
          setDropdownMenuStatus={setDropdownMenuStatus}
        >
          <ColourSelector handleSelectColour={handleSelectColour} />
        </UtilityDropdown>
        <UtilityDropdown
          name="delete"
          icon="trash"
          setDropdownMenuStatus={setDropdownMenuStatus}
        >
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(note.clientId, note.documentId)}
          >
            Delete note
          </button>
        </UtilityDropdown>
      </UtilityContainer>
    </div>
  );
}
