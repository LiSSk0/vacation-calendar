import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vacations, setVacations] = useState([]);

    const login = async (credentials) => {
        try {
            setError(null);
            const { token, user } = await api.login(credentials.email, credentials.password);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            setError(err.message);
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
            const { token, user } = await api.register(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setIsAuthenticated(true);
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

    const deleteVacation = async (vacationId) => {
        try {
            setError(null);
            await api.deleteVacation(vacationId);
            setVacations(prev => prev.filter(v => v.id !== vacationId));
            if (user?.email) {
                const userVacations = JSON.parse(localStorage.getItem(`vacations_${user.email}`)) || [];
                const updatedVacations = userVacations.filter(v => v.id !== vacationId);
                localStorage.setItem(`vacations_${user.email}`, JSON.stringify(updatedVacations));
            }
            return true;
        } catch (err) {
            setError(err.message || 'Не удалось удалить отпуск');
            return false;
        }
    };

    const deleteAccount = async (email) => {
        try {
            setError(null);
            await api.deleteAccount(email);
            localStorage.removeItem(`vacations_${email}`);
            logout();
            return true;
        } catch (err) {
            setError(err.message || 'Не удалось удалить аккаунт');
            return false;
        }
    };

    useEffect(() => {
        const loadAuthData = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            if (token && storedUser) {
                try {
                    const userData = await api.verifyToken(token);
                    setUser(userData);
                    setIsAuthenticated(true);
                } catch (err) {
                    console.error('Token verification failed:', err);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        loadAuthData();
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
            login, 
            logout, 
            register,
            updateUser,
            deleteAccount
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);