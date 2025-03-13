// src/components/Note.tsx

export interface NoteProps {
  created_at: string;
  title: string;
  content: string;
  id: number;
}

function Note({ note, onDelete }: { note: NoteProps, onDelete: (id: number) => void }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  return (
    <div className="bg-synth-background border-l-4 border-synth-primary my-4 p-4 rounded neon-border bg-gray-900/90">
      <p className="text-xl font-retro neon-text text-synth-primary mb-2">{note.title}</p>
      <p className="text-synth-secondary neon-text mb-4">{note.content}</p>
      <p className="text-sm text-synth-secondary neon-text mb-4">{formattedDate}</p>
      <button
        className="button-retro py-2 px-4 rounded"
        onClick={() => onDelete(note.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default Note;