import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import Note from "../Note/Note";
import styles from "./NoteBoard.module.css";

export default function NoteBoard({
  notes,
  onEdit,
  syncNoteWithFirestore,
  onDelete,
  updateNotePositions,
  startSyncing,
}) {
  const wrapperRef = useRef(null);
  const columnWidth = 352;
  const gutter = 20;
  const [columnCount, setColumnCount] = useState(1);
  const [displayHeight, setDisplayHeight] = useState(0);
  const notePositions = notes.map((note) => note.clientId);

  // Determine the number of columns we can fit on resize
  useLayoutEffect(() => {
    // We need a debouncer as the resize event fires rapidly
    const debounce = (func) => {
      let timer;
      return (event) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 100, event);
      };
    };

    const handleResize = () => {
      const noteBoardWidth = wrapperRef.current.parentElement.offsetWidth;

      let newColumnCount = Math.floor(
        (noteBoardWidth + gutter) / (columnWidth + gutter)
      );
      newColumnCount = newColumnCount === 0 ? 1 : newColumnCount;
      setColumnCount(newColumnCount);
    };

    handleResize();

    window.addEventListener("resize", debounce(handleResize));

    return () => window.removeEventListener("resize", debounce(handleResize));
  }, []);

  // Custom masonry sorting algorithm using absolute positioning
  const arrangeNotes = useCallback(() => {
    const notes = document.getElementsByClassName("note");
    const columnHeights = [];

    for (let i = 0; i < notes.length; i++) {
      if (i < columnCount) {
        // Move note to top row and add a new column record in the column heights array with the height of the note
        notes[i].style.transform = `translate(${
          columnWidth * i + gutter * i
        }px, 0px)`;
        columnHeights.push(notes[i].offsetHeight);
      } else {
        // Decide note location based on minimum column height
        const minColumnHeight = Math.min(...columnHeights);
        const columnIndex = columnHeights.indexOf(minColumnHeight);
        notes[i].style.transform = `translate(${
          columnWidth * columnIndex + gutter * columnIndex
        }px, ${minColumnHeight + gutter}px)`;
        columnHeights[columnIndex] += notes[i].offsetHeight + gutter;
      }
    }

    setDisplayHeight(Math.max(...columnHeights));
  }, [columnCount]);

  // Rearrange notes when column count changes
  useLayoutEffect(() => {
    arrangeNotes();
  }, [arrangeNotes, columnCount]);

  // Unholy custom note dragging algorithm - masonry sorting in real-time as note is being moved
  const handleNoteDrag = useCallback(
    (clientId, x, y, updatePositions = false) => {
      const notes = document.getElementsByClassName("note");
      const targetNote = document.getElementsByClassName("dragging")[0];
      const columnHeights = [];
      const { x: containerX, y: containerY } =
        wrapperRef.current.getBoundingClientRect();
      let offset = 0;
      let gap = 0;
      let newPositionIndex = notePositions.indexOf(clientId);
      let moveTargetToEnd = true;

      const scrollY = window.scrollY;

      // Loop through the notes and determine their new locations
      for (let i = 0; i < notes.length; i++) {
        if (!notes[i].classList.contains("dragging")) {
          if (i + offset - gap < columnCount) {
            // Determine if this note is at the position where our cursor is (if so, this is the offset point)
            if (
              containerX +
                columnWidth * (i - gap) +
                gutter * (i - gap) +
                columnWidth >=
                x &&
              containerX +
                columnWidth * (i - gap) +
                gutter * (i - gap) -
                gutter <=
                x &&
              containerY + notes[i].offsetHeight + scrollY >= y &&
              containerY + scrollY <= y
            ) {
              // We found where the cursor is, set the offset flag, set the new position of the note being dragged and add its height to the column heights array
              columnHeights.push(targetNote.offsetHeight);
              offset = 1;
              newPositionIndex = i - gap;
              moveTargetToEnd = false;

              // Taking into account the offset and potential gap, check if the note will still fit in the top row
              if (i + offset - gap < columnCount) {
                // Note can sit in the top row
                notes[i].style.transform = `translate(${
                  columnWidth * (i + offset - gap) + gutter * (i + offset - gap)
                }px, 0px)`;
                columnHeights.push(notes[i].offsetHeight);
              } else {
                // Top row full, decide note location based on minimum column height and update the height for that column
                const minColumnHeight = Math.min(...columnHeights);
                const columnIndex = columnHeights.indexOf(minColumnHeight);
                notes[i].style.transform = `translate(${
                  columnWidth * columnIndex + gutter * columnIndex
                }px, ${minColumnHeight + gutter}px)`;
                columnHeights[columnIndex] += notes[i].offsetHeight + gutter;
              }
            } else {
              // Move note to top row and add a new column record in the column heights array with the height of the note
              notes[i].style.transform = `translate(${
                columnWidth * (i + offset - gap) + gutter * (i + offset - gap)
              }px, 0px)`;
              columnHeights.push(notes[i].offsetHeight);
            }
          } else {
            // Note wont fit in top row, check if cursor is currently at location where we'd normally put this note
            let minColumnHeight = Math.min(...columnHeights);
            let columnIndex = columnHeights.indexOf(minColumnHeight);
            if (
              containerX +
                columnWidth * columnIndex +
                gutter * columnIndex +
                columnWidth >=
                x &&
              containerX +
                columnWidth * columnIndex +
                gutter * columnIndex -
                gutter <=
                x &&
              containerY +
                minColumnHeight +
                notes[i].offsetHeight +
                gutter +
                scrollY >=
                y &&
              containerY + minColumnHeight + scrollY <= y
            ) {
              // We found where the cursor is, set the new position of the note being dragged and add its height to the column heights array
              newPositionIndex = i - gap;
              moveTargetToEnd = false;
              columnHeights[columnIndex] += targetNote.offsetHeight + gutter;
              minColumnHeight = Math.min(...columnHeights);
              columnIndex = columnHeights.indexOf(minColumnHeight);

              // Decide note location based on minimum column height and update the height for that column
              notes[i].style.transform = `translate(${
                columnWidth * columnIndex + gutter * columnIndex
              }px, ${minColumnHeight + gutter}px)`;
              columnHeights[columnIndex] += notes[i].offsetHeight + gutter;
            } else {
              // Decide note location based on minimum column height and update the height for that column
              notes[i].style.transform = `translate(${
                columnWidth * columnIndex + gutter * columnIndex
              }px, ${minColumnHeight + gutter}px)`;
              columnHeights[columnIndex] += notes[i].offsetHeight + gutter;
            }
          }
        } else {
          // We found the note being dragged, set the gap flag
          gap = 1;
        }
      }

      // If the note was dragged outside of the note area move it to the end
      if (moveTargetToEnd) newPositionIndex = notes.length - 1;

      if (updatePositions) {
        const newPositions = notePositions;
        const index = newPositions.indexOf(clientId);
        newPositions.splice(index, 1);
        newPositions.splice(newPositionIndex, 0, clientId);
        updateNotePositions(notePositions);
      }
    },
    [columnCount, notePositions, updateNotePositions]
  );

  return (
    <div className={styles.noteBoardWrapper}>
      <div className={styles.noteBoard}>
        <div
          className="note-masonry-wrapper"
          style={{
            width: `${columnCount * (columnWidth + gutter) - gutter}px`,
            height: `${displayHeight}px`,
          }}
          ref={wrapperRef}
        >
          {notes.map((note) => {
            return (
              <Note
                key={note.clientId}
                note={note}
                onEdit={onEdit}
                onDelete={onDelete}
                startSyncing={startSyncing}
                syncNoteWithFirestore={syncNoteWithFirestore}
                tags={[
                  ...new Set(
                    notes.map((note) => note.tag).filter((tag) => tag !== "")
                  ),
                ]}
                arrangeNotes={arrangeNotes}
                onNoteDrag={handleNoteDrag}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
