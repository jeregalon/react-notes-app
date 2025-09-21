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

  const [openedFolder, setOpenedFolder] = useState(null)

  // --- Persistencia ---
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  // --- Funciones ---
  const updateParentDate = useCallback((parentId) => {
    if (parentId) {
      const parent = folders.find(f => f.id === parentId);
      if (parent) {
        parent.date = new Date().toISOString()
        setFolders((prev) =>
        prev.map((f) =>
          f.id === parentId ? { ...f, ...parent } : f
        ))
        if (parent.folderId) updateParentDate(parent.folderId)
      }
    }
  }, [folders])

  const editFolder = useCallback((updatedFolder) => {
    console.log(updatedFolder)
    setFolders((prev) =>
      prev.map((f) =>
        f.id === updatedFolder.id ? { ...f, ...updatedFolder } : f
      )
    );
    updateParentDate(updatedFolder.folderId)
  }, [updateParentDate]);

  const addNote = useCallback((note) => {
    const exists = notes.some(n => n.id === note.id);
    if (exists) {
      setNotes(notes.map(n => (
        n.id === note.id && (n.title != note.title || n.content != note.content) ? note : n
      )));
    } else {
      setNotes([note, ...notes]);
    }

    updateParentDate(note.folderId)
  }, [notes, updateParentDate]);

  const deleteItem = useCallback((id, type) => {
    if (type === TYPES.NOTE) {
      setNotes((prev) => prev.filter(note => note.id !== id));
    } else if (type === TYPES.FOLDER) {
      setNotes((prev) => prev.filter(note => note.folderId !== id));
      setFolders((prev) => prev.filter(folder => folder.id !== id));
    }
  }, []);

  const addFolder = useCallback((folderId) => {
    const now = new Date();
    const newFolder = {
      id: crypto.randomUUID(),
      title: "Nueva carpeta",
      date: now.toISOString(),
      folderId: folderId,
      type: TYPES.FOLDER,
    };
    setFolders((prev) => [newFolder, ...prev]);
    updateParentDate(folderId)
  }, [updateParentDate]);

  // Navegación
  const openFolder = useCallback((folderId) => {
    setOpenedFolder(folderId)
  }, [])

  const onNavigateBack = useCallback(() => {
    if (!openedFolder) return;

    const currentFolder = folders.find(f => f.id === openedFolder);

    if (!currentFolder) {
      setOpenedFolder(null);
      return;
    }

    setOpenedFolder(currentFolder.folderId || null);
  }, [folders, openedFolder])

  return {
    notes,
    folders,
    openedFolder,
    addNote,
    deleteItem,
    addFolder,
    editFolder,
    openFolder,
    onNavigateBack
  };
}
