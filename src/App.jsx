import NotePreview from "./NotePreview";
import AddNoteButton from "./AddNoteButton";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-6">Notas</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AddNoteButton />

        <NotePreview
          title="Mi primera nota"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
          date="16 de septiembre"
        />

       
      </div>
    </div>
  );
}
