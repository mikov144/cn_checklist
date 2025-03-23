// src/pages/Checklist.tsx

import { useState, useEffect, useCallback } from "react";
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
    toggleNoteScratchOut
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

  if ((notesLoading && notes.length === 0) || (categoriesLoading && categories.length === 0)) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-synth-background bg-cover bg-center flex flex-col p-2" style={{ backgroundImage: "url('/images/_main-background.webp')"}}>
      <Header />
      <div className="flex-grow p-6">
        <CategoryTabs
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onCreateCategory={createCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
        />

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-retro neon-text text-synth-primary">
            Notes {selectedCategory ? `- ${selectedCategory.title}` : ''}
          </h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="button-retro px-6 py-2 rounded font-retro flex items-center text-lg"
            disabled={!selectedCategory}
          >
            Create Note
          </button>
        </div>
        <div className="notes-section mb-8">
          {filteredNotes.map((note) => (
            <Note 
              note={note} 
              onDelete={handleDeleteClick}
              onEdit={() => handleEditClick(note)}
              onToggleScratchOut={toggleNoteScratchOut}
              key={note.id} 
            />
          ))}
          {selectedCategory && filteredNotes.length === 0 && (
            <p className="text-synth-secondary text-center py-8">
              No notes in this category yet. Create one to get started!
            </p>
          )}
          {!selectedCategory && (
            <p className="text-synth-secondary text-center py-8">
              Please select a category to view or create notes.
            </p>
          )}
        </div>
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