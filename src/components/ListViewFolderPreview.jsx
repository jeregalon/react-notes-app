import { Folder, Trash2, Edit2, Check, FolderOpen } from "lucide-react"
import { TYPES, VIEWS } from '../constants';
import useFolders from "../useFolders"
import NotePreview from "./NotePreview";
import FolderPreview from "./FolderPreview";

export function ListViewFolderPreview({ allNotesAndFolders=[], onDelete, onEditNote, onAddNote, onEditFolder, onOpen, folder=null }) {
    
    
    return(
        <div className="py-4 overflow-x-auto">
            
            <h2 className="text-xl font-bold mb-2">{folder.title}</h2>
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
                        onEdit={onEditFolder}
                        onOpen={onOpen}
                    />
                    )
                )}
            </div>
        </div>
    )
}