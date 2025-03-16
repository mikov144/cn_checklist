import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import api from '../api';
import { NoteProps } from '../components/Note';

interface NotesContextType {
  notes: NoteProps[];
  loading: boolean;
  error: Error | null;
  refreshNotes: () => Promise<void>;
  createNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: number, title: string, content: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
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

  const createNote = useCallback(async (title: string, content: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/api/notes/', { title, content });
      await refreshNotes();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshNotes]);

  const updateNote = useCallback(async (id: number, title: string, content: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.put(`/api/notes/update/${id}/`, { title, content });
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

  return (
    <NotesContext.Provider value={{ 
      notes, 
      loading, 
      error, 
      refreshNotes, 
      createNote, 
      updateNote, 
      deleteNote 
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