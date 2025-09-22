import { useState } from "react";
import { FileText, Folder, ArrowLeft, LayoutGrid, List } from 'lucide-react';
import NotePreview from "./components/NotePreview";
import NoteModal from "./components/NoteModal";
import DeleteMessage from "./components/DeleteMessage";
import FolderPreview from "./components/FolderPreview";
import { TYPES, VIEWS } from './constants';
import useNotes from "./useNotes";
import { ListViewFolderPreview } from "./components/ListViewFolderPreview";

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
    onNavigateBack,
    deleteArrays
  } = useNotes();

  const initialModalInfo = { isOpen: false, id: null, title: "", content: "", folderId: null };
  const initialDeleteInfo = { isOpen: false, id: null, title: "", type: "" };

  const [modalInfo, setModalInfo] = useState(initialModalInfo);
  const [deleteInfo, setDeleteInfo] = useState(initialDeleteInfo);
  const [view, setView] = useState(VIEWS.GRID);

  // --- Funciones de UI ---
  const handleOnSave = (note) => {
    addNote(note);
    onClose();
  };

  const onClose = () => setModalInfo(initialModalInfo);

  const onDelete = (id, title, type) => {
    setDeleteInfo({ isOpen: true, id, title, type });
  };

  const onEditNote = (id, title, content, folderId) => {
    setModalInfo({ isOpen: true, id, title, content, folderId });
  };

  const onConfirm = () => {
    deleteItem(deleteInfo.id, deleteInfo.type);
    onCancel();
  };

  const restartArrays = () => {
    deleteArrays()
  }

  const onCancel = () => setDeleteInfo(initialDeleteInfo);

  const onAddNote = (folderId) => {
    setModalInfo({ isOpen: true, id: null, title: "", content: "", folderId });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button onClick={restartArrays} disabled={true}>Reiniciar</button>
      <div className="flex gap-10 p-3 items-center justify-between">
        <div className="flex gap-10 items-center">
          <button
            onClick={onNavigateBack}
            disabled={!openedFolder}
            className={`cursor-pointer transform transition duration-200 hover:scale-105
                ${!openedFolder 
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-gray-400 hover:text-yellow-400"}`}>
            <ArrowLeft size={30} />
          </button>

          <h1 className="text-3xl">
            {openedFolder 
              ? (() => {
                  const folder = folders.find(f => f.id === openedFolder);
                  const title = folder?.title || "";
                  return title.length > 10 ? title.slice(0, 10) + "..." : title;
                })()
              : "Notas"}
          </h1>

          <button 
            onClick={() => onAddNote(openedFolder)}
            className="flex cursor-pointer gap-1 transform transition duration-200 hover:scale-105 items-center">
            <FileText size={30}/>
            <h1 className="text-2xl">
              {openedFolder
                ? `Nueva nota en "${(() => {
                    const folder = folders.find(f => f.id === openedFolder);
                    const title = folder?.title || "";
                    return title.length > 10 ? title.slice(0, 10) + "..." : title;
                  })()}"` 
                : "Nueva nota"}
            </h1>
          </button>

          <button 
            onClick={() => addFolder(openedFolder)}
            className="flex cursor-pointer gap-1 transform transition duration-200 hover:scale-105 items-center">
            <Folder size={30}/>
            <h1 className="text-2xl">
              {openedFolder
                ? `Nueva carpeta en "${(() => {
                    const folder = folders.find(f => f.id === openedFolder);
                    const title = folder?.title || "";
                    return title.length > 10 ? title.slice(0, 10) + "..." : title;
                  })()}"` 
                : "Nueva carpeta"}
            </h1>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setView(VIEWS.GRID)}
            className={`p-2 rounded-lg ${
              view === VIEWS.GRID ? "bg-blue-600 text-white" : "bg-black"
            }`}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setView(VIEWS.LIST)}
            className={`p-2 rounded-lg ${
              view === VIEWS.LIST ? "bg-blue-600 text-white" : "bg-black"
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {view === VIEWS.GRID ? (
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
                  folderId={item.folderId}
                  view={view}
                  onDelete={onDelete}
                  onEdit={onEditNote}
                />
              ) : (
                <FolderPreview
                  key={item.id}
                  folder={item}
                  folderChildren={[...folders, ...notes].filter(i => i.folderId === item.id)}
                  view={view}
                  onDelete={onDelete}
                  onAddNote={onAddNote}
                  onEdit={editFolder}
                  onOpen={openFolder}
                />
              )
          )}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-700">

          <div className="py-4 overflow-x-auto">
            <div className="flex gap-4 w-max">
              {notes
                .filter(note => note.folderId === openedFolder)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(note => (
                  <NotePreview
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    content={note.content}
                    date={note.date}
                    folderId={note.folderId}
                    view={view}
                    onDelete={onDelete}
                    onEdit={onEditNote}
                  />
                ))}
            </div>
          </div>

          {folders
            .filter(folder => folder.folderId === openedFolder)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(folder => (
              <ListViewFolderPreview
                key={folder.id}
                folder={folder}
                allNotesAndFolders={[...folders, ...notes]}
                onDelete={onDelete}
                onEditNote={onEditNote}
                onAddNote={onAddNote}
                onEditFolder={editFolder}
                onOpen={openFolder}
              />
            ))}
        </div>
      )}

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
