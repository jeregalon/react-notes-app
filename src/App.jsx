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

  const initialModalInfo = { 
    isOpen: false, 
    id: null, 
    title: "", 
    content: "" 
  };

  const initialDeleteInfo = { 
    isOpen: false, 
    id: null, 
    title: "" 
  };

  const [modalInfo, setModalInfo] = useState(initialModalInfo);
  const [deleteInfo, setDeleteInfo] = useState(initialDeleteInfo);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

// Funciones de NoteModal
  const handleOnSave = (note) => {
    const noteExists = notes.some(n => n.id === note.id);
    if (noteExists) {
      setNotes(notes.map(n => n.id === note.id ? note : n));
    } else {
      setNotes([note, ...notes]);
    }
    onClose()
  };

  const onClose = () => {
    setModalInfo(initialModalInfo)
  }

// Funciones de NotePreview
  const onDelete = (id, title) => {
    const newDeleteInfo = {
      isOpen: true,
      id: id,
      title: title
    }
    setDeleteInfo(newDeleteInfo)
  }

  const onEdit = (id, title, content) => {
    const newModalInfo = {
      isOpen: true,
      id: id,
      title: title,
      content: content
    }
    setModalInfo(newModalInfo);
  }

// Funciones de DeleteMessage
  const onConfirm = () => {
    const newNotes = notes.filter(note => note.id !== deleteInfo.id);
    setNotes(newNotes);
    onCancel()
  }

  const onCancel = () => {
    setDeleteInfo(initialDeleteInfo)
  }

// Funciones de AddNoteButton
  const onAddNote = () => {
    const newModalInfo = {
      isOpen: true,
      id: null,
      title: "",
      content: ""
    }
    setModalInfo(newModalInfo)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-6">Notas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AddNoteButton onClick={onAddNote} />

        {[...notes]
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // más recientes primero
          .map((note) => (
            <NotePreview
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              date={note.date}
              onDelete={onDelete}
              onEdit={onEdit}
            />
        ))}
      </div>

      {modalInfo.isOpen && (
        <NoteModal
          id={modalInfo.id}
          onClose={onClose}
          onSave={handleOnSave}
          initialTitle={modalInfo.title}
          initialContent={modalInfo.content}
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
