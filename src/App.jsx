import { useState, useEffect } from "react";
import NotePreview from "./NotePreview";
import AddNoteButton from "./AddNoteButton";
import NoteModal from "./NoteModal";
import DeleteMessage from "./DeleteMessage"

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteInfo, setdeleteInfo] = useState({
    isOpen: false,
    index: -1,
    title: ""
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (note) => {
    setNotes([note, ...notes]);
    setIsModalOpen(false);
  };

  const onDelete = (index, title) => {
    const newDeleteInfo = {
      isOpen: true,
      index: index,
      title: title
    }
    setdeleteInfo(newDeleteInfo)
  }

  const onConfirm = () => {
    const index = deleteInfo.index
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
    onCancel()
  }

  const onCancel = () => {
    const newDeleteInfo = {
      isOpen: false,
      index: -1,
      title: ""
    }
    setdeleteInfo(newDeleteInfo)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-6">Notas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AddNoteButton onClick={() => setIsModalOpen(true)} />

        {notes.map((note, index) => (
          <NotePreview
            key={index}
            index={index}
            title={note.title}
            content={note.content}
            date={note.date}
            onDelete={onDelete}
          />
        ))}
      </div>

      {isModalOpen && (
        <NoteModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddNote}
        />
      )}

      {deleteInfo.isOpen && (
        <DeleteMessage 
          onConfirm={onConfirm}
          onCancel={onCancel}
          title={deleteInfo.title}
        />
      )}

    </div>
  );
}
