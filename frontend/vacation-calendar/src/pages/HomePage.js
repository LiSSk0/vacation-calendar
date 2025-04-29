// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import Calendar from '../components/Calendar';
import AddVacationModal from '../components/AddVacationModal';
import { useAuth } from '../context/AuthContext';
import { getVacations, getDepartments, getUsers, addVacation } from '../api';

const HomePage = () => {
  const currentDate = new Date();
  const { user } = useAuth();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vacations, setVacations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка данных при монтировании и изменении месяца/года
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [vacationsData, departmentsData, usersData] = await Promise.all([
          getVacations(month, year),
          getDepartments(),
          getUsers()
        ]);

        // Обработка данных о сотрудниках
        const processedEmployees = usersData.map(user => ({
          id: user.email,
          email: user.email,
          name: `${user.surname} ${user.name}`,
          fullName: `${user.surname} ${user.name} ${user.middlename}`,
          department: user.department || 1
        }));

        setVacations(vacationsData);
        setDepartments(departmentsData);
        setEmployees(processedEmployees);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  // Обработчик изменения месяца/года
  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  // Добавление нового отпуска
  const handleAddVacation = async (vacationData) => {
    try {
      if (!user?.email) {
        throw new Error('Пользователь не авторизован');
      }

      if (!user.department) {
        throw new Error('Для добавления отпуска укажите отдел в профиле');
      }

      const newVacation = await addVacation({
        email: user.email,
        fromDate: vacationData.startDate,
        toDate: vacationData.endDate,
        department: user.department,
        reason: vacationData.reason
      });

      // Обновляем список отпусков
      setVacations(prev => [...prev, newVacation]);
      setIsAddModalOpen(false);
    } catch (err) {
      setError(err.message);
      alert(`Ошибка: ${err.message}`);
    }
  };

  // Проверка авторизации перед открытием модального окна
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
        departments={departments}
        employees={employees}
      />

      <AddVacationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddVacation}
        user={user}
      />
    </div>
  );
};

export default HomePage;