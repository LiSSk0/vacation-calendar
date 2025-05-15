import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import Modal from '../components/Modal';
import VacationForm from '../components/VacationForm';
import { useAuth } from '../context/AuthContext';
import { getVacations, getUsers, addVacation } from '../api';
import { DEPARTMENTS } from '../components/constants';
import './AuthProfile.css';

const HomePage = ({ refreshKey }) => {
  const currentDate = new Date();
  const { user } = useAuth();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vacations, setVacations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [apiVacations, usersData] = await Promise.all([
        getVacations(month, year),
        getUsers()
      ]);

      const localVacations = user?.email 
        ? JSON.parse(localStorage.getItem(`vacations_${user.email}`)) || []
        : [];

      const allVacations = [...apiVacations, ...localVacations];
      const uniqueVacations = allVacations.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        return x ? acc : [...acc, {
          ...current,
          startDate: current.startDate || current.fromDate,
          endDate: current.endDate || current.toDate,
          department: current.department || usersData.find(u => u.email === current.email)?.department
        }];
      }, []);

      setVacations(uniqueVacations);
      setEmployees(usersData.map(user => ({
        id: user.email,
        email: user.email,
        name: `${user.surname} ${user.name}`,
        fullName: `${user.surname} ${user.name} ${user.middlename}`,
        department: user.department 
      })));
    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [month, year, user, refreshKey]);

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleAddVacation = async (vacationData) => {
    try {
      if (!user?.email) throw new Error('Пользователь не авторизован');
      
      const newVacation = {
        id: Date.now(),
        email: user.email,
        startDate: vacationData.startDate,
        endDate: vacationData.endDate,
        department: user.department,
        reason: vacationData.reason,
        fromDate: vacationData.startDate,
        toDate: vacationData.endDate
      };

      await addVacation(newVacation);
      
      const localVacations = JSON.parse(localStorage.getItem(`vacations_${user.email}`)) || [];
      localStorage.setItem(
        `vacations_${user.email}`,
        JSON.stringify([...localVacations, newVacation])
      );

      setVacations(prev => [...prev, newVacation]);
      setIsAddModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddClick = () => {
    if (!user) {
      alert('Для добавления отпуска необходимо авторизоваться');
      return;
    }
    if (!user.department) {
      alert('Пожалуйста, укажите ваш отдел в профиле перед добавлением отпуска');
      return;
    }
    setIsAddModalOpen(true);
  };

  if (loading) return <div className="loading">Загрузка данных...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

   return (
    <div className="home-page">
      <Calendar 
        month={month}
        year={year}
        onMonthChange={handleMonthChange}
        onAddClick={handleAddClick}
        vacations={vacations}
        departments={DEPARTMENTS} 
        employees={employees}
      />

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Добавить отпуск"
      >
        <VacationForm 
          onSubmit={handleAddVacation}
          onCancel={() => setIsAddModalOpen(false)}
          user={user}
        />
      </Modal>
    </div>
  );
};

export default HomePage;