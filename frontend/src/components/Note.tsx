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
  index: number;
  onDelete: (id: number) => void;
  onEdit: (note: NoteProps) => void;
  onToggleScratchOut: (id: number, scratched_out: boolean) => void;
}

function Note({ note, index, onDelete, onEdit, onToggleScratchOut }: NoteComponentProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b border-synth-primary/30 group hover:bg-synth-primary/5 transition-colors">
      <div className="flex items-center gap-4 flex-grow">
        {/* Drag handle */}
        <div className="cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-synth-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8M8 15h8" />
          </svg>
        </div>

        {/* Sequential Index instead of Note ID */}
        <span className="text-synth-secondary font-mono min-w-[3ch]">#{index + 1}</span>

        {/* Checkbox */}
        <input
          type="checkbox"
          checked={note.scratched_out}
          onChange={() => onToggleScratchOut(note.id, !note.scratched_out)}
          className="w-5 h-5 rounded border-synth-primary text-synth-primary focus:ring-synth-secondary
            cursor-pointer transition-all duration-200
            hover:border-pink-500 hover:ring-2 hover:ring-pink-500/30"
        />

        {/* Content */}
        <p className={`text-lg font-retro text-synth-text whitespace-pre-wrap flex-grow
          ${note.scratched_out ? 'line-through text-synth-secondary' : ''}`}>
          {note.content}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(note)}
          className="p-2 text-synth-primary hover:text-pink-500 transition-colors"
          title="Edit note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-2 text-red-500 hover:text-red-400 transition-colors"
          title="Delete note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Note;