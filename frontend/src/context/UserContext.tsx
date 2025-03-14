import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  refreshUserData: () => void;
  refreshTrigger: number;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshUserData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <UserContext.Provider value={{ refreshUserData, refreshTrigger }}>
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