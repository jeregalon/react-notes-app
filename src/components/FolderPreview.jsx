import { Folder, Trash2, Edit2, Check, FolderOpen } from "lucide-react";
import { TYPES, VIEWS, NO_TITLE_MESSAGE } from "../constants";
import useFolders from "../useFolders";

export default function FolderPreview({
  folder,
  folderChildren = [],
  onDelete,
  onAddNote,
  onEdit,
  onOpen,
  view = VIEWS.GRID,
}) {
  const {
    name,
    setName,
    onEditMode,
    setOnEditMode,
    titleInputRef,
    handleSave,
    handleDelete,
    handleAddNote,
    handleKeyDown,
    handleOpen,
  } = useFolders({ folder, onEdit, onDelete, onAddNote, onOpen });

  const icon = onEditMode ? <Check size={18} /> : <Edit2 size={18} />;

  return (
    <div
      onClick={handleOpen}
      className={`bg-neutral-800 rounded-lg p-4 shadow-md min-h-[220px] max-h-[220px] 
        hover:shadow-lg transition flex flex-col relative cursor-pointer
        ${view === VIEWS.LIST ? "w-80" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center mb-2">
        <Folder size={32} className="text-yellow-400 mr-2 shrink-0" />
        <div className="flex-1 pr-16">
          <input
            className="font-bold text-lg truncate outline-none text-yellow-400 w-full bg-transparent"
            type="text"
            placeholder={NO_TITLE_MESSAGE}
            value={name === NO_TITLE_MESSAGE ? "" : name}
            ref={titleInputRef}
            onChange={(e) => {
              const currentText = e.target.value;
              const newName =
                currentText === "" ? NO_TITLE_MESSAGE : currentText.slice(0, 50);
              setName(newName);
            }}
            onKeyDown={handleKeyDown}
            readOnly={!onEditMode}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Botón editar/guardar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditMode ? handleSave() : setOnEditMode(true);
          }}
          className="absolute top-3 right-10 p-2 text-gray-400 hover:text-green-500 transition cursor-pointer transform transition duration-200 hover:scale-105"
        >
          {icon}
        </button>

        {/* Botón eliminar */}
        <button
          onClick={handleDelete}
          disabled={onEditMode}
          className={`absolute top-3 right-3 p-2 transition cursor-pointer transform duration-200 hover:scale-105 
            ${onEditMode ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:text-red-500"}`}
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Preview del contenido */}
      <div className="flex-1 min-h-0 mb-2">
        <div className="grid grid-cols-3 grid-rows-2 h-full gap-2 auto-rows-fr">
          <button
            onClick={handleAddNote}
            className="bg-neutral-700 rounded-lg flex items-center justify-center text-3xl font-bold text-white transition cursor-pointer active:scale-95 duration-150 ease-in-out min-h-0 overflow-hidden"
          >
            +
          </button>

          {folderChildren
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((item) =>
              item.type === TYPES.NOTE ? (
                <div
                  key={item.id}
                  className="bg-neutral-700 rounded-lg p-2 overflow-hidden min-h-0 flex flex-col"
                >
                  <h3 className="font-bold text-sm truncate mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-300 truncate flex-1 overflow-hidden">
                    {item.content}
                  </p>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="bg-neutral-700 rounded-lg flex flex-col items-center p-3 text-white"
                >
                  <FolderOpen className="mx-auto" />
                  <h1 className="w-full text-center truncate text-sm">{item.title}</h1>
                </div>
              )
            )}
        </div>
      </div>

      {/* Fecha */}
      <p className="text-xs text-gray-400 mt-auto">
        {new Date(folder.date).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
        })}
      </p>
    </div>
  );
}
