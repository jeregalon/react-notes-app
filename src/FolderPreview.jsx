import { Folder, Trash2, Edit2, Check } from "lucide-react"
import { useEffect, useState, useRef } from "react";

export default function FolderPreview({ id, date, onDelete, onEdit }) {
  
  const [name, setName] = useState("Nueva carpeta")
  const [onEditMode, setOnEditMode] = useState(false)

  const icon = onEditMode ? <Check size={18} /> : <Edit2 size={18} />

  const titleInputRef = useRef(null);

  useEffect(() => {
    if (onEditMode) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [onEditMode]);

  function handleClick() {
    // onDelete(id, name)
  }

  function handleEdit() {
    if (onEditMode) {
      // onEdit(id, name);
    }
    setOnEditMode(!onEditMode)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleEdit(); // Guardar al presionar Enter
    } else if (e.key === 'Escape') {
      setOnEditMode(false); // Cancelar al presionar Escape
    }
  }

  function handleClick() {
    // onDelete(id, name)
  }

  function handleEdit() {
    setOnEditMode(!onEditMode)
  }
  
  return (
    <div className="bg-neutral-800 rounded-lg p-4 shadow-md min-h-[220px] hover:shadow-lg transition flex flex-col relative">
      <div className="flex items-center mb-2">
        <Folder size={32} className="text-yellow-400 mr-2" />
        <input 
        className="font-bold text-lg truncate outline-none"
          type="text"
          placeholder="Título"
          value={name}
          ref={titleInputRef}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={!onEditMode}
        />
        <button
            onClick={handleEdit}
            className="absolute top-3 right-10 p-2 text-gray-400 hover:text-green-500 transition cursor-pointer transform transition duration-200 hover:scale-105">
            {icon}
        </button>
      </div>

      <button 
        onClick={handleClick} 
        className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 transition cursor-pointer transform transition duration-200 hover:scale-105">
        <Trash2 size={18} />
      </button>
      <p className="text-xs text-gray-400 mt-auto">
        {new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
      </p>
    </div>
  );
}