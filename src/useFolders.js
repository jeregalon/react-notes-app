import { useState, useRef, useEffect, useCallback } from "react";
import { NO_TITLE_MESSAGE, TYPES } from "./constants";

export default function useFolders({ folder, onEdit, onDelete, onAddNote, onOpen }) {
  const [name, setName] = useState(folder.title || NO_TITLE_MESSAGE);
  const [onEditMode, setOnEditMode] = useState(false);

  const titleInputRef = useRef(null);

  // focus automático al entrar en edición
  useEffect(() => {
    if (onEditMode) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [onEditMode]);

  // guardar cambios
  const handleSave = useCallback(() => {
    if (name !== folder.title) {
      const updatedFolder = {
        ...folder,
        title: name,
        date: new Date().toISOString(),
      };
      onEdit(updatedFolder);
    }
    setOnEditMode(false);
  }, [name, folder, onEdit]);

  // clic fuera del input => guardar
  useEffect(() => {
    function handleClickOutside(e) {
      if (onEditMode && titleInputRef.current && !titleInputRef.current.contains(e.target)) {
        handleSave();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onEditMode, handleSave]);

  // eliminar carpeta
  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      onDelete(folder.id, name, TYPES.FOLDER);
    },
    [folder.id, name, onDelete]
  );

  // agregar nota
  const handleAddNote = useCallback(
    (e) => {
      e.stopPropagation();
      onAddNote(folder.id);
    },
    [folder.id, onAddNote]
  );

  // enter => guardar, escape => cancelar edición
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        setOnEditMode(false);
        setName(folder.title || NO_TITLE_MESSAGE); // revertir cambios
      }
    },
    [handleSave, folder.title]
  );

  // abrir carpeta
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
    handleKeyDown,
    handleOpen,
  };
}
