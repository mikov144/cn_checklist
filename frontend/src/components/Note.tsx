export interface NoteProps {
  created_at: string;
  title: string;
  content: string;
  id: number;
}

function Note({ note, onDelete }: { note: NoteProps, onDelete: (id: number) => void }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  return (
    <div className="bg-gray-100 border-l-4 border-blue-500 my-2 p-4 rounded">
      <p className="text-xl font-semibold mb-2">{note.title}</p>
      <p className="text-gray-700 mb-4">{note.content}</p>
      <p className="text-sm text-gray-500 mb-4">{formattedDate}</p>
      <button
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={() => onDelete(note.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default Note;