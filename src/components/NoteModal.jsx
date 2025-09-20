import { useState, useRef, useEffect } from "react";
import { TYPES } from '../constants'

export default function NoteModal({ id, onClose, onSave, initialTitle = "", initialContent = "", folderId = null }) {
  const MAX_TITLE_LENGTH = 50;
  const MAX_CONTENT_LENGTH = 1000;
  
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const titleInputRef = useRef(null);

  const noTitleMessage = "Nota sin título"
  const noContentMessage = "Sin contenido"

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleAction = () => {
    if (!title.trim() && !content.trim()) {
      onClose();
    } else {
      const now = new Date()
      const newNote = {
        id: id ? id : crypto.randomUUID(),
        title: (title || noTitleMessage).slice(0, MAX_TITLE_LENGTH),
        content: (content || noContentMessage).slice(0, MAX_CONTENT_LENGTH),
        date: now.toISOString(),
        folderId: folderId,
        type: TYPES.NOTE
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
          value={title === noTitleMessage ? "" : title}
          ref={titleInputRef}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent text-3xl font-bold mb-4 outline-none"
        />

        <textarea
          placeholder="Contenido"
          value={content === noContentMessage ? "" : content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-transparent flex-1 resize-none outline-none text-lg"
        />
      </div>
    </div>
  );
}
