export default function AddNoteButton({ onClick }) {
  const buttonAnimation = "transition transform active:scale-95 duration-150 ease-in-out"
  const className = `bg-neutral-800 rounded-lg flex items-center justify-center text-6xl font-bold p-8 text-white hover:bg-neutral-700 transition cursor-pointer ${buttonAnimation}`
  return (
    <button 
      onClick={onClick}
      className={className}>
      +
    </button>
  );
}