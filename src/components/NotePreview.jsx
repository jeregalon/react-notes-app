import { Trash2, Edit2 } from "lucide-react"
import { TYPES } from "../constants";

export default function NotePreview({ id, title, content, date, onDelete, onEdit }) {
  
  function handleDelete() {
    onDelete(id, title, TYPES.NOTE)
  }

  function handleEdit() {
    onEdit(id, title, content)
  }
  
  return (
    <div className="bg-neutral-800 rounded-lg p-4 shadow-md min-h-[220px] hover:shadow-lg transition flex flex-col relative">
      <button
        onClick={handleEdit}
        className="absolute top-3 right-10 p-2 text-gray-400 hover:text-green-500 transition cursor-pointer transform transition duration-200 hover:scale-105">
        <Edit2 size={18} />
      </button>
      <button 
        onClick={handleDelete} 
        className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-500 transition cursor-pointer transform transition duration-200 hover:scale-105">
        <Trash2 size={18} />
      </button>
      <div className="pr-16"> 
        <h2 className="font-bold text-lg mb-2 truncate">{title}</h2>
      </div>      
      <p className="text-sm text-gray-200 mb-4 line-clamp-6">{content}</p>
      <p className="text-xs text-gray-400 mt-auto">
        {new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
      </p>
    </div>
  );
}
