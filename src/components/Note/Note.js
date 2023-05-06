import React, { useEffect, useRef, useState } from "react";
import ColourSelector from "../ColourSelector/ColourSelector";
import NoteTag from "../NoteTag/NoteTag";
import NoteText from "../NoteText/NoteText";
import TagSelector from "../TagSelector/TagSelector";
import UtilityContainer from "../UtilityContainer/UtilityContainer";
import UtilityDropdown from "../UtilityDropdown/UtilityDropdown";
import "./Note.css";

function Note(props) {
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
    title: props.note.title,
    content: props.note.content,
    colour: props.note.colour,
    tag: props.note.tag,
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
    props.arrangeNotes();
  }, [isActive, props]);

  useEffect(() => {
    let timeout;
    let shouldUpdate = false;

    Object.keys(noteSnapshot).forEach((key) => {
      shouldUpdate = shouldUpdate || props.note[key] !== noteSnapshot[key];
    });

    function syncNoteUpdates() {
      setNoteSnapshot((previousValue) => ({
        ...previousValue,
        title: props.note.title,
        content: props.note.content,
        colour: props.note.colour,
        tag: props.note.tag,
      }));
      props.syncNoteWithFirestore(props.note);
    }

    // Debounce update calls to Firestore database
    if (shouldUpdate) {
      props.startSyncing();
      timeout = setTimeout(syncNoteUpdates, 2000);
    }

    return () => clearTimeout(timeout);
  }, [noteSnapshot, props]);

  useEffect(() => {
    function handleMouseMove(e) {
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
        props.onNoteDrag(props.note.clientId, e.pageX, e.pageY);
        setMouseDragData((previousValue) => ({
          ...previousValue,
          dragging: true,
        }));
      }
    }

    function handleMouseUp(e) {
      e.preventDefault();

      if (e.changedTouches && e.changedTouches.length) {
        e = e.changedTouches[0];
      }

      // If it didn't count as a drag, set focus, otherwise tell the parent to update the new note positions if they changed
      if (!mouseDragData.dragging) {
        setIsActive(true);
      } else {
        props.onNoteDrag(props.note.clientId, e.pageX, e.pageY, true);
      }

      setMouseDragData((previousValue) => ({
        ...previousValue,
        down: false,
        dragging: false,
      }));
    }

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
    props,
  ]);

  function handleNoteBlur(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;

    setIsActive(false);
  }

  function handleTextChange(name, value) {
    props.onEdit(props.note.clientId, { ...props.note, [name]: value });
  }

  function setDropdownMenuStatus(name, isOpen) {
    setShowDropdown((previousValue) => ({
      ...previousValue,
      [name]: isOpen,
    }));
  }

  function handleSelectTag(tag) {
    props.onEdit(props.note.clientId, { ...props.note, tag });
  }

  function handleClearTag(e) {
    e.stopPropagation();
    props.onEdit(props.note.clientId, { ...props.note, tag: "" });
  }

  function handleSelectColour(colourString) {
    props.onEdit(props.note.clientId, { ...props.note, colour: colourString });
  }

  // On mouse down set initial mouse location data
  function handleMouseDown(e) {
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
  }

  return (
    <div
      className={`note ${mouseDragData.down ? "dragging" : ""}`}
      style={{
        border: `1px solid var(--${props.note.colour})`,
        zIndex: zIndex,
        transition: mouseDragData.down ? "none" : "all 0.2s linear",
      }}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onBlur={handleNoteBlur}
      ref={noteRef}
    >
      <div
        className={`note-screen ${isActive ? "hidden" : ""} ${
          isTouchScreen ? "overlay" : ""
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      ></div>
      <div tabIndex="-1" className="edit-note">
        <NoteText
          title={props.note.title}
          content={props.note.content}
          extendContentArea={false}
          showTitle={isActive || props.note.title}
          showContent={
            isActive ||
            props.note.content ||
            (!props.note.title && !props.note.content)
          }
          onTextChange={handleTextChange}
          forceFocus={isActive}
        />
      </div>
      <NoteTag tagName={props.note.tag} />
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
        >
          <TagSelector
            tags={props.tags}
            activeTag={props.note.tag}
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
            className="delete-button"
            onClick={() =>
              props.onDelete(props.note.clientId, props.note.documentId)
            }
          >
            Delete note
          </button>
        </UtilityDropdown>
      </UtilityContainer>
    </div>
  );
}

export default Note;
