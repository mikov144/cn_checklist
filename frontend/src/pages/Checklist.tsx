import { useState, useEffect, useCallback, ReactNode } from "react";
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
          transition-all duration-200 font-retro cursor-pointer
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
        className="button-retro px-4 py-2 rounded font-retro cursor-pointer"
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
    toggleNoteImportant,
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
  const [noteToDelete, setNoteToDelete] = useState<NoteProps | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<NoteProps | null>(null);
  const [createFormData, setCreateFormData] = useState<FormData>({ content: "" });
  const [editFormData, setEditFormData] = useState<FormData>({ content: "" });
  const [createParentId, setCreateParentId] = useState<number | null>(null);
  const [expandedById, setExpandedById] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const initialize = async () => {
      await refreshCategories();
      await refreshNotes();
    };
    initialize();
  }, []); // Remove refreshNotes and refreshCategories from dependencies to prevent re-runs

  const handleDeleteClick = useCallback(async (note: NoteProps) => {
    // If it's a line separator, delete directly without confirmation
    if (note.content === "------------------------------------------------------------------------------------------------------------") {
      try {
        await deleteNoteApi(note.id);
      } catch (error) {
        alert("Failed to delete line: " + error);
      }
      return;
    }
    
    // For regular notes, show confirmation modal
    setNoteToDelete(note);
    setIsDeleteModalOpen(true);
  }, [deleteNoteApi]);

  const handleEditClick = useCallback((note: NoteProps) => {
    setNoteToEdit(note);
    setEditFormData({ content: note.content });
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (noteToDelete === null) return;
    try {
      await deleteNoteApi(noteToDelete.id);
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
      await createNoteApi(createFormData.content, selectedCategory.id, createParentId ?? null);
      setCreateFormData({ content: "" });
      setCreateParentId(null);
      setIsCreateModalOpen(false);
    } catch (error) {
      alert("Failed to create note: " + error);
    }
  };

  const handleCreateChild = useCallback((parentId: number) => {
    if (!selectedCategory) {
      alert("Please select a category first");
      return;
    }
    setCreateParentId(parentId);
    setCreateFormData({ content: "" });
    setIsCreateModalOpen(true);
  }, [selectedCategory]);

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
    setCreateParentId(null);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsEditModalOpen(false);
    setEditFormData({ content: "" });
    setNoteToEdit(null);
  }, []);

  // Build a map by parent to create a hierarchical structure
  const filteredNotes = notes.filter(note => note.category === selectedCategory?.id);
  const childrenByParent: Record<number, NoteProps[]> = {};
  filteredNotes.forEach(n => {
    const parentId = (n as any).parent as number | null | undefined;
    if (parentId) {
      if (!childrenByParent[parentId]) childrenByParent[parentId] = [];
      childrenByParent[parentId].push(n);
    }
  });
  const topLevelNotes = filteredNotes.filter(n => !(n as any).parent);

  const hasChildren = useCallback((id: number) => (childrenByParent[id]?.length ?? 0) > 0, [childrenByParent]);
  const toggleExpand = useCallback((id: number) => {
    setExpandedById(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Helper to recursively render descendants within a single draggable group
  const renderDescendants = (parentId: number, level: number): ReactNode[] => {
    const children = childrenByParent[parentId] || [];
    const elements: ReactNode[] = [];
    if (!expandedById[parentId]) {
      return elements;
    }
    children.forEach((child) => {
      elements.push(
        <Note
          key={child.id}
          note={child}
          onDelete={(_id: number) => handleDeleteClick(child)}
          onEdit={handleEditClick}
          onToggleScratchOut={toggleNoteScratchOut}
          onToggleImportant={toggleNoteImportant}
          level={level}
          onCreateChild={handleCreateChild}
          hasChildren={hasChildren(child.id)}
          expanded={!!expandedById[child.id]}
          onToggleExpand={() => toggleExpand(child.id)}
        />
      );
      elements.push(...renderDescendants(child.id, level + 1));
    });
    return elements;
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !selectedCategory) return;

    // Compute new order for top-level groups only
    const currentTop = topLevelNotes.map(n => n.id);
    const [removed] = currentTop.splice(result.source.index, 1);
    currentTop.splice(result.destination.index, 0, removed);

    try {
      await reorderNotes(currentTop);
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
        <div className="flex justify-end items-center mb-8 space-x-4">
          <button
            onClick={async () => {
              if (!selectedCategory) {
                alert("Please select a category first");
                return;
              }
              try {
                await createNoteApi("------------------------------------------------------------------------------------------------------------", selectedCategory.id);
              } catch (error) {
                alert("Failed to create line: " + error);
              }
            }}
            className="button-retro px-6 py-2 rounded font-retro flex items-center text-lg cursor-pointer"
            disabled={!selectedCategory}
          >
            Add Line
          </button>
          <button
            onClick={() => {
              setCreateParentId(null);
              setIsCreateModalOpen(true);
            }}
            className="button-retro px-6 py-2 rounded font-retro flex items-center text-lg cursor-pointer"
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
                {topLevelNotes.map((note, index) => (
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
                          onDelete={(_id: number) => handleDeleteClick(note)}
                          onEdit={handleEditClick}
                          onToggleScratchOut={toggleNoteScratchOut}
                          onToggleImportant={toggleNoteImportant}
                          dragHandleProps={provided.dragHandleProps}
                          level={0}
                          onCreateChild={handleCreateChild}
                          displayIndex={index + 1}
                          hasChildren={hasChildren(note.id)}
                          expanded={!!expandedById[note.id]}
                          onToggleExpand={() => toggleExpand(note.id)}
                        />
                        {renderDescendants(note.id, 1)}
                        <div className="border-b border-synth-primary/30" />
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
        message={`Are you sure you want to delete this note?\n\n"${noteToDelete?.content || ''}"`}
      />

      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title={createParentId !== null ? "Create a sub note" : "Create a Note"}
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