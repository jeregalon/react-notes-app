import { Folder, Trash2, Edit2, Check, FolderOpen, FileText } from "lucide-react"
import { TYPES, VIEWS, NO_TITLE_MESSAGE } from '../constants';
import useFolders from "../useFolders"
import NotePreview from "./NotePreview";
import FolderPreview from "./FolderPreview";
import { NewButton } from "./NewButton";

export function ListViewFolderPreview({ allNotesAndFolders=[], onDelete, onEditNote, onAddNote, onEdit, onOpen, onAddFolder, folder=null }) {
    
    const {
    name,
    setName,
    onEditMode,
    setOnEditMode,
    titleInputRef,
    handleSave,
    handleDelete,
    handleAddNote,
    handleAddFolder,
    handleKeyDown,
    handleOpen,
    } = useFolders({ folder, onEdit, onDelete, onAddNote, onAddFolder, onOpen });

    const icon = onEditMode ? <Check size={22} /> : <Edit2 size={22} />;

    return(
        <div className="py-4 overflow-x-auto">

            <div className="flex items-center mb-2">
                <Folder size={32} className="text-yellow-400 mr-2 shrink-0" />

                <input
                    className="font-bold text-lg truncate outline-none text-yellow-400 w-32 shrink-0 bg-transparent"
                    type="text"
                    placeholder={NO_TITLE_MESSAGE}
                    value={name === NO_TITLE_MESSAGE ? "" : name}
                    ref={titleInputRef}
                    onChange={(e) => {
                        const currentText = e.target.value;
                        const newName = currentText === "" ? NO_TITLE_MESSAGE : currentText.slice(0, 50);
                        setName(newName);
                    }}
                    onKeyDown={handleKeyDown}
                    readOnly={!onEditMode}
                    onClick={(e) => e.stopPropagation()}
                />

                {/* Botones a la derecha */}
                {/* Botón editar/guardar */}
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    onEditMode ? handleSave() : setOnEditMode(true);
                    }}
                    className="ml-8 p-2 text-gray-400 hover:text-green-500 transition cursor-pointer transform duration-200 hover:scale-105"
                >
                    {icon}
                </button>

                {/* Botón eliminar */}
                <button
                    onClick={handleDelete}
                    disabled={onEditMode}
                    className={`p-2 transition cursor-pointer transform duration-200 hover:scale-105 ml-2 
                    ${onEditMode ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-red-500"}`}
                >
                    <Trash2 size={22} />
                </button>

                <NewButton 
                    onClick = {handleAddNote}
                    icon = {<FileText size={30}/>}
                    text = {"Nueva nota"}
                    folder = {folder}
                    maxLength = {10}
                />

                <NewButton 
                    onClick = {handleAddFolder}
                    icon = {<Folder size={30}/>}
                    text = {"Nueva carpeta"}
                    folder = {folder}
                    maxLength = {10}
                />
            </div>

            
            <div className="flex gap-4 w-max">
                {allNotesAndFolders
                .filter(item => item.folderId === folder.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(item =>
                    item.type === TYPES.NOTE ? (
                    <NotePreview
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        content={item.content}
                        date={item.date}
                        folderId={item.folderId}
                        view={VIEWS.LIST}
                        onDelete={onDelete}
                        onEdit={onEditNote}
                    />
                    ) : (
                    <FolderPreview
                        key={item.id}
                        folder={item}
                        folderChildren={allNotesAndFolders.filter(i => i.folderId === item.id)}
                        view={VIEWS.LIST}
                        onDelete={onDelete}
                        onAddNote={onAddNote}
                        onEdit={onEdit}
                        onOpen={onOpen}
                    />
                    )
                )}
            </div>
        </div>
    )
}