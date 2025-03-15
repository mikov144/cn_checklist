// src/pages/Checklist.tsx

import { useState, useEffect } from "react";
import api from "../api";
import Note, { NoteProps } from "../components/Note";
import Header from "../components/Header";
import Modal from "../components/Modal";

interface FormData {
  title: string;
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
      <label htmlFor="title" className="block text-synth-secondary neon-text mb-2">
        Title:
      </label>
      <input
        type="text"
        id="title"
        name="title"
        required
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        value={formData.title}
        className="w-full p-2 border border-synth-primary rounded bg-synth-background text-synth-text neon-text focus:outline-none focus:ring-2 focus:ring-synth-secondary"
      />
    </div>

    <div>
      <label htmlFor="content" className="block text-synth-secondary neon-text mb-2">
        Content:
      </label>
      <textarea
        id="content"
        name="content"
        required
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
  const [notes, setNotes] = useState<NoteProps[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<NoteProps | null>(null);
  const [createFormData, setCreateFormData] = useState<FormData>({ title: "", content: "" });
  const [editFormData, setEditFormData] = useState<FormData>({ title: "", content: "" });

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const handleDeleteClick = (id: number) => {
    setNoteToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (note: NoteProps) => {
    setNoteToEdit(note);
    setEditFormData({ title: note.title, content: note.content });
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (noteToDelete === null) return;

    api
      .delete(`/api/notes/delete/${noteToDelete}/`)
      .then((res) => {
        if (res.status === 204) console.log("Note deleted!");
        else alert("Failed to delete note.");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .post("/api/notes/", createFormData)
      .then((res) => {
        if (res.status === 201) {
          console.log("Note created!");
          setCreateFormData({ title: "", content: "" });
          setIsCreateModalOpen(false);
        } else {
          alert("Failed to make note.");
        }
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const updateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteToEdit) return;

    api
      .put(`/api/notes/update/${noteToEdit.id}/`, editFormData)
      .then((res) => {
        if (res.status === 200) {
          console.log("Note updated!");
          setEditFormData({ title: "", content: "" });
          setIsEditModalOpen(false);
          setNoteToEdit(null);
        } else {
          alert("Failed to update note.");
        }
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ title: "", content: "" });
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditFormData({ title: "", content: "" });
    setNoteToEdit(null);
  };

  return (
    <div className="min-h-screen bg-synth-background pl-6 pr-6 pt-6 bg-cover bg-center" style={{ backgroundImage: "url('/images/_main-background.webp')" }}>
      <Header />
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-retro neon-text text-synth-primary">
            Notes
          </h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="button-retro px-6 py-2 rounded font-retro flex items-center text-lg"
          >
            Create Note
          </button>
        </div>
        <div className="notes-section mb-8">
          {notes.map((note) => (
            <Note 
              note={note} 
              onDelete={handleDeleteClick}
              onEdit={() => handleEditClick(note)}
              key={note.id} 
            />
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
      />

      {/* Create Note Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        title="Create a Note"
        showActions={false}
      >
        <NoteForm 
          onSubmit={createNote} 
          submitText="Create"
          formData={createFormData}
          setFormData={setCreateFormData}
          onCancel={handleCreateModalClose}
        />
      </Modal>

      {/* Edit Note Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Note"
        showActions={false}
      >
        <NoteForm 
          onSubmit={updateNote} 
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