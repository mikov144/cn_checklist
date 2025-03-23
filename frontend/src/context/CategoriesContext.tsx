// src/context/CategoriesContext.tsx

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import api from '../api';

export interface Category {
  id: number;
  title: string;
}

interface CategoriesContextType {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: Error | null;
  refreshCategories: () => Promise<void>;
  createCategory: (title: string) => Promise<void>;
  updateCategory: (id: number, title: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  setSelectedCategory: (category: Category | null) => void;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/categories/');
      setCategories(response.data);
      
      // If there are categories but no selected category, select the first one
      if (response.data.length > 0 && !selectedCategory) {
        setSelectedCategory(response.data[0]);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const createCategory = useCallback(async (title: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/api/categories/', { title });
      await refreshCategories();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCategories]);

  const updateCategory = useCallback(async (id: number, title: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.put(`/api/categories/update/${id}/`, { title });
      await refreshCategories();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCategories]);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/api/categories/delete/${id}/`);
      await refreshCategories();
      
      // If the deleted category was selected, select the first available category
      if (selectedCategory?.id === id) {
        const remainingCategories = categories.filter(c => c.id !== id);
        setSelectedCategory(remainingCategories.length > 0 ? remainingCategories[0] : null);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCategories, selectedCategory, categories]);

  return (
    <CategoriesContext.Provider value={{
      categories,
      selectedCategory,
      loading,
      error,
      refreshCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      setSelectedCategory
    }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
} 