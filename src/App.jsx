import { useState, useEffect } from "react";
import NotePreview from "./NotePreview";
import AddNoteButton from "./AddNoteButton";
import NoteModal from "./NoteModal";

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (note) => {
    setNotes([note, ...notes]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-6">Notas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AddNoteButton onClick={() => setIsModalOpen(true)} />

        {notes.map((note, index) => (
          <NotePreview
            key={index}
            title={note.title}
            content={note.content}
            date={note.date}
          />
        ))}
      </div>

      {isModalOpen && (
        <NoteModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddNote}
        />
      )}
    </div>
  );
}
