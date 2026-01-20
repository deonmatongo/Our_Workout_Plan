import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, User } from '@/types/fitness';

interface UserContextType {
  currentUser: UserRole;
  setCurrentUser: (user: UserRole) => void;
  users: User[];
  getUser: (role: UserRole) => User;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUsers: User[] = [
  { id: 'partner1', name: 'Partner 1', color: '#3b82f6' }, // blue
  { id: 'partner2', name: 'Partner 2', color: '#ec4899' }, // pink
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserRole>(() => {
    const saved = localStorage.getItem('currentUser');
    return (saved as UserRole) || 'partner1';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  useEffect(() => {
    localStorage.setItem('currentUser', currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const getUser = (role: UserRole): User => {
    return users.find(u => u.id === role) || users[0];
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, users, getUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
