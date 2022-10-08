import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import CreateArea from "../CreateArea/CreateArea";
import NoteFilter from "../NoteFilter/NoteFilter";
import {
  createNotesInFirestore,
  createNoteInFirestore,
  getNotesFromFirestore,
  updateNoteInFirestore,
  deleteNoteFromFirestore,
  updateNotePositionsInFirestore,
} from "../../firebase/firebase-db";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import NoteBoard from "../NoteBoard/NoteBoard";

function App() {
  const localStorageKey = "localNotes";
  const noteLimit = 20;
  const [userId, setUserId] = useState(null);
  const [notes, setNotes] = useState(
    JSON.parse(window.localStorage.getItem(localStorageKey))?.notes ?? []
  );
  const [tagFilter, setTagFilter] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  // We'll check if a redirected flag was set (we set it before the user is redirected to Google sign in so that on redirect back to the site we know to wait for the auht result)
  const [awaitingAuthRedirectResult, setAwaitingAuthRedirectResult] = useState(
    window.localStorage.getItem("redirected") ?? false
  );

  // If the user is auth'd, sync any local notes with Firestore and fetch everything
  useEffect(() => {
    if (userId) {
      let localNotes = JSON.parse(
        window.localStorage.getItem(localStorageKey)
      )?.notes;
      if (localNotes && localNotes.length > 0) {
        setIsSyncing(true);
        createNotesInFirestore(userId, localNotes).then(() => {
          window.localStorage.removeItem(localStorageKey);
          getNotesFromFirestore(userId).then((userNotes) => {
            const savedNotes = [...userNotes.notes];
            savedNotes.sort(
              (a, b) =>
                userNotes.notePositions.indexOf(a.clientId) -
                userNotes.notePositions.indexOf(b.clientId)
            );
            setNotes(savedNotes);
            setIsSyncing(false);
          });
        });
      } else {
        getNotesFromFirestore(userId).then((userNotes) => {
          const savedNotes = [...userNotes.notes];
          savedNotes.sort(
            (a, b) =>
              userNotes.notePositions.indexOf(a.clientId) -
              userNotes.notePositions.indexOf(b.clientId)
          );
          setNotes(savedNotes);
          setIsSyncing(false);
        });
      }
    } else {
      setNotes(
        JSON.parse(window.localStorage.getItem(localStorageKey))?.notes ?? []
      );
    }
  }, [userId]);

  // If the notes change and the user isn't auth'd, update the notes in localStorage
  useEffect(() => {
    if (!userId) {
      window.localStorage.setItem(localStorageKey, JSON.stringify({ notes }));
    }
  }, [userId, notes]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.removeItem("redirected");
        setUserId(user.uid);
        setAwaitingAuthRedirectResult(false);
      } else {
        setUserId(null);
      }
    });

    // Remove redirected flag from local storage if it's there
    setTimeout(() => {
      localStorage.removeItem("redirected");
      setAwaitingAuthRedirectResult(false);
    }, 5000);
  }, []);

  function addNote(newNote) {
    // Add the note locally
    setNotes((previousValue) => [newNote, ...previousValue]);

    // If the user is auth'd, add the note to Firestore asynchronously
    if (userId) {
      setIsSyncing(true);
      createNoteInFirestore(userId, newNote, true).then((documentId) => {
        setNotes((previousValue) => {
          const newNotes = [...previousValue];
          const index = newNotes.findIndex(
            (note) => note.clientId === newNote.clientId
          );
          newNotes[index] = { ...newNotes[index], documentId };
          return newNotes;
        });
        setIsSyncing(false);
      });
    }
  }

  function deleteNote(clientId, documentId) {
    // Delete the note locally
    setNotes((prevNotes) =>
      prevNotes.filter((noteItem) => noteItem.clientId !== clientId)
    );

    // If the user is auth'd, delete the note from Firestore asynchronously
    if (userId && documentId) {
      setIsSyncing(true);
      deleteNoteFromFirestore(userId, clientId, documentId).then(() => {
        setIsSyncing(false);
      });
    }
  }

  function editNote(clientId, updatedNote) {
    // Update the note locally
    setNotes((previousNotes) => {
      const notes = [...previousNotes];
      const index = notes.findIndex((note) => note.clientId === clientId);
      notes[index] = updatedNote;
      return notes;
    });
  }

  // If the user is auth'd, update the note in Firestore asynchronously
  function syncNoteWithFirestore(updatedNote) {
    if (userId) {
      setIsSyncing(true);
      updateNoteInFirestore(userId, updatedNote).then(() => {
        setIsSyncing(false);
      });
    }
  }

  function changeTagFilter(tag) {
    setTagFilter(tag);
  }

  function updateNotePositions(newNotePositions) {
    // Reorder the notes locally
    setNotes((previousValue) => {
      const newNotes = [...previousValue];
      newNotes.sort(
        (a, b) =>
          newNotePositions.indexOf(a.clientId) -
          newNotePositions.indexOf(b.clientId)
      );
      return newNotes;
    });

    // If the user is auth'd, update position data in Firestore asynchronously
    if (userId) {
      setIsSyncing(true);
      updateNotePositionsInFirestore(userId, newNotePositions).then(() =>
        setIsSyncing(false)
      );
    }
  }

  function startSyncing() {
    setIsSyncing(true);
  }

  return (
    <div>
      <Header
        isSyncing={isSyncing}
        userId={userId}
        awaitingAuthRedirectResult={awaitingAuthRedirectResult}
      />
      <CreateArea
        onAdd={addNote}
        tags={[
          ...new Set(notes.map((note) => note.tag).filter((tag) => tag !== "")),
        ]}
        noteLimitReached={notes.length >= noteLimit}
      />
      <NoteFilter
        tags={[
          ...new Set(notes.map((note) => note.tag).filter((tag) => tag !== "")),
        ]}
        currentTagFilter={tagFilter}
        changeTagFilter={changeTagFilter}
        hasNotes={notes.length > 0}
      />
      <NoteBoard
        notes={notes.filter(
          (note) => tagFilter === "all" || note.tag === tagFilter
        )}
        onEdit={editNote}
        syncNoteWithFirestore={syncNoteWithFirestore}
        onDelete={deleteNote}
        updateNotePositions={updateNotePositions}
        startSyncing={startSyncing}
      />
    </div>
  );
}

export default App;
