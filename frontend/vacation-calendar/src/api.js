// src/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Функция входа в систему
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка входа');
  }
  
  return await response.json();
};

// Функция регистрации
export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка регистрации');
  }
  
  return await response.json();
};

// Получение списка пользователей
export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  
  if (!response.ok) {
    throw new Error('Ошибка при загрузке пользователей');
  }
  
  return await response.json();
};

// Получение списка отделов
export const getDepartments = async () => {
  const response = await fetch(`${API_BASE_URL}/departments`);
  
  if (!response.ok) {
    throw new Error('Ошибка при загрузке отделов');
  }
  
  return await response.json();
};

// Получение отпусков
export const getVacations = async (month, year, departmentId, email) => {
  const url = new URL(`${API_BASE_URL}/vacations`);
  if (month) url.searchParams.append('month', month);
  if (year) url.searchParams.append('year', year);
  if (departmentId) url.searchParams.append('department', departmentId);
  if (email) url.searchParams.append('email', email);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка при загрузке отпусков');
  }
  
  return await response.json();
};

// Добавление отпуска
export const addVacation = async (vacationData) => {
  const response = await fetch(`${API_BASE_URL}/add_vacation`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(vacationData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Ошибка при добавлении отпуска');
  }
  
  return await response.json();
};
