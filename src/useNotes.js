import { useState, useEffect, useCallback } from "react";
import { TYPES } from "./constants";

export default function useNotes() {
  // --- Estados principales ---
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem("folders");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistencia ---
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  // --- Funciones ---
  const editFolder = useCallback((updatedFolder) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === updatedFolder.id ? { ...f, ...updatedFolder } : f
      )
    );
  }, []);
  
  const addNote = useCallback((note) => {
    const exists = notes.some(n => n.id === note.id);
    if (exists) {
      setNotes(notes.map(n => (n.id === note.id ? note : n)));
    } else {
      setNotes([note, ...notes]);
    }

    if (note.folderId) {
      const folder = folders.find(f => f.id === note.folderId);
      if (folder) {
        editFolder({
          ...folder,
          date: new Date().toISOString(),
        });
      }
    }
  }, [notes, folders, editFolder]);

  const deleteItem = useCallback((id, type) => {
    if (type === TYPES.NOTE) {
      setNotes((prev) => prev.filter(note => note.id !== id));
    } else if (type === TYPES.FOLDER) {
      setNotes((prev) => prev.filter(note => note.folderId !== id));
      setFolders((prev) => prev.filter(folder => folder.id !== id));
    }
  }, []);

  const addFolder = useCallback(() => {
    const now = new Date();
    const newFolder = {
      id: crypto.randomUUID(),
      title: "Nueva carpeta",
      date: now.toISOString(),
      type: TYPES.FOLDER,
    };
    setFolders((prev) => [newFolder, ...prev]);
  }, []);

  return {
    notes,
    folders,
    addNote,
    deleteItem,
    addFolder,
    editFolder,
  };
}
