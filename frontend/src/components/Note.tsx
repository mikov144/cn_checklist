// src/components/Note.tsx

import { PencilSquareIcon, TrashIcon, Bars2Icon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export interface NoteProps {
  id: number;
  content: string;
  created_at: string;
  author: number;
  category: number;
  order: number;
  scratched_out: boolean;
  important: boolean;
}

interface NoteComponentProps {
  note: NoteProps;
  index: number;
  onDelete: (id: number) => void;
  onEdit: (note: NoteProps) => void;
  onToggleScratchOut: (id: number, scratched_out: boolean) => void;
  onToggleImportant: (id: number, important: boolean) => void;
  dragHandleProps?: any;
}

function Note({ note, index, onDelete, onEdit, onToggleScratchOut, onToggleImportant, dragHandleProps }: NoteComponentProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 border-b border-synth-primary/30 group hover:bg-synth-primary/5 transition-colors">
      {/* Top row with controls - always visible */}
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        {/* Drag handle - larger on mobile */}
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity">
          <Bars2Icon className="h-6 w-6 sm:h-5 sm:w-5 text-synth-primary" />
        </div>

        {/* Sequential Index */}
        <span className="text-synth-secondary font-mono min-w-[3ch]">{index + 1})</span>

        {/* Important toggle */}
        <button
          onClick={() => onToggleImportant(note.id, !note.important)}
          className={`p-1.5 rounded transition-colors active:opacity-80 active:scale-95 ${note.important ? 'text-yellow-400' : 'text-synth-secondary hover:text-yellow-300'}`}
          title={note.important ? 'Unmark important' : 'Mark as important'}
        >
          <ExclamationTriangleIcon className="h-6 w-6 sm:h-5 sm:w-5 cursor-pointer" />
        </button>

        {/* Checkbox - consistent size */}
        <input
          type="checkbox"
          checked={note.scratched_out}
          onChange={() => onToggleScratchOut(note.id, !note.scratched_out)}
          className="w-6 h-6 sm:w-5 sm:h-5 sm:mr-5 rounded border-synth-primary bg-synth-background
            cursor-pointer transition-all
            hover:border-pink-500 hover:ring-2 hover:ring-pink-500/30
            focus:ring-pink-500/30 focus:ring-2 focus:ring-offset-0
            checked:border-pink-500 
            [&:checked]:bg-pink-500 [&:checked]:hover:bg-pink-600
            accent-pink-500"
        />

        {/* Action buttons - shown next to content on desktop, below controls on mobile */}
        <div className="flex space-x-2 sm:hidden">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 text-synth-primary hover:text-pink-500 transition-colors
              active:opacity-70 active:scale-95 active:text-pink-600"
            title="Edit note"
          >
            <PencilSquareIcon className="h-5 w-5 cursor-pointer" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 text-red-500 hover:text-red-400 transition-colors
              active:opacity-70 active:scale-95 active:text-red-600"
            title="Delete note"
          >
            <TrashIcon className="h-5 w-5 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Content and desktop action buttons */}
      <div className="flex items-center gap-4 flex-grow">
        <p className={`text-lg font-retro text-synth-text whitespace-pre-wrap flex-grow
          ${note.scratched_out ? 'line-through text-gray-400' : ''} ${note.important ? 'highlight-text' : ''}`}>
          {note.content}
        </p>

        {/* Action buttons - desktop only */}
        <div className="hidden sm:flex space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="p-2 text-synth-primary hover:text-pink-500 transition-colors
              active:opacity-70 active:scale-95 active:text-pink-600"
            title="Edit note"
          >
            <PencilSquareIcon className="h-5 w-5 cursor-pointer" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 text-red-500 hover:text-red-400 transition-colors
              active:opacity-70 active:scale-95 active:text-red-600"
            title="Delete note"
          >
            <TrashIcon className="h-5 w-5 cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;