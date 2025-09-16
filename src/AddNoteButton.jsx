export default function AddNoteButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-neutral-800 rounded-lg flex items-center justify-center text-6xl font-bold p-8 text-white hover:bg-neutral-700 transition">
      +
    </button>
  );
}