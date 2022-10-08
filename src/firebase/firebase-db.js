import { db } from "./firebase";
import {
  setDoc,
  doc,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

export const getNotesFromFirestore = async (userId) => {
  const userNotes = { notes: [], notePositions: [] };
  const noteDocuments = await getDocs(collection(db, "users", userId, "notes"));
  userNotes.notes = noteDocuments.docs.map((document) => ({
    documentId: document.id,
    clientId: document.get("clientId"),
    title: document.get("title"),
    content: document.get("content"),
    colour: document.get("colour"),
    tag: document.get("tag"),
  }));

  const userDocument = await getDoc(doc(db, "users", userId));
  userNotes.notePositions = userDocument.get("notePositions");
  return userNotes;
};

export const createNoteInFirestore = (
  userId,
  note,
  shouldUpdateNotePositions = false
) =>
  addDoc(collection(db, "users", userId, "notes"), {
    clientId: note.clientId,
    title: note.title,
    content: note.content,
    colour: note.colour,
    tag: note.tag,
  })
    .then((document) => {
      if (shouldUpdateNotePositions) {
        return getNotePositionsFromFirestore(userId).then(
          (existingNotePositions) =>
            updateNotePositionsInFirestore(userId, [
              note.clientId,
              ...(existingNotePositions ?? []),
            ]).then(() => document.id)
        );
      } else {
        return document.id;
      }
    })
    .catch((error) => {
      console.error(error);
    });

export const createNotesInFirestore = async (userId, notes) => {
  for (const note of notes) {
    await createNoteInFirestore(userId, note);
  }

  const existingNotePositions = await getNotePositionsFromFirestore(userId);
  const newNotePositions = [...notes.map((note) => note.clientId)];

  return updateNotePositionsInFirestore(userId, [
    ...newNotePositions,
    ...(existingNotePositions ?? []),
  ]);
};

export const updateNoteInFirestore = (userId, note) =>
  setDoc(doc(db, "users", userId, "notes", note.documentId), {
    clientId: note.clientId,
    title: note.title,
    content: note.content,
    colour: note.colour,
    tag: note.tag,
  })
    .then(() => note.documentId)
    .catch((error) => {
      console.error(error);
    });

export const deleteNoteFromFirestore = (userId, clientId, documentId) =>
  deleteDoc(doc(db, "users", userId, "notes", documentId))
    .then(() =>
      getNotePositionsFromFirestore(userId).then((existingNotePositions) => {
        const newNotePositions = [...existingNotePositions];
        var index = newNotePositions.indexOf(clientId);
        if (index !== -1) {
          newNotePositions.splice(index, 1);
          return updateNotePositionsInFirestore(userId, newNotePositions);
        }

        return documentId;
      })
    )
    .catch((error) => {
      console.error(error);
    });

export const getNotePositionsFromFirestore = (userId) =>
  getDoc(doc(db, "users", userId)).then((document) =>
    document.get("notePositions")
  );

export const updateNotePositionsInFirestore = (userId, notePositions) =>
  setDoc(
    doc(db, "users", userId),
    {
      notePositions,
    },
    { merge: true }
  ).catch((error) => console.error(error));
