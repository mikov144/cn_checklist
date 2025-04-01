// src/components/CategoryTabs.tsx

import { useState } from 'react';
import { Category } from '../context/CategoriesContext';
import Modal from './Modal';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onCreateCategory: (title: string) => void;
  onUpdateCategory: (id: number, title: string) => void;
  onDeleteCategory: (id: number) => void;
}

interface CategoryFormData {
  title: string;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory
}: CategoryTabsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ title: '' });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCategory(formData.title);
    setFormData({ title: '' });
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryToEdit) {
      onUpdateCategory(categoryToEdit.id, formData.title);
      setFormData({ title: '' });
      setCategoryToEdit(null);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (category: Category) => {
    setCategoryToEdit(category);
    setFormData({ title: category.title });
    setIsEditModalOpen(true);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center">
            <button
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-t-lg font-retro transition-all duration-200
                ${selectedCategory?.id === category.id
                  ? 'bg-synth-primary text-synth-background shadow-[0_0_10px_rgba(255,0,255,0.5)] border-b-2 border-pink-500'
                  : 'text-synth-primary hover:text-pink-500 hover:bg-synth-primary/10'
                }`}
            >
              {category.title}
            </button>
            <div className="flex space-x-1 ml-1">
              <button
                onClick={() => openEditModal(category)}
                className="p-1 text-synth-secondary hover:text-pink-500 transition-colors"
              >
                ✎
              </button>
              <button
                onClick={() => {
                  setCategoryToDelete(category);
                  setIsDeleteModalOpen(true);
                }}
                className="p-1 text-red-500 hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-lg border-2 border-synth-primary text-synth-primary
            transition-all duration-200 font-retro
            hover:text-pink-500 hover:border-pink-500
            hover:bg-synth-primary/10
            hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]"
        >
          + New Category
        </button>
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Category"
        showActions={false}
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-synth-secondary neon-text mb-2">
              Title:
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
              className="w-full p-2 border border-synth-primary rounded bg-synth-background text-synth-text neon-text"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
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
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCategoryToEdit(null);
        }}
        title="Edit Category"
        showActions={false}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-synth-secondary neon-text mb-2">
              Title:
            </label>
            <input
              type="text"
              id="edit-title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
              className="w-full p-2 border border-synth-primary rounded bg-synth-background text-synth-text neon-text"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setCategoryToEdit(null);
              }}
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
              Update
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.title}"?`}
      />
    </div>
  );
} 