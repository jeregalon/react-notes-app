import { AlertTriangle } from "lucide-react";

export default function DeleteMessage({ onConfirm, onCancel, title }) {

  const showTitle = title.length > 30 ? `${title.slice(0, 30)}...` : title

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-neutral-900 w-[500px] h-[300px] rounded-3xl relative flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <AlertTriangle size={80} />
          <span className="text-lg mt-2 px-10 block w-full text-center">¿Está seguro que desea eliminar {showTitle}?</span>
        </div>
        <div className="h-[80px]">
          <div className="flex h-full">
            <div className="w-1/2 flex items-center justify-center">
              <button
                onClick={onConfirm}
                className="text-lg cursor-pointer hover:text-red-500 transform transition duration-200 hover:scale-105"
              >
                Eliminar
              </button>
            </div>
            <div className="w-1/2 flex items-center justify-center">
              <button
                onClick={onCancel} 
                className="text-lg cursor-pointer hover:text-green-500 transform transition duration-200 hover:scale-105"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}