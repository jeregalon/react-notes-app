import { useState, useEffect } from "react";
import NotePreview from "./components/NotePreview";
import NoteModal from "./components/NoteModal";
import DeleteMessage from "./components/DeleteMessage"
import { FileText, Folder } from 'lucide-react';
import FolderPreview from "./components/FolderPreview";
import { TYPES } from './constants'

export default function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [folders, setFolders] = useState(() => {
    const saved = localStorage.getItem("folders");
    return saved ? JSON.parse(saved) : [];
  });

  const initialModalInfo = { 
    isOpen: false, 
    id: null, 
    title: "", 
    content: "",
    folderId: null 
  };

  const initialDeleteInfo = { 
    isOpen: false, 
    id: null, 
    title: "",
    type: ""
  };

  const [modalInfo, setModalInfo] = useState(initialModalInfo);
  const [deleteInfo, setDeleteInfo] = useState(initialDeleteInfo);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

// Funciones de NoteModal
  const handleOnSave = (note) => {
    const noteExists = notes.some(n => n.id === note.id);
    if (noteExists) {
      setNotes(notes.map(n => n.id === note.id ? note : n));
    } else {
      setNotes([note, ...notes]);
    }
    if (note.folderId) {  // actualizar también la carpeta donde se crea la nota
      const folder = folders.find(f => f.id === note.folderId);
      if (folder) {
        const updatedFolder = {
          ...folder,
          date: new Date().toISOString(),
        };
        onEditFolder(updatedFolder);
      }
    }
    onClose()
  };

  const onClose = () => {
    setModalInfo(initialModalInfo)
  }

// Funciones de NotePreview
  const onDelete = (id, title, type) => {
    const newDeleteInfo = {
      isOpen: true,
      id: id,
      title: title,
      type: type
    }
    setDeleteInfo(newDeleteInfo)
  }

  const onEditNote = (id, title, content) => {
    const newModalInfo = {
      isOpen: true,
      id: id,
      title: title,
      content: content  // TODO agregar folderId
    }
    setModalInfo(newModalInfo);
  }

// Funciones de DeleteMessage
  const onConfirm = () => {
    if (deleteInfo.type === TYPES.NOTE) {
      const newNotes = notes.filter(note => note.id !== deleteInfo.id);
      setNotes(newNotes);
    } else if (deleteInfo.type === TYPES.FOLDER) {
      const newNotes = notes.filter(note => note.folderId !== deleteInfo.id);
      const newFolders = folders.filter(folder => folder.id !== deleteInfo.id);
      setNotes(newNotes)
      setFolders(newFolders)
    }
    onCancel();
  };

  const onCancel = () => {
    setDeleteInfo(initialDeleteInfo)
  }

// Otras funciones
  const onAddNote = (folderId) => {
    const newModalInfo = {
      isOpen: true,
      id: null,
      title: "",
      content: "",
      folderId: folderId
    }
    setModalInfo(newModalInfo)
  }

  const onAddFolder = () => {
    const now = new Date()
    const newFolder = {
      id: crypto.randomUUID(),
      title: "Nueva carpeta",
      date: now.toISOString(),
      type: TYPES.FOLDER
    };
    setFolders([newFolder, ...folders]);
  }

  const onEditFolder = (updatedFolder) => {
    setFolders(folders.map(folder =>
      folder.id === updatedFolder.id 
      ? { ...folder, ...updatedFolder } 
      : folder
    ));
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex gap-6 p-3 items-center">
        <h1 className="text-3xl">Notas</h1>
        <div 
          onClick={() => onAddNote(null)} // Si no lo hago así, React pasa el event como primer argumento de la función
          className="flex cursor-pointer gap-1 transform transition duration-200 hover:scale-105 items-center">
          <FileText size={30}/>
          <h1 className="text-2xl">Nueva nota</h1>
        </div>
        <div 
          onClick={onAddFolder}
          className="flex cursor-pointer gap-1 transform transition duration-200 hover:scale-105 items-center">
          <Folder size={30}/>
          <h1 className="text-2xl">Nueva carpeta</h1>
        </div>
      </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {[...folders, ...notes]
          .filter(item => item.type === TYPES.FOLDER || item.folderId === null) // solo carpetas y notas sueltas
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // más recientes primero
          .map((item) => (
            item.type === TYPES.NOTE ? (
              <NotePreview
                key={item.id}
                id={item.id}
                title={item.title}
                content={item.content}
                date={item.date}
                onDelete={onDelete}
                onEdit={onEditNote}
              />
            ) : (
              <FolderPreview
                key={item.id}
                id={item.id}
                title={item.title}
                date={item.date}
                notes={notes.filter(note => note.folderId === item.id)}
                onDelete={onDelete}
                onAddNote={onAddNote}
                onEdit={onEditFolder}
              />
            )
        ))}
      </div>

      {modalInfo.isOpen && (
        <NoteModal
          id={modalInfo.id}
          onClose={onClose}
          onSave={handleOnSave}
          initialTitle={modalInfo.title}
          initialContent={modalInfo.content}
          folderId={modalInfo.folderId}
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
