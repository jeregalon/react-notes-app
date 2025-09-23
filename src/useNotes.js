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
    setFolders((prev) =>
      prev.map((f) =>
        f.id === updatedFolder.id ? { ...f, ...updatedFolder } : f
      )
    );
    updateParentDate(updatedFolder.folderId)
  }, [updateParentDate]);

  const pinElement = useCallback((id, newPinned, type) => {
    const datePinned = newPinned ? new Date().toISOString() : null;

    if (type === TYPES.NOTE) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, pinned: newPinned, datePinned } : n
        )
      );
    } else if (type === TYPES.FOLDER) {
      setFolders((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, pinned: newPinned, datePinned } : f
        )
      );
    }
  }, []);

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
    setNotes((prevNotes) => {
      const noteToDelete = prevNotes.find(n => n.id === id);
      const filtered = prevNotes.filter(n => n.id !== id);
      if (noteToDelete) updateParentDate(noteToDelete.folderId);
      return filtered;
    });
    return;
  }
  if (type === TYPES.FOLDER) {
    const folderIdsToDelete = new Set();
    const stack = [id];
    while (stack.length) {
      const current = stack.pop();
      if (!folderIdsToDelete.has(current)) {
        folderIdsToDelete.add(current);
        for (const f of folders) {
          if (f.folderId === current && !folderIdsToDelete.has(f.id)) {
            stack.push(f.id);
          }
        }
      }
    }
    setNotes((prevNotes) => prevNotes.filter(n => !folderIdsToDelete.has(n.folderId)));
    setFolders((prevFolders) => prevFolders.filter(f => !folderIdsToDelete.has(f.id)));
    const deletedFolder = folders.find(f => f.id === id);
    if (deletedFolder) {
      updateParentDate(deletedFolder.folderId);
    }
    return;
  }
}, [folders, updateParentDate]);

  const addFolder = useCallback((folderId) => {
    const now = new Date();
    const newFolder = {
      id: crypto.randomUUID(),
      title: null,
      date: now.toISOString(),
      folderId: folderId,
      type: TYPES.FOLDER,
      pinned: false,
      datePinned: null
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

  const deleteArrays = useCallback(() => {
    setFolders([])
    setNotes([])
  }, [])

  return {
    notes,
    folders,
    openedFolder,
    addNote,
    deleteItem,
    addFolder,
    editFolder,
    openFolder,
    onNavigateBack,
    deleteArrays,
    pinElement
  };
}
