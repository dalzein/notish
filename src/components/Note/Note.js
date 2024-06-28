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
  const isTouchScreen =
    "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0;
  const [mouseOver, setMouseOver] = useState(false);
  const [showDropdown, setShowDropdown] = useState({
    colour: false,
    tag: false,
    delete: false,
  });
  const [isActive, setIsActive] = useState(false);
  const [mouseDragData, setMouseDragData] = useState({
    xStart: 0,
    yStart: 0,
    xOffset: 0,
    yOffset: 0,
    down: false,
    containerX: 0,
    containerY: 0,
    dragging: false,
    mouseDeltaThreshold: 6,
  });
  const [noteSnapshot, setNoteSnapshot] = useState({
    title: note.title,
    content: note.content,
    colour: note.colour,
    tag: note.tag,
  });

  // Bring note forward if it's in focus
  const zIndex =
    isActive ||
    showDropdown.colour ||
    showDropdown.tag ||
    showDropdown.delete ||
    mouseDragData.down
      ? 1000
      : 1;

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.changedTouches && e.changedTouches.length) {
        e = e.changedTouches[0];
      }

      const deltaX = Math.abs(e.pageX - mouseDragData.xStart);
      const deltaY = Math.abs(e.pageY - mouseDragData.yStart);

      // Determine if we're either just clicking on or dragging the note based on movement delta
      if (
        deltaX > mouseDragData.mouseDeltaThreshold ||
        deltaY > mouseDragData.mouseDeltaThreshold ||
        mouseDragData.dragging
      ) {
        noteRef.current.style.transform = `translate(${
          e.pageX - mouseDragData.xOffset - mouseDragData.containerX - 1
        }px, ${
          e.pageY - mouseDragData.yOffset - mouseDragData.containerY - 1
        }px)`;
        onNoteDrag(note.clientId, e.pageX, e.pageY);
        setMouseDragData((previousValue) => ({
          ...previousValue,
          dragging: true,
        }));
      }
    };

    const handleMouseUp = (e) => {
      e.preventDefault();

      if (e.changedTouches && e.changedTouches.length) {
        e = e.changedTouches[0];
      }

      // If it didn't count as a drag, set focus, otherwise tell the parent to update the new note positions if they changed
      if (!mouseDragData.dragging) {
        setIsActive(true);
      } else {
        onNoteDrag(note.clientId, e.pageX, e.pageY, true);
      }

      setMouseDragData((previousValue) => ({
        ...previousValue,
        down: false,
        dragging: false,
      }));
    };

    // Attach mouse move and mouse up event listeners to the document if the mouse is down on a note
    if (mouseDragData.down) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [
    mouseDragData.containerX,
    mouseDragData.containerY,
    mouseDragData.down,
    mouseDragData.dragging,
    mouseDragData.mouseDeltaThreshold,
    mouseDragData.xOffset,
    mouseDragData.xStart,
    mouseDragData.yOffset,
    mouseDragData.yStart,
    note.clientId,
    onNoteDrag,
  ]);

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

    // Mobile and touch devices use e.changedTouches
    if (e.changedTouches && e.changedTouches.length) {
      e = e.changedTouches[0];
    }

    const { x: noteX, y: noteY } = e.target.getBoundingClientRect();
    const { x: containerX, y: containerY } = document
      .getElementsByClassName("note-masonry-wrapper")[0]
      .getBoundingClientRect();
    setMouseDragData((previousValue) => ({
      ...previousValue,
      containerX,
      containerY,
      xStart: e.pageX,
      yStart: e.pageY,
      xOffset: e.pageX - noteX,
      yOffset: e.pageY - noteY,
      down: true,
    }));
  };

  return (
    <div
      className={`note ${mouseDragData.down ? "dragging" : ""}`}
      style={{
        background: `rgba(var(--${note.colour}), 0.1)`,
        border: `1px solid rgba(var(--${note.colour}), 0.5)`,
        zIndex: zIndex,
        transition: mouseDragData.down ? "none" : "all 250ms ease",
      }}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      ref={noteRef}
    >
      <div
        className={`${styles.noteScreen} ${isActive ? styles.hidden : ""} ${
          isTouchScreen ? styles.overlay : ""
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
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
