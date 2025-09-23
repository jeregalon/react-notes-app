import { useState, useRef, useEffect, useCallback } from "react";
import { NO_TITLE_MESSAGE } from "./constants";

export default function useFolders({ folder, onEdit, onDelete, onAddNote, onAddFolder, onOpen }) {
  
  const [name, setName] = useState(() => (folder?.title));
  const [onEditMode, setOnEditMode] = useState(() => (!folder?.title)); // true si NO tiene title (carpeta nueva)

  const titleInputRef = useRef(null);

  useEffect(() => {
    setName(folder?.title ?? null);
    setOnEditMode(!folder?.title);
  }, [folder?.id, folder?.title]); // <- solo cuando cambia el id de la carpeta

  // focus automático cuando entra en edición
  useEffect(() => {
    if (onEditMode) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [onEditMode]);

  // guardar cambios: normalizamos el nombre y solo llamamos onEdit si hubo cambio
  const handleSave = useCallback(() => {
    const finalName = (!name || name.trim() === "") ? "Nueva carpeta" : name;
    if (finalName !== folder.title) {
      const updatedFolder = {
        ...folder,
        title: finalName,
        date: new Date().toISOString(),
      };
      onEdit(updatedFolder);
    }
    setName(finalName);      // asegurar que no quede null
    setOnEditMode(false);
  }, [name, folder, onEdit]);

  // clic fuera => guardar
  useEffect(() => {
    function handleClickOutside(e) {
      if (onEditMode && titleInputRef.current && !titleInputRef.current.contains(e.target)) {
        handleSave();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onEditMode, handleSave]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    onDelete(folder.id, name, "folder");
  }, [folder.id, name, onDelete]);

  const handleAddNote = useCallback((e) => {
    e.stopPropagation();
    onAddNote(folder.id);
  }, [folder.id, onAddNote]);

  const handleAddFolder = useCallback((e) => {
    e.stopPropagation();
    onAddFolder(folder.id);
  }, [folder.id, onAddFolder]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setOnEditMode(false);
      setName(folder.title ?? null); // revertir a title original
    }
  }, [handleSave, folder.title]);

  const handleOpen = useCallback(() => {
    onOpen(folder.id);
  }, [folder.id, onOpen]);

  return {
    name,
    setName,
    onEditMode,
    setOnEditMode,
    titleInputRef,
    handleSave,
    handleDelete,
    handleAddNote,
    handleAddFolder,
    handleKeyDown,
    handleOpen,
  };
}
