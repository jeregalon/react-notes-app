import { useState } from "react";

export default function NoteModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAction = () => {
    if (!title.trim() && !content.trim()) {
      onClose();
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        title: title || "Sin título",
        content: content || "Sin contenido",
        date: new Date().toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
        }),
      };
      onSave(newNote);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-neutral-900 w-[600px] h-[400px] rounded-3xl p-6 relative flex flex-col">
        <button
          onClick={handleAction}
          className="absolute top-4 right-4 text-2xl cursor-pointer"
        >
          {!title.trim() && !content.trim() ? "✖" : "✔"}
        </button>

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent text-3xl font-bold mb-4 outline-none"
        />

        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-transparent flex-1 resize-none outline-none text-lg"
        />
      </div>
    </div>
  );
}
