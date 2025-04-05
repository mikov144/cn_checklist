// src/components/Note.tsx

import { PencilSquareIcon, TrashIcon, Bars2Icon } from '@heroicons/react/24/outline';

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
          <Bars2Icon className="h-5 w-5 text-synth-primary" />
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
          ${note.scratched_out ? 'line-through text-gray-400' : ''}`}>
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
          <PencilSquareIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-2 text-red-500 hover:text-red-400 transition-colors"
          title="Delete note"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default Note;