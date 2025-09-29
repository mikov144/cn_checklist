// src/context/NotesContext.tsx

import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import api from '../api';
import { NoteProps } from '../components/Note';

interface NotesContextType {
  notes: NoteProps[];
  loading: boolean;
  error: Error | null;
  refreshNotes: () => Promise<void>;
  createNote: (content: string, category: number, parent?: number | null) => Promise<void>;
  updateNote: (id: number, content: string) => Promise<void>;
  toggleNoteScratchOut: (id: number, scratched_out: boolean) => Promise<void>;
  toggleNoteImportant: (id: number, important: boolean) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  reorderNotes: (noteIds: number[]) => Promise<void>;
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<NoteProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pendingRequest = useRef<Promise<void> | null>(null);

  const refreshNotes = useCallback(async () => {
    // If there's already a pending request, return it
    if (pendingRequest.current) {
      return pendingRequest.current;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create and store the new request
      const request = api.get('/api/notes/').then(response => {
        // Backend returns hierarchical order; preserve it
        setNotes(response.data);
      });
      pendingRequest.current = request;

      // Wait for the request to complete
      await request;
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
      pendingRequest.current = null;
    }
  }, []);

  const createNote = useCallback(async (content: string, category: number, parent?: number | null) => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/api/notes/', { content, category, parent: parent ?? null });
      await refreshNotes();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshNotes]);

  const updateNote = useCallback(async (id: number, content: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.patch(`/api/notes/update/${id}/`, { content });
      await refreshNotes();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshNotes]);

  const toggleNoteScratchOut = useCallback(async (id: number, scratched_out: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await api.patch(`/api/notes/update/${id}/`, { scratched_out });
      await refreshNotes();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshNotes]);

  const toggleNoteImportant = useCallback(async (id: number, important: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await api.patch(`/api/notes/update/${id}/`, { important });
      await refreshNotes();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshNotes]);

  const deleteNote = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/api/notes/delete/${id}/`);
      await refreshNotes();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshNotes]);

  const reorderNotes = useCallback(async (noteIds: number[]) => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/api/notes/order/', { ordering: noteIds });
      await refreshNotes();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshNotes]);

  return (
    <NotesContext.Provider value={{ 
      notes, 
      loading, 
      error, 
      refreshNotes, 
      createNote, 
      updateNote,
      toggleNoteScratchOut,
      toggleNoteImportant,
      deleteNote,
      reorderNotes 
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
} 