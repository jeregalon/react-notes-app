export default function AddNoteButton({ onClick }) {
  const buttonAnimation = "transition transform active:scale-95 duration-150 ease-in-out"
  const className = `bg-neutral-700 rounded-lg flex items-center justify-center text-6xl font-bold p-8 text-white transition cursor-pointer ${buttonAnimation}`
  return (
    <button 
      onClick={onClick}
      className={className}>
      +
    </button>
  );
}