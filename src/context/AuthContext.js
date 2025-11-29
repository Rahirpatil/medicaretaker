import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock users for demo purposes
  const mockUsers = [
    { email: 'patient@test.com', password: '123456', roles: ['patient'] },
    { email: 'caretaker@test.com', password: '123456', roles: ['caretaker'] },
    { email: 'both@test.com', password: '123456', roles: ['patient', 'caretaker'] },
    { email: 'admin@test.com', password: '123456', roles: ['admin'] },
  ];

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        const userData = {
          email: foundUser.email,
          roles: foundUser.roles,
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return { success: true, user: userData };
      } else {
        setLoading(false);
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const checkAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};


