export function NewButton({ icon, text, onClick, folder, maxLength }) {
    return(
        <button 
            onClick={onClick}
            className="flex cursor-pointer gap-1 transform transition duration-200 hover:scale-105 items-center ml-8">
            {icon}
            <h1 className="text-2xl">
                {folder
                ? `${text} en "${(() => {
                    const title = folder?.title || "";
                    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
                  })()}"` 
                : text}
            </h1>
        </button>
    )
}