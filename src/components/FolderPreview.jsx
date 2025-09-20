import { Folder, Trash2, Edit2, Check } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react";
import NotePreview from "./NotePreview";
import { TYPES } from "../constants";

export default function FolderPreview({ id, date, title, notes=[], onDelete, onAddNote, onEdit }) {
  
  const noTitleMessage = "Carpeta sin título"

  const [name, setName] = useState(title || noTitleMessage)
  const [onEditMode, setOnEditMode] = useState(false)

  const icon = onEditMode ? <Check size={18} /> : <Edit2 size={18} />

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (onEditMode) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [onEditMode]);
  
  function handleDelete() {
    onDelete(id, name, TYPES.FOLDER)
  }

  const handleSave = useCallback(() => {
    if (name !== title) {
      const updatedFolder = {
        id,
        title: name,
        date: new Date().toISOString(),
      };
      onEdit(updatedFolder);
    }
    setOnEditMode(false);
  }, [id, name, title, onEdit]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (onEditMode && titleInputRef.current && !titleInputRef.current.contains(e.target)) {
        handleSave();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onEditMode, handleSave]);

  function handleClick() {
    onAddNote(id)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSave(); // Guardar al presionar Enter
    } else if (e.key === 'Escape') {
      setOnEditMode(false); // Cancelar al presionar Escape
    }
  }
    
  return (
    <div className="bg-neutral-800 rounded-lg p-4 shadow-md min-h-[220px] hover:shadow-lg transition flex flex-col relative">
      <div className="flex items-center mb-2">
        <Folder size={32} className="text-yellow-400 mr-2 shrink-0" />
        <div className="flex-1 pr-16">
          <input 
            className="font-bold text-lg truncate outline-none text-yellow-400 w-full"
            type="text"
            placeholder={noTitleMessage}
            value={
              name === noTitleMessage
              ? ""
              : (name ?? "")
            }
            ref={titleInputRef}
            onChange={
              (e) => {
                const currentText = e.target.value
                const newName = 
                  currentText === "" 
                  ? noTitleMessage
                  : currentText.slice(0, 50)
                setName(newName)
              }
            }
            onKeyDown={handleKeyDown}
            readOnly={!onEditMode}
          />
        </div>
        <button
            onClick={onEditMode ? handleSave : () => setOnEditMode(true)}
            className="absolute top-3 right-10 p-2 text-gray-400 hover:text-green-500 transition cursor-pointer transform transition duration-200 hover:scale-105">
            {icon}
        </button>
        <button 
          onClick={handleDelete}
          disabled={onEditMode}
          className={`absolute top-3 right-3 p-2 transition cursor-pointer transform duration-200 hover:scale-105 
            ${onEditMode 
              ? "text-gray-600 cursor-not-allowed"   // gris apagado
              : "text-gray-400 hover:text-red-500"}`
          }>
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1">
        <button 
          onClick={handleClick}
          className="bg-neutral-700 rounded-lg flex items-center justify-center text-6xl font-bold p-8 text-white transition cursor-pointer transition transform active:scale-95 duration-150 ease-in-out">
          +
        </button>

        {notes.map((note) => (
          <div key={note.id} className="bg-neutral-700 rounded-lg p-2 overflow-hidden">
            <h3 className="font-bold text-sm truncate">{note.title}</h3>
            <p className="text-xs text-gray-300 truncate">{note.content}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-auto">
        {new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
      </p>
    </div>
  );
}