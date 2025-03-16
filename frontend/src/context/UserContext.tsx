import { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';

interface UserProfile {
  id: number;
  username: string;
  profile: {
    profile_picture: string | null;
  };
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pendingRequest = useRef<Promise<void> | null>(null);

  const refreshUserData = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setUser(null);
      return;
    }

    // If there's already a pending request, return it
    if (pendingRequest.current) {
      return pendingRequest.current;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Create and store the new request
      const request = api.get('/api/user/').then(response => {
        setUser(response.data);
      });
      pendingRequest.current = request;

      // Wait for the request to complete
      await request;
    } catch (err) {
      setError(err as Error);
      setUser(null);
    } finally {
      setLoading(false);
      pendingRequest.current = null;
    }
  }, []);

  // Initial load of user data
  useEffect(() => {
    refreshUserData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 