import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [passwordHint, setPasswordHint] = useState('');
  const [vacations, setVacations] = useState([]);

  const login = async (credentials) => {
    try {
      setError(null);
      const { token, user } = await apiLogin(credentials.email, credentials.password);
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setFailedAttempts(0); // Сброс счетчика при успешном входе
      setPasswordHint(''); // Очистка подсказки
      return true;
    } catch (err) {
      setError(err.message);
      setFailedAttempts(prev => prev + 1);
      
      // Сохраняем подсказку после первой неудачной попытки
      if (failedAttempts === 0 && credentials.password.length > 2) {
        setPasswordHint(`Подсказка: первые символы пароля - ${credentials.password.substring(0, 3)}`);
      }
      
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    try {
      setError(null);
      const { token, user } = await apiRegister(userData);
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
const addVacation = (vacation) => {
  const newVacations = [...vacations, vacation];
  setVacations(newVacations);
  localStorage.setItem(`vacations_${user.email}`, JSON.stringify(newVacations));
};

const deleteVacation = (vacationId) => {
  const newVacations = vacations.filter(v => v.id !== vacationId);
  setVacations(newVacations);
  localStorage.setItem(`vacations_${user.email}`, JSON.stringify(newVacations));
};
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        // Check if storedUser is not null or undefined before parsing
        if (storedUser && storedUser !== 'undefined') {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Clear invalid data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
        // Clear invalid data from storage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);
  
return (
  <AuthContext.Provider value={{ 
    user,
    vacations,
    addVacation,
    deleteVacation, 
      isAuthenticated, 
      loading,
      error,
      passwordHint, // Добавляем подсказку в контекст
      login, 
      logout, 
      register,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);