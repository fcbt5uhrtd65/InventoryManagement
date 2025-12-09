import type { User } from '../types/index';

const STORAGE_KEY = 'sgii_current_user';
const USERS_KEY = 'sgii_users';

export const initializeUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    const defaultUsers: User[] = [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@sgii.com',
        password: 'admin123',
        role: 'admin',
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Empleado Demo',
        email: 'empleado@sgii.com',
        password: 'emp123',
        role: 'empleado',
        active: true,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

export const login = (email: string, password: string): User | null => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
  const user = users.find(u => u.email === email && u.password === password && u.active);
  
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const getAllUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};
