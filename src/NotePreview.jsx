export default function NotePreview({ title, content, date }) {
  return (
    <div className="bg-neutral-800 rounded-lg p-4 shadow-md hover:shadow-lg transition">
      <h2 className="font-bold text-lg mb-2">{title}:</h2>
      <p className="text-sm text-gray-200 mb-4 line-clamp-4">{content}</p>
      <p className="text-xs text-gray-400">{date}</p>
    </div>
  );
}
