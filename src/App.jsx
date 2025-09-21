import { useState } from "react";
import { FileText, Folder, ArrowLeft } from 'lucide-react';
import NotePreview from "./components/NotePreview";
import NoteModal from "./components/NoteModal";
import DeleteMessage from "./components/DeleteMessage";
import FolderPreview from "./components/FolderPreview";
import { TYPES } from './constants';
import useNotes from "./useNotes";

export default function App() {
  const {
    notes,
    folders,
    openedFolder,
    addNote,
    deleteItem,
    addFolder,
    editFolder,
    openFolder,
    onNavigateBack
  } = useNotes();

  const initialModalInfo = { isOpen: false, id: null, title: "", content: "", folderId: null };
  const initialDeleteInfo = { isOpen: false, id: null, title: "", type: "" };

  const [modalInfo, setModalInfo] = useState(initialModalInfo);
  const [deleteInfo, setDeleteInfo] = useState(initialDeleteInfo);

  // --- Funciones de UI ---
  const handleOnSave = (note) => {
    addNote(note);
    onClose();
  };

  const onClose = () => setModalInfo(initialModalInfo);

  const onDelete = (id, title, type) => {
    setDeleteInfo({ isOpen: true, id, title, type });
  };

  const onEditNote = (id, title, content) => {
    setModalInfo({ isOpen: true, id, title, content });
  };

  const onConfirm = () => {
    deleteItem(deleteInfo.id, deleteInfo.type);
    onCancel();
  };

  const onCancel = () => setDeleteInfo(initialDeleteInfo);

  const onAddNote = (folderId) => {
    setModalInfo({ isOpen: true, id: null, title: "", content: "", folderId });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex gap-6 p-3 items-center">
        <button
          onClick={onNavigateBack}
          disabled={!openedFolder}
          className={`cursor-pointer transform transition duration-200 hover:scale-105
              ${!openedFolder 
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:text-yellow-400"}`}>
          <ArrowLeft size={30} />
        </button>
        <h1 className="text-3xl">Notas</h1>
        <button 
          onClick={() => onAddNote(openedFolder)}
          className="flex cursor-pointer gap-1 transform transition duration-200 hover:scale-105 items-center">
          <FileText size={30}/>
          <h1 className="text-2xl">Nueva nota</h1>
        </button>
        <button 
          onClick={() => addFolder(openedFolder)}
          className="flex cursor-pointer gap-1 transform transition duration-200 hover:scale-105 items-center">
          <Folder size={30}/>
          <h1 className="text-2xl">Nueva carpeta</h1>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...folders, ...notes]
          .filter(item => item.folderId === openedFolder)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((item) =>
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
                onEdit={editFolder}
                onOpen={openFolder}
              />
            )
        )}
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