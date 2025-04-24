// src/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  return await response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }
  return await response.json();
};

export const getUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
};

export const getDepartments = async () => {
  const response = await fetch(`${API_BASE_URL}/departments`);
  if (!response.ok) throw new Error('Failed to fetch departments');
  return await response.json();
};

export const getVacations = async (month, year, departmentId) => {
    try {
      const url = new URL(`${API_BASE_URL}/vacations`);
      url.searchParams.append('month', month);
      url.searchParams.append('year', year);
      if (departmentId) url.searchParams.append('department', departmentId);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка при загрузке отпусков');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
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
    throw new Error(error.error || 'Failed to add vacation');
  }
  return await response.json();
};