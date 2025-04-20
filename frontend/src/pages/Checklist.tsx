// src/pages/Checklist.tsx

import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";
import Note, { NoteProps } from "../components/Note";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import LoadingIndicator from "../components/LoadingIndicator";
import { useNotes } from "../context/NotesContext";
import { useCategories } from "../context/CategoriesContext";
import CategoryTabs from "../components/CategoryTabs";

interface FormData {
  content: string;
}

interface NoteFormProps {
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  formData: FormData;
  setFormData: (data: FormData) => void;
  onCancel: () => void;
}

const NoteForm = ({ 
  onSubmit, 
  submitText,
  formData,
  setFormData,
  onCancel
}: NoteFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label htmlFor="content" className="block text-synth-secondary neon-text mb-2">
        Content:
      </label>
      <textarea
        id="content"
        name="content"
        required
        value={formData.content}
        onChange={(e) => setFormData({ content: e.target.value })}
        className="w-full p-2 border border-synth-primary rounded bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary"
        rows={4}
      />
    </div>

    <div className="flex justify-end space-x-4 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 rounded border-2 border-synth-primary text-synth-primary
          transition-all duration-200 font-retro
          hover:text-pink-500 hover:border-pink-500
          hover:bg-synth-primary/10 
          hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]
          hover:scale-105
          active:scale-95
          active:bg-synth-primary/20
          active:text-pink-700
          active:border-pink-700
          active:shadow-[0_0_8px_rgba(255,0,255,0.2)]"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="button-retro px-4 py-2 rounded font-retro"
      >
        {submitText}
      </button>
    </div>
  </form>
);

function Checklist() {
  const { 
    notes, 
    loading: notesLoading, 
    refreshNotes, 
    createNote: createNoteApi, 
    updateNote: updateNoteApi, 
    deleteNote: deleteNoteApi,
    toggleNoteScratchOut,
    reorderNotes
  } = useNotes();
  const { 
    categories, 
    selectedCategory,
    loading: categoriesLoading,
    refreshCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    setSelectedCategory
  } = useCategories();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<NoteProps | null>(null);
  const [createFormData, setCreateFormData] = useState<FormData>({ content: "" });
  const [editFormData, setEditFormData] = useState<FormData>({ content: "" });

  useEffect(() => {
    const initialize = async () => {
      await refreshCategories();
      await refreshNotes();
    };
    initialize();
  }, []); // Remove refreshNotes and refreshCategories from dependencies to prevent re-runs

  const handleDeleteClick = useCallback((id: number) => {
    setNoteToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const handleEditClick = useCallback((note: NoteProps) => {
    setNoteToEdit(note);
    setEditFormData({ content: note.content });
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (noteToDelete === null) return;
    try {
      await deleteNoteApi(noteToDelete);
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      alert("Failed to delete note: " + error);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert("Please select a category first");
      return;
    }
    try {
      await createNoteApi(createFormData.content, selectedCategory.id);
      setCreateFormData({ content: "" });
      setIsCreateModalOpen(false);
    } catch (error) {
      alert("Failed to create note: " + error);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteToEdit) return;
    try {
      await updateNoteApi(noteToEdit.id, editFormData.content);
      setEditFormData({ content: "" });
      setIsEditModalOpen(false);
      setNoteToEdit(null);
    } catch (error) {
      alert("Failed to update note: " + error);
    }
  };

  const handleCreateModalClose = useCallback(() => {
    setIsCreateModalOpen(false);
    setCreateFormData({ content: "" });
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setEditFormData({ content: "" });
    setNoteToEdit(null);
  }, []);

  const filteredNotes = notes.filter(note => note.category === selectedCategory?.id);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !selectedCategory) return;

    // Create a new array with all notes
    const allNotes = Array.from(notes);
    
    // Get the source and destination notes
    const sourceNote = filteredNotes[result.source.index];
    const destinationNote = filteredNotes[result.destination.index];
    if (!sourceNote || !destinationNote) return;
    
    // Find the actual indices in the full notes array
    const sourceIndex = allNotes.findIndex(note => note.id === sourceNote.id);
    const destinationIndex = allNotes.findIndex(note => note.id === destinationNote.id);
    if (sourceIndex === -1 || destinationIndex === -1) return;
    
    // Remove the source note
    const [movedNote] = allNotes.splice(sourceIndex, 1);
    
    // Insert at the correct position
    // When moving upward (destination < source), insert at the destination index
    // When moving downward (destination > source), insert after the destination index
    const insertIndex = destinationIndex > sourceIndex 
      ? destinationIndex 
      : destinationIndex;
    
    allNotes.splice(insertIndex, 0, movedNote);
    
    // Get all note IDs in their new order
    const newOrder = allNotes.map(note => note.id);
    
    try {
      await reorderNotes(newOrder);
    } catch (error) {
      alert("Failed to reorder notes: " + error);
    }
  };

  if ((notesLoading && notes.length === 0) || (categoriesLoading && categories.length === 0)) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-synth-background bg-cover bg-center flex flex-col p-2" style={{ backgroundImage: "url('/images/_main-background.webp')"}}>
      <Header />
      <div className="flex-grow p-6">
        <div className="flex justify-end items-center mb-8">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="button-retro px-6 py-2 rounded font-retro flex items-center text-lg"
            disabled={!selectedCategory}
          >
            Create Note
          </button>
        </div>
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onCreateCategory={createCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
        />
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="notes">
            {(provided: DroppableProvided) => (
              <div 
                className="bg-synth-background p-6 rounded-lg neon-border mb-4 bg-gray-900/90 bg-synth-background/95 border border-synth-primary/30 overflow-hidden"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {filteredNotes.map((note, index) => (
                  <Draggable 
                    key={note.id} 
                    draggableId={note.id.toString()} 
                    index={index}
                  >
                    {(provided: DraggableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <Note 
                          note={note} 
                          index={index}
                          onDelete={handleDeleteClick}
                          onEdit={() => handleEditClick(note)}
                          onToggleScratchOut={toggleNoteScratchOut}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {selectedCategory && filteredNotes.length === 0 && (
                  <p className="text-synth-secondary text-center py-8">
                    No notes in this category yet...
                  </p>
                )}
                {!selectedCategory && (
                  <p className="text-synth-secondary text-center py-8">
                    Please select a category to view or create notes.
                  </p>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <Footer />

      {/* Modals */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create a Note"
        showActions={false}
      >
        <NoteForm 
          onSubmit={handleCreateNote} 
          submitText="Create"
          formData={createFormData}
          setFormData={setCreateFormData}
          onCancel={handleCreateModalClose}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Note"
        showActions={false}
      >
        <NoteForm 
          onSubmit={handleUpdateNote}
          submitText="Update"
          formData={editFormData}
          setFormData={setEditFormData}
          onCancel={handleEditModalClose}
        />
      </Modal>
    </div>
  );
}

export default Checklist;