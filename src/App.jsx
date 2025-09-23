import { useState } from "react";
import { FileText, Folder, ArrowLeft, LayoutGrid, List } from 'lucide-react';
import NotePreview from "./components/NotePreview";
import NoteModal from "./components/NoteModal";
import DeleteMessage from "./components/DeleteMessage";
import FolderPreview from "./components/FolderPreview";
import { TYPES, VIEWS, SORT_BY, ORDER, sortElements } from './constants';
import useNotes from "./useNotes";
import { ListViewFolderPreview } from "./components/ListViewFolderPreview";
import { NewButton } from "./components/NewButton";
import SortSelector from "./components/SortSelector";

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

  const [sort, setSort] = useState(SORT_BY.DATE);
  const [order, setOrder] = useState(ORDER.DESC);

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

  const onAddFolder = (folderId) => {
    addFolder(folderId)
  }

  const onChangeSort = (newSort) => {
    if (newSort != sort) setSort(newSort)
  }

  const onChangeOrder = (newOrder) => {
    if (newOrder != order) setOrder(newOrder)
  }


  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button onClick={restartArrays} disabled={false}>Reiniciar</button>
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

          <NewButton 
            onClick = {() => onAddNote(openedFolder)}
            icon = {<FileText size={30}/>}
            text = {"Nueva nota"}
            folder = {folders.find(f => f.id === openedFolder) ?? null}
            maxLength = {10}
          />

          <NewButton 
            onClick = {() => addFolder(openedFolder)}
            icon = {<Folder size={30}/>}
            text = {"Nueva carpeta"}
            folder = {folders.find(f => f.id === openedFolder) ?? null}
            maxLength = {10}
          />

        </div>

        <div className="flex col gap-x-4">
          <h1 className="text-3xl">Ordenar por:</h1>
          <SortSelector 
            onChangeSort={onChangeSort}
            onChangeOrder={onChangeOrder}
            sort={sort}
            order={order}
          />
        </div>
        
        {/*Toggle para elegir entre vistas*/}
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
          {sortElements([...folders, ...notes], sort, order)
            .filter(item => item.folderId === openedFolder)
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
                  sort={sort}
                  order={order}
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
              {sortElements(notes, sort, order)
                .filter(note => note.folderId === openedFolder)
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

          {sortElements(folders, sort, order)
            .filter(folder => folder.folderId === openedFolder)
            .map(folder => (
              <ListViewFolderPreview
                key={folder.id}
                folder={folder}
                allNotesAndFolders={[...folders, ...notes]}
                sort={sort}
                order={order}
                onDelete={onDelete}
                onEditNote={onEditNote}
                onAddNote={onAddNote}
                onAddFolder={onAddFolder}
                onEdit={editFolder}
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
