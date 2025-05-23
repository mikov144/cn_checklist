// src/components/CategoryTabs.tsx

import { useState } from 'react';
import { Category } from '../context/CategoriesContext';
import Modal from './Modal';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

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
  const [createFormData, setCreateFormData] = useState<CategoryFormData>({ title: '' });
  const [editFormData, setEditFormData] = useState<CategoryFormData>({ title: '' });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCategory(createFormData.title);
    setCreateFormData({ title: '' });
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryToEdit) {
      onUpdateCategory(categoryToEdit.id, editFormData.title);
      setEditFormData({ title: '' });
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
    setEditFormData({ title: category.title });
    setIsEditModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ title: '' });
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditFormData({ title: '' });
    setCategoryToEdit(null);
  };

  return (
    <div>
      <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className={`px-2 sm:px-4 py-2 rounded-t-lg font-retro transition-all duration-200 bg-synth-primary text-synth-background shadow-[0_0_10px_rgba(150,150,150,0.5)] border-b-2 border-grey-500 flex items-center gap-2
              ${selectedCategory?.id === category.id
                ? 'bg-synth-primary text-synth-background shadow-[0_0_10px_rgba(255,0,255,0.5)] border-b-2 border-pink-500'
                : 'bg-gray-600/40 text-gray-300 shadow-[0_0_10px_rgba(100,100,100,0.3)] border-gray-500 hover:bg-gray-500/70 hover:text-white hover:shadow-[0_0_10px_rgba(150,150,150,0.4)]'
              }`}
          >
            <span className="truncate text-sm sm:text-base">{category.title}</span>
            <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(category);
                }}
                className={`p-0.5 sm:p-1 rounded transition-colors ${
                  selectedCategory?.id === category.id
                    ? 'text-synth-secondary hover:text-pink-500 active:opacity-70 active:scale-95 active:text-pink-600'
                    : 'text-gray-400 hover:text-gray-200 active:opacity-70 active:scale-95 active:text-gray-300'
                }`}
              >
                <PencilSquareIcon className="w-4.5 h-4.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoryToDelete(category);
                  setIsDeleteModalOpen(true);
                }}
                className={`p-0.5 sm:p-1 rounded transition-colors ${
                  selectedCategory?.id === category.id
                    ? 'text-red-500 hover:text-red-400 active:opacity-70 active:scale-95 active:text-red-600'
                    : 'text-red-400/50 hover:text-red-400 active:opacity-70 active:scale-95 active:text-red-500'
                }`}
              >
                <TrashIcon className="w-4.5 h-4.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </button>
        ))}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 sm:px-4 py-2 rounded-lg border-2 border-synth-primary text-synth-primary whitespace-nowrap
            transition-all duration-200 font-retro text-sm sm:text-base
            hover:text-[#33f06b] hover:border-[#33f06b]
            hover:bg-synth-primary/10
            hover:shadow-[0_0_15px_rgba(255,0,255,0.3)]
            active:opacity-80
            active:scale-95
            active:shadow-[0_0_10px_rgba(255,0,255,0.2)]
            active:bg-synth-primary/20"
        >
          + New Category
        </button>
      </div>

      {/* Create Category Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
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
              value={createFormData.title}
              onChange={(e) => setCreateFormData({ title: e.target.value })}
              className="w-full p-2 border border-synth-primary rounded bg-synth-background text-synth-text neon-text"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCreateModalClose}
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
        onClose={handleEditModalClose}
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
              value={editFormData.title}
              onChange={(e) => setEditFormData({ title: e.target.value })}
              className="w-full p-2 border border-synth-primary rounded bg-synth-background text-synth-text neon-text"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleEditModalClose}
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