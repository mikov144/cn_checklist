// src/components/Note.tsx

export interface NoteProps {
  id: number;
  content: string;
  created_at: string;
  author: number;
  category: number;
  order: number;
  scratched_out: boolean;
}

interface NoteComponentProps {
  note: NoteProps;
  onDelete: (id: number) => void;
  onEdit: (note: NoteProps) => void;
  onToggleScratchOut: (id: number, scratched_out: boolean) => void;
}

function Note({ note, onDelete, onEdit, onToggleScratchOut }: NoteComponentProps) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  return (
    <div className="bg-synth-background p-6 rounded-lg neon-border mb-4 bg-gray-900/90">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={note.scratched_out}
            onChange={() => onToggleScratchOut(note.id, !note.scratched_out)}
            className="w-5 h-5 rounded border-synth-primary text-synth-primary focus:ring-synth-secondary
              cursor-pointer transition-all duration-200
              hover:border-pink-500 hover:ring-2 hover:ring-pink-500/30"
          />
          <p className={`text-xl font-retro text-synth-text whitespace-pre-wrap
            ${note.scratched_out ? 'line-through text-synth-secondary' : ''}`}>
            {note.content}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="px-3 py-1 rounded border-2 border-synth-primary text-synth-primary
              transition-all duration-200 font-retro
              hover:text-pink-500 hover:border-pink-500
              hover:bg-synth-primary/10 
              hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]
              hover:scale-105
              active:scale-95
              active:bg-synth-primary/20
              active:text-pink-700
              active:border-pink-700
              active:shadow-[0_0_8px_rgba(255,0,255,0.2)]
              text-base"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="px-3 py-1 rounded border-2 border-red-500 text-red-500
              transition-all duration-200 font-retro
              hover:text-red-400 hover:border-red-400
              hover:bg-red-500/10
              hover:shadow-[0_0_15px_rgba(255,0,0,0.3)]
              hover:scale-105
              active:scale-95
              active:bg-red-500/20
              active:text-red-700
              active:border-red-700
              active:shadow-[0_0_8px_rgba(255,0,0,0.2)]
              text-base"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="text-synth-secondary neon-text text-sm">{formattedDate}</p>
    </div>
  );
}

export default Note;